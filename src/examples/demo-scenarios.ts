export const DEMO_SCENARIOS = {
  CONTEXT_SWITCHING_DEMO: {
    setup: "Founder with 10 active prospects across WhatsApp, email, LinkedIn",
    
    before_demo: `
      "Let me just... *scrolls through WhatsApp* 
      Wait, what was Microsoft's main concern again? 
      *switches to email* 
      Oh right, they asked about security compliance... 
      *checks LinkedIn messages*
      And IBM wanted the ROI calculator... or was that Oracle?"
    `,
    
    after_demo: `
      User: "Brief me on Microsoft before my call in 5 minutes"
      
      AI: "💼 Microsoft (Sarah Chen, CTO)
      
      🔍 Last Interaction: 3 days ago via email
      
      🎯 Main Concerns:
      • SOC2 compliance timeline (needs by Q1)
      • Data residency in specific regions
      • Integration with Azure AD
      
      💰 Budget: $200K approved, waiting on security review
      
      ✅ Next Steps: Send security documentation, schedule tech review
      
      🚨 Urgency: High - they have board meeting next week"
    `
  },
  
  OBJECTION_PLAYBOOK_DEMO: {
    scenario: "Prospect says 'Your solution seems too expensive'",
    
    traditional_response: "Founder scrambles to remember previous pricing discussions",
    
    ai_response: `
      AI Objection Playbook: "Too expensive"
      
      📊 Success Rate: 78% (based on 23 similar objections)
      
      🎯 Best Responses:
      1. "I understand cost is a concern. Let me break down the ROI..."
         → 85% success rate (closed 6/7 deals)
      
      2. "What budget range were you thinking?" (discovery)
         → 71% success rate (4/7 advanced to proposal)
      
      3. Share FinTech Innovations case study (saved $2M/year)
         → 67% success rate
      
      🔄 Follow-up: "Happy to create a custom ROI analysis for your specific use case"
    `
  }
}; 