export const MONTHLY_SERVICE_COSTS = {
  // Database & Storage
  DATABASES: {
    postgresql: {
      service: "AWS RDS PostgreSQL",
      startup_cost: "$50/month (db.t3.medium)",
      scale_cost: "$200-500/month",
      alternatives: ["PlanetScale: $29/month", "Supabase: $25/month"]
    },
    vectordb: {
      service: "Pinecone (vector search)",
      startup_cost: "$70/month (1M vectors)",
      scale_cost: "$200-800/month",
      alternatives: ["Weaviate Cloud: $25/month", "Self-hosted ChromaDB: $30/month server"]
    }
  },

  // AI Services (THE BIG ONE)
  AI_SERVICES: {
    openai: {
      service: "OpenAI GPT-4",
      startup_cost: "$200-500/month",
      scale_cost: "$2000-5000/month",
      usage: "~$0.03 per conversation analysis",
      optimization: "Use GPT-3.5 for simple tasks: $50-100/month"
    },
    embeddings: {
      service: "OpenAI Embeddings",
      startup_cost: "$50-100/month", 
      scale_cost: "$200-500/month",
      usage: "$0.0001 per 1K tokens"
    }
  },

  // Hosting & Infrastructure
  INFRASTRUCTURE: {
    hosting: {
      service: "AWS/Railway/Vercel",
      startup_cost: "$50-100/month",
      scale_cost: "$200-1000/month",
      includes: "Server, CDN, storage, bandwidth"
    },
    redis: {
      service: "Redis Cloud (caching)",
      startup_cost: "$15/month",
      scale_cost: "$50-200/month"
    }
  },

  // Authentication & Payments
  BUSINESS_SERVICES: {
    auth: {
      service: "Auth0",
      startup_cost: "$23/month (up to 1000 users)",
      scale_cost: "$240/month (7500 users)",
      alternatives: ["Clerk: $25/month", "Supabase Auth: Free tier"]
    },
    payments: {
      service: "Stripe",
      cost: "2.9% + $0.30 per transaction",
      monthly_fee: "$0 (transaction-based)"
    }
  },

  // External Integrations
  INTEGRATIONS: {
    whatsapp: {
      service: "WhatsApp Business API",
      startup_cost: "$50-100/month",
      scale_cost: "$200-500/month",
      alternatives: ["Twilio WhatsApp: $0.005 per message"]
    },
    email: {
      service: "SendGrid",
      startup_cost: "$20/month (40K emails)",
      scale_cost: "$90/month (100K emails)"
    },
    gmail_integration: {
      service: "Google Workspace API",
      cost: "$0 (free tier sufficient for most use cases)"
    }
  },

  // Monitoring & Analytics
  OBSERVABILITY: {
    monitoring: {
      service: "DataDog",
      startup_cost: "$15/month",
      scale_cost: "$100-300/month",
      alternatives: ["New Relic: $25/month", "Self-hosted: $10/month"]
    },
    analytics: {
      service: "Mixpanel",
      startup_cost: "$20/month",
      scale_cost: "$100-400/month",
      alternatives: ["PostHog: $20/month", "Google Analytics: Free"]
    }
  }
}; 