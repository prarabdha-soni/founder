import { MongoClient, Collection } from 'mongodb';
import { OpenAI } from 'openai';

interface ConversationRecord {
  _id?: string;
  participantName: string;
  participantCompany: string;
  content: string;
  type: string;
  dealStage: string;
  keyPoints: string[];
  objections: string[];
  nextSteps: string[];
  embedding?: number[];
  createdAt: Date;
  tenantId: string;
  userId: string;
}

interface TenantContext {
  tenantId: string;
  userId: string;
}

export class SalesMemoryManager {
  private mongodb: MongoClient;
  private conversations: Collection<ConversationRecord>;
  private openai: OpenAI;
  private context: TenantContext;

  constructor(context: TenantContext) {
    this.context = context;
    this.mongodb = new MongoClient(process.env.MONGODB_URL!);
    this.conversations = this.mongodb.db('sales_memory').collection('conversations');
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async captureConversation(record: Omit<ConversationRecord, '_id' | 'createdAt' | 'tenantId' | 'userId'>) {
    // Generate embedding for vector search
    const embedding = await this.generateEmbedding(record.content);
    
    const conversationDoc: ConversationRecord = {
      ...record,
      embedding,
      createdAt: new Date(),
      tenantId: this.context.tenantId,
      userId: this.context.userId
    };

    const result = await this.conversations.insertOne(conversationDoc);
    
    // AI-powered analysis
    const insights = await this.analyzeConversation(record.content);
    
    return {
      id: result.insertedId,
      insights,
      suggestions: this.generateActionSuggestions(record)
    };
  }

  async smartRecall(query: string, limit: number = 5) {
    // Generate embedding for the query
    const queryEmbedding = await this.generateEmbedding(query);
    
    // MongoDB Atlas Vector Search (if you have it enabled)
    const results = await this.conversations.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding", 
          queryVector: queryEmbedding,
          numCandidates: 50,
          limit: limit
        }
      },
      {
        $match: {
          tenantId: this.context.tenantId
        }
      },
      {
        $project: {
          participantName: 1,
          participantCompany: 1,
          content: 1,
          type: 1,
          dealStage: 1,
          createdAt: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ]).toArray();

    return results.map(r => ({
      participant: r.participantName,
      company: r.participantCompany,
      source: r.type,
      snippet: r.content.substring(0, 200) + '...',
      timeAgo: this.formatTimeAgo(r.createdAt),
      relevance: r.score || 0
    }));
  }

  async getProspectContext(prospectName: string) {
    const conversations = await this.conversations
      .find({ 
        participantName: prospectName,
        tenantId: this.context.tenantId 
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    if (!conversations.length) {
      return null;
    }

    const latest = conversations[0];
    const allObjections = conversations.flatMap(c => c.objections || []);
    const allNextSteps = conversations.flatMap(c => c.nextSteps || []);

    return {
      currentStage: latest.dealStage,
      lastContact: latest.createdAt,
      totalInteractions: conversations.length,
      openObjections: [...new Set(allObjections)],
      nextSteps: [...new Set(allNextSteps)],
      recentContext: conversations.slice(0, 3).map(c => 
        `${c.type} on ${c.createdAt.toDateString()}: ${c.keyPoints?.join(', ') || 'No key points'}`
      ).join('\n')
    };
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: "text-embedding-3-small", // Cheaper than text-embedding-ada-002
      input: text
    });
    return response.data[0].embedding;
  }

  private async analyzeConversation(content: string) {
    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "Analyze this sales conversation and extract key insights, objections, and sentiment."
      }, {
        role: "user", 
        content: content
      }],
      max_tokens: 300
    });

    return response.choices[0].message.content;
  }

  private generateActionSuggestions(record: ConversationRecord): string[] {
    const suggestions: string[] = [];
    
    if (record.objections?.length > 0) {
      suggestions.push(`Address ${record.objections[0]} objection with case study`);
    }
    
    if (record.dealStage === 'demo_requested') {
      suggestions.push("Schedule technical demo within 48 hours");
    }
    
    if (record.nextSteps?.length > 0) {
      suggestions.push(`Follow up on: ${record.nextSteps[0]}`);
    }
    
    suggestions.push("Send personalized follow-up email within 24 hours");
    
    return suggestions;
  }

  private formatTimeAgo(date: Date): string {
    const diff = Date.now() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Today' : `${days} days ago`;
  }
} 