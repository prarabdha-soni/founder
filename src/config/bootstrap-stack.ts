export const BOOTSTRAP_STACK = {
  description: "Ultra-low-cost MVP for early validation",
  
  services: {
    database: "Supabase Free tier",
    vector_db: "SQLite + pgvector ($0)",
    ai: "OpenAI with $100/month budget", 
    hosting: "Vercel Free tier",
    auth: "Supabase Auth (Free)",
    payments: "Stripe (transaction fees only)",
    monitoring: "Vercel Analytics (Free)"
  },

  total_cost: "$100-150/month",
  limitations: [
    "500MB database limit",
    "100K vector storage", 
    "Limited AI calls",
    "No custom domain"
  ],

  graduation_trigger: "50+ paying customers"
}; 