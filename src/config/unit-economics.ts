export const UNIT_ECONOMICS = {
  FOUNDER_PLAN: {
    price: "$49/month",
    cost_to_serve: "$8/month",
    gross_margin: "84%",
    breakeven_users: 10
  },

  GROWTH_PLAN: {
    price: "$149/month", 
    cost_to_serve: "$18/month",
    gross_margin: "88%",
    breakeven_users: 4
  },

  TARGET_MARGINS: {
    year_1: "70% gross margin",
    year_2: "80% gross margin", 
    year_3: "85% gross margin"
  },

  SCALING_THRESHOLDS: {
    "0-100 users": "Focus on product-market fit",
    "100-500 users": "Optimize AI costs aggressively",
    "500-1000 users": "Negotiate enterprise AI pricing",
    "1000+ users": "Consider AI model hosting/fine-tuning"
  }
}; 