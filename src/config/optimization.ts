export const COST_OPTIMIZATIONS = {
  AI_COSTS: {
    problem: "AI is 60% of total costs",
    solutions: [
      "Use GPT-3.5 for simple recall queries (-70% cost)",
      "Cache frequent AI responses (-40% cost)", 
      "Batch process conversations (-30% cost)",
      "Use local embeddings for some features (-50% embedding cost)"
    ]
  },

  DATABASE_COSTS: {
    problem: "Vector DB can be expensive",
    solutions: [
      "Start with self-hosted ChromaDB",
      "Use PostgreSQL pgvector extension",
      "Implement smart data archiving",
      "Regional data distribution"
    ]
  },

  SCALING_COSTS: {
    problem: "Linear cost growth kills margins",
    solutions: [
      "Implement usage-based pricing",
      "AI model fine-tuning for efficiency",
      "Multi-tenant architecture optimization",
      "Smart caching layers"
    ]
  }
}; 