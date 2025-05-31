export const MONGODB_SETUP = {
  VECTOR_SEARCH_INDEX: {
    name: "vector_index",
    definition: {
      fields: [
        {
          type: "vector",
          path: "embedding",
          numDimensions: 1536, // For OpenAI embeddings
          similarity: "cosine"
        },
        {
          type: "filter", 
          path: "tenantId"
        }
      ]
    },
    note: "Create this index in MongoDB Atlas UI under Search > Create Index"
  },

  ENVIRONMENT_VARIABLES: {
    MONGODB_URL: "Your MongoDB Atlas connection string",
    OPENAI_API_KEY: "Your OpenAI API key",
    TENANT_ID: "default",
    USER_ID: "founder"
  },

  FREE_TIER_LIMITS: {
    storage: "512MB",
    vector_search: "Included in M10+ clusters ($57/month)",
    alternative: "Use regular text search for MVP (free M0 cluster)"
  }
}; 