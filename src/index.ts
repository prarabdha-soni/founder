#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { SalesMemoryManager } from "./services/SalesMemoryManager.js";
import { ConversationAnalyzer } from "./services/ConversationAnalyzer.js";
import { OptimizedAIService } from "./services/optimized-ai.js";

// Multi-tenant context (in real app, get from JWT)
const getTenantContext = () => ({
  tenantId: process.env.TENANT_ID || 'default',
  userId: process.env.USER_ID || 'founder'
});

const server = new Server(
  {
    name: "sales-memory-ai",
    version: "2.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "capture_conversation",
        description: "Save and analyze a sales conversation with AI insights",
        inputSchema: {
          type: "object",
          properties: {
            source: { type: "string", description: "Source platform (whatsapp, email, call, etc.)" },
            participant: {
              type: "object",
              properties: {
                name: { type: "string" },
                company: { type: "string" },
                title: { type: "string" }
              },
              required: ["name"]
            },
            content: { type: "string", description: "Full conversation content" },
            metadata: {
              type: "object",
              properties: {
                urgency: { type: "string" },
                sentiment: { type: "string" },
                deal_stage: { type: "string" }
              }
            }
          },
          required: ["source", "participant", "content"]
        }
      },
      {
        name: "ai_recall", 
        description: "Smart memory recall - ask anything about past conversations",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "What do you want to remember? (e.g., 'What did Microsoft say about pricing?')" },
            limit: { type: "number", description: "Max results to return", default: 5 }
          },
          required: ["query"]
        }
      },
      {
        name: "get_prospect_context",
        description: "Get full context and current status for a specific prospect",
        inputSchema: {
          type: "object", 
          properties: {
            prospect_name: { type: "string", description: "Name of the prospect/company" }
          },
          required: ["prospect_name"]
        }
      },
      {
        name: "analyze_objections",
        description: "Get AI analysis of common objections and proven responses",
        inputSchema: {
          type: "object",
          properties: {
            objection_type: { type: "string", description: "Type of objection (pricing, features, timing, etc.)" },
            time_period: { type: "string", description: "Time period to analyze (30d, 90d, etc.)" }
          }
        }
      }
    ]
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const context = getTenantContext();
  
  const salesMemory = new SalesMemoryManager(context);
  const analyzer = new ConversationAnalyzer(context);
  const ai = new OptimizedAIService();

  switch (name) {
    case "capture_conversation":
      const result = await salesMemory.captureConversation({
        participantName: args.participant.name,
        participantCompany: args.participant.company || "Unknown",
        content: args.content,
        type: args.source,
        dealStage: args.metadata?.deal_stage || "initial",
        keyPoints: [], // AI will extract these
        objections: [], // AI will extract these  
        nextSteps: [] // AI will extract these
      });
      
      return {
        content: [{
          type: "text",
          text: `🎯 **Conversation Captured Successfully!**\n\n` +
                `📝 **AI Insights:** ${result.insights}\n\n` +
                `✅ **Recommended Actions:**\n` +
                result.suggestions.map(s => `• ${s}`).join('\n') +
                `\n\n💾 **Stored with ID:** ${result.id}`
        }]
      };

    case "ai_recall":
      const memories = await salesMemory.smartRecall(args.query, args.limit || 5);
      
      if (!memories.length) {
        return {
          content: [{
            type: "text", 
            text: `🤔 **No matching memories found for:** "${args.query}"\n\nTry a different search term or capture more conversations first.`
          }]
        };
      }
      
      return {
        content: [{
          type: "text",
          text: `🔍 **Found ${memories.length} relevant memories:**\n\n` +
                memories.slice(0, 3).map(m => 
                  `**${m.participant}** (${m.company}) - ${m.source}\n` +
                  `💡 "${m.snippet}"\n` +
                  `📅 ${m.timeAgo} • 🎯 ${Math.round(m.relevance * 100)}% match\n`
                ).join('\n') +
                (memories.length > 3 ? `\n...and ${memories.length - 3} more results` : '')
        }]
      };

    case "get_prospect_context":
      const prospectData = await salesMemory.getProspectContext(args.prospect_name);
      
      if (!prospectData) {
        return {
          content: [{
            type: "text",
            text: `❌ **No conversation history found for:** ${args.prospect_name}\n\nStart by capturing some conversations first.`
          }]
        };
      }
      
      return {
        content: [{
          type: "text",
          text: `👤 **Prospect Context: ${args.prospect_name}**\n\n` +
                `🎪 **Current Stage:** ${prospectData.currentStage}\n` +
                `📞 **Last Contact:** ${prospectData.lastContact.toDateString()}\n` +
                `💬 **Total Interactions:** ${prospectData.totalInteractions}\n\n` +
                `🚨 **Open Objections:** ${prospectData.openObjections.join(', ') || 'None'}\n\n` +
                `✅ **Next Steps:** ${prospectData.nextSteps.join(', ') || 'None'}\n\n` +
                `📝 **Recent Context:**\n${prospectData.recentContext}`
        }]
      };

    case "analyze_objections":
      const objectionAnalysis = await analyzer.analyzeObjections(args.objection_type, args.time_period);
      
      return {
        content: [{
          type: "text",
          text: `📊 **Objection Analysis**\n\n` +
                `🎯 **Most Common Objections:**\n` +
                objectionAnalysis.mostCommon.map((obj, i) => `${i+1}. ${obj}`).join('\n') +
                `\n\n📈 **Success Rate:** ${objectionAnalysis.successRate}%\n\n` +
                `💬 **Recommended Responses:**\n` +
                objectionAnalysis.recommendedResponses.map((resp, i) => `${i+1}. ${resp}`).join('\n')
        }]
      };

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error); 