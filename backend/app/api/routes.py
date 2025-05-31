from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.memory.engine import MemoryEngine
from app.schemas import ConversationIn, ConversationOut, TaskIn, TaskOut, DocumentOut
from app.db.session import SessionLocal
from app.db.models import Task, Document # Import models
import os
from fastapi.responses import FileResponse

router = APIRouter()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/conversations/", response_model=ConversationOut)
def capture_conversation(convo: ConversationIn):
    return MemoryEngine.capture_conversation(convo)

# Task Endpoints
@router.post("/tasks/", response_model=TaskOut)
def create_task(task: TaskIn, db: Session = Depends(get_db)):
    db_task = Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/tasks/", response_model=list[TaskOut])
def get_tasks(user_id: str, db: Session = Depends(get_db)):
    tasks = db.query(Task).filter(Task.user_id == user_id).all()
    return tasks

@router.get("/tasks/{task_id}", response_model=TaskOut)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/tasks/{task_id}", response_model=TaskOut)
def update_task(task_id: int, task_update: TaskIn, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in task_update.model_dump(exclude_unset=True).items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"ok": True}

# Document Endpoints
@router.post("/documents/upload/", response_model=DocumentOut)
def upload_document(user_id: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Placeholder for saving file
    file_location = f"./uploaded_documents/{file.filename}" # Define storage location
    os.makedirs(os.path.dirname(file_location), exist_ok=True)
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())

    db_document = Document(user_id=user_id, filename=file.filename, filepath=file_location)
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

@router.get("/documents/", response_model=list[DocumentOut])
def get_documents(user_id: str, db: Session = Depends(get_db)):
    documents = db.query(Document).filter(Document.user_id == user_id).all()
    return documents

@router.get("/documents/{document_id}")
def get_document(document_id: int, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    # For now, returning metadata. Can be modified to return the file.
    return document

@router.delete("/documents/{document_id}")
def delete_document(document_id: int, db: Session = Depends(get_db)):
    db_document = db.query(Document).filter(Document.id == document_id).first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Placeholder for deleting file from storage
    if os.path.exists(db_document.filepath):
        os.remove(db_document.filepath)

    db.delete(db_document)
    db.commit()
    return {"ok": True} 