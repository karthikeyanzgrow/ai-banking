from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, get_db
import models
from pydantic import BaseModel

# Create all tables if they don't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Banking API")

# Configure CORS for Next.js frontend (allow Vercel and local development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReviewRequest(BaseModel):
    action: str # approve or reject
    reason: str = ""

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Banking API"}

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Z-Grow AI Banking API"}

@app.get("/api/applications")
def get_applications(db: Session = Depends(get_db)):
    apps = db.query(models.Application).order_by(models.Application.created_at.desc()).all()
    return apps

@app.get("/api/applications/{app_id}")
def get_application(app_id: int, db: Session = Depends(get_db)):
    app_db = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app_db:
        raise HTTPException(status_code=404, detail="Application not found")
    
    docs = db.query(models.Document).filter(models.Document.application_id == app_id).all()
    
    return {
        "application": app_db,
        "documents": docs
    }

@app.post("/api/applications/{app_id}/review")
def review_application(app_id: int, req: ReviewRequest, db: Session = Depends(get_db)):
    app_db = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app_db:
        raise HTTPException(status_code=404, detail="Application not found")
    
    app_db.status = "approved" if req.action == "approve" else "rejected"
    # In a real app we'd save the reason somewhere too
    db.commit()
    return {"message": f"Application {req.action}d"}

from fastapi import File, UploadFile, Form
import shutil
import os
from ai_service import analyze_documents
import json

os.makedirs("uploads", exist_ok=True)

@app.post("/api/applications/upload")
async def upload_documents(
    files: list[UploadFile] = File(...),
    application_type: str = Form("account_onboarding"),
    db: Session = Depends(get_db)
):
    file_paths = []
    
    # 1. Save uploaded files to disk
    for file in files:
        file_path = f"uploads/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        file_paths.append(file_path)
        
    # 2. Call real Gemini AI Service
    ai_result = analyze_documents(file_paths)
    
    # 3. Create dummy user if none exists (since we don't have full auth)
    dummy_user = db.query(models.User).filter(models.User.role == "client").first()
    if not dummy_user:
        dummy_user = models.User(email="realclient@test.com", hashed_password="pwd", role="client")
        db.add(dummy_user)
        db.commit()
        db.refresh(dummy_user)
        
    # 4. Save to Database
    new_app = models.Application(
        user_id=dummy_user.id,
        status="pending",
        type=application_type,
        ai_summary=ai_result.get("summary", "No summary provided by AI."),
        ai_recommendation=ai_result.get("recommendation", "review")
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    
    for doc in ai_result.get("documents", []):
        new_doc = models.Document(
            application_id=new_app.id,
            filename=doc.get("filename"),
            document_type=doc.get("type", "unknown"),
            is_valid=doc.get("is_valid", True),
            extracted_data=json.dumps(doc.get("extracted_data", {})),
            validation_notes=doc.get("notes", "")
        )
        db.add(new_doc)
    db.commit()
    
    return {"message": "Application submitted successfully", "application_id": new_app.id}


from ai_service import upload_kb_document, chat_with_kb
class ChatRequest(BaseModel):
    message: str

@app.post("/api/kb/upload")
async def upload_kb_doc(uploaded_file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_path = f"uploads/{uploaded_file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(uploaded_file.file, buffer)
    
    result = upload_kb_document(file_path)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to upload KB document to AI")
    
    new_doc = models.KnowledgeDocument(
        filename=uploaded_file.filename,
        gemini_file_uri=result["gemini_file_uri"],
        gemini_file_name=result["gemini_file_name"]
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return {"message": "Document uploaded and indexed", "document": new_doc}

@app.get("/api/kb/documents")
def get_kb_documents(db: Session = Depends(get_db)):
    docs = db.query(models.KnowledgeDocument).order_by(models.KnowledgeDocument.uploaded_at.desc()).all()
    return docs

@app.post("/api/kb/chat")
def chat_kb(req: ChatRequest, db: Session = Depends(get_db)):
    docs = db.query(models.KnowledgeDocument).all()
    if not docs:
        return {"answer": "No knowledge base documents uploaded. Please upload manuals first."}
    
    uris = [d.gemini_file_uri for d in docs if d.gemini_file_uri != "dummy_uri"]
    answer = chat_with_kb(req.message, uris)
    return {"answer": answer}
