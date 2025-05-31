from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ConversationIn(BaseModel):
    user_id: str
    content: str
    conversation_metadata: Dict[str, Any]

class ConversationOut(BaseModel):
    id: int
    insights: str
    suggestions: List[str]

class TaskIn(BaseModel):
    user_id: str
    description: str
    due_date: Optional[datetime] = None

class TaskOut(TaskIn):
    id: int
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class DocumentOut(BaseModel):
    id: int
    user_id: str
    filename: str
    filepath: str
    upload_date: datetime

    class Config:
        orm_mode = True 