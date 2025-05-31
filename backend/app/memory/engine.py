from app.db.session import SessionLocal
from app.db.models import Conversation
from app.schemas import ConversationIn, ConversationOut
from app.llm.openai import analyze_conversation

class MemoryEngine:
    @staticmethod
    def capture_conversation(convo: ConversationIn) -> ConversationOut:
        db = SessionLocal()
        db_convo = Conversation(
            user_id=convo.user_id,
            content=convo.content,
            metadata=str(convo.metadata)
        )
        db.add(db_convo)
        db.commit()
        db.refresh(db_convo)

        # LLM analysis
        insights = analyze_conversation(convo.content)
        suggestions = ["Send follow-up email", "Schedule demo"]  # Placeholder

        return ConversationOut(
            id=db_convo.id,
            insights=insights,
            suggestions=suggestions
        )

    @staticmethod
    async def capture_conversation(convo):
        # 1. Store in Postgres
        # 2. Generate embedding
        # 3. Store in ChromaDB
        # 4. Run LLM for insights
        # 5. Return result
        pass 