export const FREE_TIER_LIMITS = {
  SUPABASE: {
    database_size: "500MB",
    api_requests: "Unlimited",
    auth_users: "50,000 MAU",
    storage: "1GB",
    bandwidth: "2GB/month",
    sufficient_for: "First 500+ users easily"
  },

  VERCEL: {
    deployments: "Unlimited", 
    bandwidth: "100GB/month",
    build_minutes: "6,000/month",
    team_members: "1 (you)",
    sufficient_for: "Thousands of users"
  },

  OPENAI: {
    your_cost: "$50-150/month",
    optimization_tips: [
      "Use gpt-3.5-turbo for simple queries ($0.0005/1K tokens)",
      "Use gpt-4 only for complex analysis ($0.03/1K tokens)", 
      "Cache frequent AI responses",
      "Batch process conversations"
    ]
  },

  UPGRADE_TRIGGERS: {
    database: "When you hit 400MB usage",
    hosting: "When you hit 80GB bandwidth", 
    auth: "When you get 40K+ monthly users",
    timeline: "Probably month 6-12 for successful product"
  }
}; 