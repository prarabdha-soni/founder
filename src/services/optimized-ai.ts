import { OpenAI } from 'openai';

export class OptimizedAIService {
  private openai: OpenAI;
  private responseCache = new Map<string, any>();

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  // Use cheap GPT-3.5 for simple operations
  async simpleRecall(query: string) {
    return this.openai.chat.completions.create({
      model: "gpt-3.5-turbo", // $0.0005/1K tokens vs $0.03 for GPT-4
      messages: [{ role: "user", content: query }],
      max_tokens: 150 // Limit response length
    });
  }

  // Use GPT-4 only for complex analysis
  async deepAnalysis(conversation: string) {
    return this.openai.chat.completions.create({
      model: "gpt-4o-mini", // Cheaper than full GPT-4
      messages: [{ role: "user", content: conversation }],
      max_tokens: 500
    });
  }

  // Cache frequent responses to save API calls
  async cachedQuery(query: string) {
    const cacheKey = query.toLowerCase().trim();
    if (this.responseCache.has(cacheKey)) {
      return this.responseCache.get(cacheKey);
    }
    
    const response = await this.simpleRecall(query);
    this.responseCache.set(cacheKey, response);
    return response;
  }

  async extractConversationInsights(content: string) {
    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: `Extract key insights from this sales conversation:
        - Key points discussed
        - Objections raised
        - Next steps mentioned
        - Deal stage assessment
        - Sentiment analysis
        
        Return as JSON with keys: keyPoints, objections, nextSteps, dealStage, sentiment`
      }, {
        role: "user",
        content: content
      }],
      max_tokens: 400
    });

    try {
      return JSON.parse(response.choices[0].message.content || '{}');
    } catch {
      return {
        keyPoints: [],
        objections: [],
        nextSteps: [],
        dealStage: "unknown",
        sentiment: "neutral"
      };
    }
  }
} 