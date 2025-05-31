export const MVP_REQUIRED_SERVICES = {
  MUST_HAVES: {
    database: "PostgreSQL ($25/month - Supabase)",
    vector_db: "Self-hosted ChromaDB ($30/month VPS)",
    ai_service: "OpenAI API ($200/month budget)",
    hosting: "Railway ($20/month)",
    auth: "Supabase Auth (Free)",
    payments: "Stripe (2.9% per transaction)",
    domain: "Namecheap ($12/year)"
  },
  
  NICE_TO_HAVES: {
    monitoring: "Self-hosted analytics ($0)",
    email: "Resend ($20/month)",
    redis: "Railway Redis ($10/month)"
  },

  MVP_TOTAL: "$307/month to get started",
  
  BREAK_EVEN: "63 users at $49/month = $3087 revenue"
}; 