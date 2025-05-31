from typing import Dict, Any, List
from datetime import datetime, timedelta
from pymongo import MongoClient
import os

class ConversationAnalyzer:
    def __init__(self, context: Dict[str, str]):
        self.context = context
        self.mongodb = MongoClient(os.getenv('MONGODB_URL'))
        self.conversations = self.mongodb.sales_memory.conversations

    async def analyze_objections(self, objection_type: str, time_period: str) -> Dict[str, Any]:
        # Calculate date range
        end_date = datetime.utcnow()
        if time_period == "last_week":
            start_date = end_date - timedelta(days=7)
        elif time_period == "last_month":
            start_date = end_date - timedelta(days=30)
        else:
            start_date = end_date - timedelta(days=90)

        # Get conversations with objections
        conversations = await self.conversations.find({
            "tenant_id": self.context["tenantId"],
            "created_at": {"$gte": start_date, "$lte": end_date},
            "objections": {"$exists": True, "$ne": []}
        }).to_list(length=None)

        # Flatten all objections
        all_objections = [obj for conv in conversations for obj in conv.get("objections", [])]
        
        # Count frequency
        objection_counts = {}
        for obj in all_objections:
            objection_counts[obj] = objection_counts.get(obj, 0) + 1
        
        # Calculate success rates
        successful_deals = len([c for c in conversations if c.get("deal_stage") == "closed_won"])
        success_rate = (successful_deals / len(conversations) * 100) if conversations else 0

        return {
            "most_common": sorted(
                objection_counts.items(),
                key=lambda x: x[1],
                reverse=True
            )[:5],
            "success_rate": round(success_rate, 1),
            "recommended_responses": self.generate_recommended_responses(objection_type)
        }

    def generate_recommended_responses(self, objection_type: str) -> List[str]:
        # This would typically come from your AI service
        return [
            "I understand your concern about pricing. Let me show you our ROI calculator...",
            "Many of our customers had similar concerns. Here's how they solved it...",
            "Let's break down the costs and benefits over a 12-month period..."
        ] 