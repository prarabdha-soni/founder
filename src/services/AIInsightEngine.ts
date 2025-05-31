import { OpenAI } from 'openai';
import { ChromaClient } from 'chromadb';
import { Pool } from 'pg';

interface TenantContext {
  tenantId: string;
  userId: string;
}

export class AIInsightEngine {
  private openai: OpenAI;
  private chroma: ChromaClient;
  private db: Pool;
  private context: TenantContext;

  constructor(context: TenantContext) {
    this.context = context;
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.chroma = new ChromaClient({ path: process.env.CHROMA_URL });
    this.db = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async processConversation(conversationId: string) {
    // Get conversation content
    const conversation = await this.db.query(
      'SELECT * FROM conversations WHERE id = $1 AND tenant_id = $2',
      [conversationId, this.context.tenantId]
    );

    if (!conversation.rows.length) throw new Error('Conversation not found');

    const content = conversation.rows[0].content;

    // AI analysis
    const analysis = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `You are a sales AI analyzing conversations for a lending/fintech founder. 
                 Extract: sentiment, key topics, objections, next actions, deal signals.
                 Return JSON only.`
      }, {
        role: "user",
        content: `Analyze this sales conversation:\n\n${content}`
      }],
      response_format: { type: "json_object" }
    });

    const insights = JSON.parse(analysis.choices[0].message.content);

    // Store insights
    await this.db.query(
      'UPDATE conversations SET ai_insights = $1 WHERE id = $2',
      [JSON.stringify(insights), conversationId]
    );

    return insights;
  }

  async intelligentRecall({ query, contextType, filters }) {
    // Semantic search with AI ranking
    const collection = await this.chroma.getCollection({
      name: `conversations_${this.context.tenantId}`
    });

    const results = await collection.query({
      queryTexts: [query],
      nResults: 20,
      where: this.buildSearchFilters(filters)
    });

    // Re-rank with GPT for relevance
    const reranked = await this.rerankResults(query, results, contextType);
    
    return reranked;
  }

  async generateDealIntelligence(prospect: string) {
    // Get all prospect data
    const prospectData = await this.db.query(`
      SELECT c.*, p.company_size, p.industry, p.budget_range 
      FROM conversations c 
      LEFT JOIN prospects p ON c.participant_name = p.name 
      WHERE c.participant_name = $1 AND c.tenant_id = $2 
      ORDER BY c.created_at DESC
    `, [prospect, this.context.tenantId]);

    if (!prospectData.rows.length) {
      throw new Error('No data found for this prospect');
    }

    // AI analysis for win probability
    const intelligence = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `You are a sales AI that predicts deal outcomes for a lending/fintech business.
                 Analyze conversation history and provide: win probability (0-100%), stage, risks, actions.
                 Consider: engagement level, objections, decision-maker involvement, timeline urgency.`
      }, {
        role: "user",
        content: `Analyze this prospect:\n${JSON.stringify(prospectData.rows, null, 2)}`
      }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(intelligence.choices[0].message.content);
  }

  async generateFollowup({ prospect, channel, tone }) {
    // Get recent conversation context
    const recentConversations = await this.db.query(`
      SELECT content, ai_insights, created_at 
      FROM conversations 
      WHERE participant_name = $1 AND tenant_id = $2 
      ORDER BY created_at DESC 
      LIMIT 3
    `, [prospect, this.context.tenantId]);

    const context = recentConversations.rows
      .map(r => `${r.created_at}: ${r.content}`)
      .join('\n\n');

    const followup = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `You are writing follow-up messages for a lending/fintech founder.
                 Channel: ${channel}, Tone: ${tone}
                 Make it personal, reference specific conversation points, include clear CTA.
                 Return JSON with: subject, message, reasoning, optimalTiming.`
      }, {
        role: "user",
        content: `Write follow-up for ${prospect} based on:\n\n${context}`
      }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(followup.choices[0].message.content);
  }

  async getObjectionPlaybook(objection: string, prospectContext?: string) {
    // Find similar objections and successful responses
    const similarObjections = await this.db.query(`
      SELECT c.*, c.ai_insights->>'outcome' as outcome
      FROM conversations c 
      WHERE c.ai_insights->>'objections' LIKE $1 
      AND c.tenant_id = $2
      ORDER BY c.created_at DESC
    `, [`%${objection}%`, this.context.tenantId]);

    // Calculate success rates
    const successful = similarObjections.rows.filter(r => 
      r.outcome === 'positive' || r.deal_stage === 'closed_won'
    );

    const successRate = similarObjections.rows.length > 0 
      ? Math.round((successful.length / similarObjections.rows.length) * 100)
      : 0;

    // Generate AI responses
    const playbook = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `Generate objection handling responses for a lending/fintech business.
                 Provide 3 proven responses ranked by effectiveness, plus follow-up questions.`
      }, {
        role: "user",
        content: `Objection: "${objection}"\nContext: ${prospectContext}\nSuccessful patterns: ${JSON.stringify(successful.slice(0, 3))}`
      }],
      response_format: { type: "json_object" }
    });

    const responses = JSON.parse(playbook.choices[0].message.content);
    
    return {
      successRate,
      dataPoints: similarObjections.rows.length,
      ...responses
    };
  }

  private buildSearchFilters(filters: any) {
    const where: any = { tenant_id: this.context.tenantId };
    
    if (filters.person) where.participant_name = filters.person;
    if (filters.company) where.participant_company = filters.company;
    if (filters.industry) where.industry = filters.industry;
    
    return where;
  }

  private async rerankResults(query: string, results: any, contextType?: string) {
    // AI re-ranking for better relevance
    const reranking = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: `Rerank search results by relevance to query. Return array of indices.`
      }, {
        role: "user",
        content: `Query: ${query}\nContext: ${contextType}\nResults: ${JSON.stringify(results.documents[0])}`
      }]
    });

    // Process and return reranked results
    return this.processRankedResults(results, reranking.choices[0].message.content);
  }

  private processRankedResults(results: any, ranking: string) {
    // Implementation for processing ranked results
    return results.documents[0].map((doc: string, i: number) => ({
      participant: results.metadatas[0][i].participant_name,
      company: results.metadatas[0][i].participant_company,
      source: results.metadatas[0][i].conversation_type,
      snippet: doc.substring(0, 200) + '...',
      timeAgo: this.formatTimeAgo(results.metadatas[0][i].timestamp),
      relevance: 1 - (results.distances[0][i] || 0)
    }));
  }

  private formatTimeAgo(timestamp: string): string {
    const diff = Date.now() - new Date(timestamp).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Today' : `${days} days ago`;
  }
} 