#!/usr/bin/env python3

import os
import asyncio
from typing import Dict, Any, List
from modelcontextprotocol import Server, StdioServerTransport
from modelcontextprotocol.types import CallToolRequest, ListToolsRequest
from services.sales_memory_manager import SalesMemoryManager
from services.conversation_analyzer import ConversationAnalyzer
from services.optimized_ai import OptimizedAIService

# Multi-tenant context (in real app, get from JWT)
def get_tenant_context() -> Dict[str, str]:
    return {
        'tenantId': os.getenv('TENANT_ID', 'default'),
        'userId': os.getenv('USER_ID', 'founder')
    }

async def main():
    server = Server(
        name="sales-memory-ai",
        version="2.0.0",
        capabilities={"tools": {}}
    )

    # List available tools
    @server.handler(ListToolsRequest)
    async def list_tools(request: ListToolsRequest) -> Dict[str, Any]:
        return {
            "tools": [
                {
                    "name": "capture_conversation",
                    "description": "Save and analyze a sales conversation with AI insights",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "source": {"type": "string", "description": "Source platform (whatsapp, email, call, etc.)"},
                            "participant": {
                                "type": "object",
                                "properties": {
                                    "name": {"type": "string"},
                                    "company": {"type": "string"},
                                    "title": {"type": "string"}
                                },
                                "required": ["name"]
                            },
                            "content": {"type": "string", "description": "Full conversation content"},
                            "metadata": {
                                "type": "object",
                                "properties": {
                                    "urgency": {"type": "string"},
                                    "sentiment": {"type": "string"},
                                    "deal_stage": {"type": "string"}
                                }
                            }
                        },
                        "required": ["source", "participant", "content"]
                    }
                },
                {
                    "name": "ai_recall",
                    "description": "Smart memory recall - ask anything about past conversations",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "query": {"type": "string", "description": "What do you want to remember?"},
                            "limit": {"type": "number", "description": "Max results to return", "default": 5}
                        },
                        "required": ["query"]
                    }
                }
            ]
        }

    # Handle tool execution
    @server.handler(CallToolRequest)
    async def handle_tool(request: CallToolRequest) -> Dict[str, Any]:
        name = request.params.get("name")
        args = request.params.get("arguments", {})
        context = get_tenant_context()
        
        sales_memory = SalesMemoryManager(context)
        analyzer = ConversationAnalyzer(context)
        ai = OptimizedAIService()

        if name == "capture_conversation":
            result = await sales_memory.capture_conversation(args)
            return {
                "content": [{
                    "type": "text",
                    "text": f"🎯 **Conversation Captured Successfully!**\n\n"
                           f"📝 **AI Insights:** {result['insights']}\n\n"
                           f"✅ **Recommended Actions:**\n"
                           f"{chr(10).join('• ' + s for s in result['suggestions'])}\n\n"
                           f"💾 **Stored with ID:** {result['id']}"
                }]
            }

        elif name == "ai_recall":
            memories = await sales_memory.smart_recall(args["query"], args.get("limit", 5))
            
            if not memories:
                return {
                    "content": [{
                        "type": "text",
                        "text": f"🤔 **No matching memories found for:** \"{args['query']}\"\n\n"
                               f"Try a different search term or capture more conversations first."
                    }]
                }
            
            return {
                "content": [{
                    "type": "text",
                    "text": f"🔍 **Found {len(memories)} relevant memories:**\n\n" +
                           "\n".join(
                               f"**{m['participant']}** ({m['company']}) - {m['source']}\n"
                               f"💡 \"{m['snippet']}\"\n"
                               f"📅 {m['time_ago']} • 🎯 {int(m['relevance'] * 100)}% match"
                               for m in memories[:3]
                           ) +
                           (f"\n\n...and {len(memories) - 3} more results" if len(memories) > 3 else "")
                }]
            }

        else:
            raise ValueError(f"Unknown tool: {name}")

    transport = StdioServerTransport()
    await server.connect(transport)

if __name__ == "__main__":
    asyncio.run(main()) 