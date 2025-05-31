export const FOUNDER_PAIN_POINTS = {
  CONTEXT_SWITCHING: {
    problem: "Lost 20 minutes re-reading WhatsApp thread with prospect before call",
    solution: "ai_recall('what did Sarah say about budget concerns last week')",
    result: "Instant context: 'Sarah mentioned $50K budget, worried about implementation time'"
  },
  
  FORGOTTEN_PROMISES: {
    problem: "Promised to send case study to 3 different prospects, forgot who",
    solution: "ai_recall('who am I supposed to send case studies to')",
    result: "Found 3 pending promises, auto-generated personalized follow-ups"
  },
  
  SCATTERED_CONVERSATIONS: {
    problem: "Same prospect contacted via email, WhatsApp, and LinkedIn - context scattered",
    solution: "Unified conversation memory across all channels",
    result: "Complete conversation history regardless of channel"
  },
  
  OBJECTION_AMNESIA: {
    problem: "Can't remember successful responses to common objections",
    solution: "objection_playbook('too expensive')",
    result: "AI suggests proven responses based on past wins"
  }
};

// Real founder scenarios
export const USE_CASE_EXAMPLES = {
  STARTUP_FOUNDER: `
    Scenario: Building a fintech startup, talking to 15 potential enterprise clients
    
    Before: "Wait, did HDFC already see our pricing? What stage is Yes Bank at? 
    Did I follow up with Kotak about the API integration question?"
    
    After: Quick AI recall finds exact conversation status for each prospect
  `,
  
  SALES_MANAGER: `
    Scenario: Managing 50+ B2B leads across different verticals
    
    Before: Spending first 10 minutes of every call re-reading email threads
    
    After: "Hey AI, brief me on TechMahindra before my 3pm call" 
    → Instant context with key points, objections, next steps
  `,
  
  BIZ_DEV: `
    Scenario: Partnership discussions with 20+ companies
    
    Before: "Which partner wanted white-label options? Who asked about revenue share?"
    
    After: AI instantly surfaces relevant conversation snippets and action items
  `
}; 