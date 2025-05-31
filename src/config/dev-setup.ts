export const DEV_ENVIRONMENT = {
  LOCAL_DEVELOPMENT: {
    database: "Supabase (same as production)",
    vector_db: "pgvector in Supabase",
    ai_service: "Your OpenAI key (minimal usage during dev)",
    hosting: "localhost:3000",
    cost: "$5-10/month in OpenAI testing"
  },

  STAGING_ENVIRONMENT: {
    option_1: "Vercel Preview Deployments (Free)",
    option_2: "Railway Free Tier ($0/month)",
    option_3: "Same Supabase project with different schema"
  },

  MONITORING_FREE: {
    basic_analytics: "Vercel Analytics",
    error_tracking: "Supabase Dashboard",
    uptime_monitoring: "UptimeRobot (Free for 50 monitors)",
    user_analytics: "Plausible (Free for 10K pageviews)"
  }
}; 