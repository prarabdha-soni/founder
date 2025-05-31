export const PRICING_TIERS = {
  FOUNDER: {
    name: "Founder",
    price: 49,
    conversations: 500,
    aiInsights: true,
    integrations: ['whatsapp', 'email'],
    teamMembers: 1,
    features: ['Smart Recall', 'Deal Intelligence', 'Follow-up AI']
  },
  GROWTH: {
    name: "Growth",
    price: 149,
    conversations: 2000,
    aiInsights: true,
    integrations: ['whatsapp', 'email', 'hubspot', 'salesforce'],
    teamMembers: 5,
    features: ['All Founder features', 'Team Collaboration', 'Advanced Analytics', 'Custom Playbooks']
  },
  SCALE: {
    name: "Scale",
    price: 399,
    conversations: 10000,
    aiInsights: true,
    integrations: 'all',
    teamMembers: 'unlimited',
    features: ['All Growth features', 'API Access', 'Custom AI Training', 'White-label Options']
  }
};

// Revenue projections:
// Month 1-3: $0 (building MVP)
// Month 4-6: $5K MRR (10 founder plans)
// Month 7-12: $25K MRR (50 founder + 10 growth)
// Year 2: $100K MRR (200 total customers)
// Year 3: $500K MRR (enterprise expansion) 