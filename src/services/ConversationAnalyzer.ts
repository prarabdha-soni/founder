import { Pool } from 'pg';

export class ConversationAnalyzer {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/lending_sales'
    });
  }

  async analyzeObjections(objectionType?: string, timePeriod?: string) {
    let query = `
      SELECT objections, deal_stage, created_at 
      FROM conversations 
      WHERE objections != '[]' AND objections IS NOT NULL
    `;
    
    if (timePeriod) {
      query += ` AND created_at >= NOW() - INTERVAL '${timePeriod}'`;
    }
    
    const result = await this.db.query(query);
    const conversations = result.rows;
    
    // Flatten all objections
    const allObjections = conversations.flatMap(c => 
      JSON.parse(c.objections || '[]')
    );
    
    // Count frequency
    const objectionCounts = allObjections.reduce((acc, obj) => {
      acc[obj] = (acc[obj] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate success rates
    const successfulDeals = conversations.filter(c => 
      c.deal_stage === 'closed_won'
    ).length;
    
    const successRate = conversations.length > 0 
      ? Math.round((successfulDeals / conversations.length) * 100)
      : 0;
    
    return {
      mostCommon: Object.entries(objectionCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([objection]) => objection),
      successRate,
      recommendedResponses: this.getRecommendedResponses(objectionType)
    };
  }

  private getRecommendedResponses(objectionType?: string) {
    const responses = {
      'api_latency': [
        'Share performance benchmarks showing <2s response times',
        'Offer dedicated infrastructure for enterprise clients',
        'Provide SLA guarantees with penalty clauses'
      ],
      'pricing': [
        'Break down ROI calculations showing cost savings',
        'Offer tiered pricing based on volume',
        'Provide trial period with success-based pricing'
      ],
      'integration': [
        'Demonstrate plug-and-play API integration',
        'Offer dedicated technical support during integration',
        'Share integration timelines from similar clients'
      ]
    };
    
    return responses[objectionType as keyof typeof responses] || [
      'Acknowledge the concern and ask for specific requirements',
      'Provide relevant case studies and testimonials',
      'Offer a proof of concept or pilot program'
    ];
  }
} 