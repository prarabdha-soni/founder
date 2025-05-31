export const FREE_MVP_STACK = {
  description: "Maximum free tier usage for MVP validation",
  
  CORE_SERVICES: {
    database: {
      service: "Supabase Free Tier",
      cost: "$0/month",
      limits: "500MB storage, 50MB file uploads, 2GB bandwidth",
      sufficient_for: "First 100-500 users easily"
    },
    
    vector_database: {
      service: "Supabase + pgvector extension",
      cost: "$0/month", 
      limits: "Same as database limits",
      note: "pgvector is built into Supabase PostgreSQL"
    },
    
    hosting: {
      service: "Vercel Free Tier", 
      cost: "$0/month",
      limits: "100GB bandwidth, 1000 build minutes",
      sufficient_for: "Handles thousands of users"
    },
    
    ai_service: {
      service: "Your existing OpenAI API key",
      estimated_cost: "$50-150/month (depends on usage)",
      optimization: "Use GPT-3.5-turbo for most operations"
    }
  },

  ADDITIONAL_FREE_SERVICES: {
    authentication: {
      service: "Supabase Auth",
      cost: "$0/month",
      limits: "50,000 monthly active users",
      features: "Email/password, OAuth, magic links"
    },
    
    file_storage: {
      service: "Supabase Storage", 
      cost: "$0/month",
      limits: "1GB storage",
      use_case: "Store conversation attachments"
    },
    
    monitoring: {
      service: "Vercel Analytics + Supabase Dashboard",
      cost: "$0/month",
      features: "Basic metrics, database monitoring"
    },
    
    domain: {
      service: "Vercel subdomain",
      cost: "$0/month",
      example: "your-app.vercel.app"
    }
  },

  TOTAL_MONTHLY_COST: "$50-150 (only OpenAI API usage)",
  BREAK_EVEN_POINT: "2-3 paying users at $49/month"
}; 