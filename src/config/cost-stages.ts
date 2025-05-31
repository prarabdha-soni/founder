export const COST_BY_STAGE = {
  MVP_STAGE: {
    description: "0-100 users, basic features",
    monthly_total: "$400-600",
    breakdown: {
      ai_services: "$150-250 (biggest cost)",
      database: "$75 (PostgreSQL + Vector DB)",
      hosting: "$50",
      auth: "$25",
      integrations: "$70",
      monitoring: "$35",
      domain_ssl: "$15"
    },
    cost_per_user: "$4-6/month"
  },

  GROWTH_STAGE: {
    description: "100-1000 users, full features",
    monthly_total: "$1200-2000",
    breakdown: {
      ai_services: "$600-1000",
      database: "$300",
      hosting: "$200",
      auth: "$240",
      integrations: "$200",
      monitoring: "$150",
      support_tools: "$100"
    },
    cost_per_user: "$1.20-2.00/month"
  },

  SCALE_STAGE: {
    description: "1000+ users, enterprise features",
    monthly_total: "$4000-8000",
    breakdown: {
      ai_services: "$2000-4000",
      database: "$800",
      hosting: "$1000",
      auth: "$500",
      integrations: "$500",
      monitoring: "$300",
      team_tools: "$400"
    },
    cost_per_user: "$0.80-1.50/month"
  }
}; 