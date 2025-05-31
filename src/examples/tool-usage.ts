export const TOOL_EXAMPLES = {
  CAPTURE_CONVERSATION: {
    description: "Instantly save any conversation with context",
    example: `
      capture_conversation({
        "source": "whatsapp",
        "participant": {
          "name": "Priya Sharma", 
          "company": "FinanceFlow",
          "title": "Head of Product"
        },
        "content": "Hi! Thanks for the demo yesterday. Team loved the real-time analytics. Main concern is implementation timeline - we need to go live by March. Also worried about data migration from our current system. Can you share timeline and migration support details?",
        "metadata": {
          "urgency": "high",
          "sentiment": "positive"
        }
      })
      
      → AI Response: "Conversation captured! 🎯 Detected: Positive interest, timeline pressure (March deadline), migration concerns. Recommended: Send implementation timeline + migration case study."
    `
  },
  
  AI_RECALL: {
    description: "Instant memory recall for any context",
    examples: [
      {
        query: "Who needs the security documentation?",
        response: "Found 3 prospects: Microsoft (Sarah - SOC2), Oracle (Raj - pen testing), and TechCorp (Mike - ISO compliance)"
      },
      {
        query: "What did FinanceFlow say about timeline?",
        response: "Priya mentioned March deadline for go-live, concerned about data migration timeline"
      },
      {
        query: "Which prospects mentioned budget constraints?",
        response: "4 active concerns: StartupXYZ ($50K limit), TechFlow (board approval needed), InnovateCorp (Q1 budget freeze), DigitalPlus (ROI justification required)"
      }
    ]
  },
  
  DEAL_INTELLIGENCE: {
    description: "AI insights on deal progress and next moves",
    example: `
      get_deal_intelligence({
        "prospect": "FinanceFlow"
      })
      
      → Response: 
      "🎯 Deal Intelligence: FinanceFlow
      
      📊 Win Probability: 73%
      ⚡ Deal Velocity: Above average (moved to demo in 5 days)
      🎪 Current Stage: Technical evaluation
      ⏰ Days in Stage: 4 days
      
      🚨 Risk Factors:
      • March deadline creates timeline pressure
      • Migration complexity could slow implementation
      • No pricing discussion yet
      
      ✅ Recommended Actions:
      • Send implementation timeline with migration plan
      • Schedule technical deep-dive for data migration
      • Prepare pricing options for next call
      • Connect with their current vendor for transition planning
      
      💰 Similar Wins: 3 comparable fintech deals closed (avg: $180K)"
    `
  }
}; 