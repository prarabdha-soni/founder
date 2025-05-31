from typing import Optional, List, Dict, Any
from datetime import datetime
from pymongo import MongoClient
from openai import OpenAI
import os

class SalesMemoryManager:
    def __init__(self, context: Dict[str, str]):
        self.context = context
        self.mongodb = MongoClient(os.getenv('MONGODB_URL'))
        self.conversations = self.mongodb.sales_memory.conversations
        self.openai = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    async def capture_conversation(self, record: Dict[str, Any]) -> Dict[str, Any]:
        # Generate embedding for vector search
        embedding = await self.generate_embedding(record['content'])
        
        conversation_doc = {
            **record,
            'embedding': embedding,
            'created_at': datetime.utcnow(),
            'tenant_id': self.context['tenantId'],
            'user_id': self.context['userId']
        }

        result = await self.conversations.insert_one(conversation_doc)
        
        # AI-powered analysis
        insights = await self.analyze_conversation(record['content'])
        
        return {
            'id': result.inserted_id,
            'insights': insights,
            'suggestions': self.generate_action_suggestions(record)
        }

    async def smart_recall(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        # Generate embedding for the query
        query_embedding = await self.generate_embedding(query)
        
        # MongoDB Atlas Vector Search
        pipeline = [
            {
                '$vectorSearch': {
                    'index': 'vector_index',
                    'path': 'embedding',
                    'queryVector': query_embedding,
                    'numCandidates': 50,
                    'limit': limit
                }
            },
            {
                '$match': {
                    'tenant_id': self.context['tenantId']
                }
            },
            {
                '$project': {
                    'participant_name': 1,
                    'participant_company': 1,
                    'content': 1,
                    'type': 1,
                    'deal_stage': 1,
                    'created_at': 1,
                    'score': {'$meta': 'vectorSearchScore'}
                }
            }
        ]

        results = await self.conversations.aggregate(pipeline).to_list(length=limit)

        return [{
            'participant': r['participant_name'],
            'company': r['participant_company'],
            'source': r['type'],
            'snippet': r['content'][:200] + '...',
            'time_ago': self.format_time_ago(r['created_at']),
            'relevance': r.get('score', 0)
        } for r in results]

    async def get_prospect_context(self, prospect_name: str) -> Optional[Dict[str, Any]]:
        conversations = await self.conversations.find({
            'participant_name': prospect_name,
            'tenant_id': self.context['tenantId']
        }).sort('created_at', -1).limit(10).to_list(length=10)

        if not conversations:
            return None

        latest = conversations[0]
        all_objections = [obj for conv in conversations for obj in conv.get('objections', [])]
        all_next_steps = [step for conv in conversations for step in conv.get('next_steps', [])]

        return {
            'current_stage': latest['deal_stage'],
            'last_contact': latest['created_at'],
            'total_interactions': len(conversations),
            'open_objections': list(set(all_objections)),
            'next_steps': list(set(all_next_steps)),
            'recent_context': '\n'.join(
                f"{c['type']} on {c['created_at'].strftime('%Y-%m-%d')}: {', '.join(c.get('key_points', ['No key points']))}"
                for c in conversations[:3]
            )
        }

    async def generate_embedding(self, text: str) -> List[float]:
        response = await self.openai.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        return response.data[0].embedding

    async def analyze_conversation(self, content: str) -> str:
        response = await self.openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{
                'role': 'system',
                'content': 'Analyze this sales conversation and extract key insights, objections, and sentiment.'
            }, {
                'role': 'user',
                'content': content
            }],
            max_tokens=300
        )
        return response.choices[0].message.content

    def generate_action_suggestions(self, record: Dict[str, Any]) -> List[str]:
        suggestions = []
        
        if record.get('objections'):
            suggestions.append(f"Address {record['objections'][0]} objection with case study")
        
        if record.get('deal_stage') == 'demo_requested':
            suggestions.append("Schedule technical demo within 48 hours")
        
        if record.get('next_steps'):
            suggestions.append(f"Follow up on: {record['next_steps'][0]}")
        
        suggestions.append("Send personalized follow-up email within 24 hours")
        
        return suggestions

    def format_time_ago(self, date: datetime) -> str:
        diff = datetime.utcnow() - date
        days = diff.days
        return 'Today' if days == 0 else f'{days} days ago' 