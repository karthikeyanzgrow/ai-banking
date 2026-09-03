from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String) # 'client' or 'staff'
    
    applications = relationship("Application", back_populates="owner")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="pending") # pending, approved, rejected
    type = Column(String) # account_onboarding, loan
    ai_summary = Column(String, nullable=True)
    ai_recommendation = Column(String, nullable=True) # approve, review, reject
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    owner = relationship("User", back_populates="applications")
    documents = relationship("Document", back_populates="application")


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    filename = Column(String)
    document_type = Column(String) # e.g., passport, trade_license
    extracted_data = Column(String, nullable=True) # JSON string of extracted entities
    is_valid = Column(Boolean, default=True)
    validation_notes = Column(String, nullable=True)
    
    application = relationship("Application", back_populates="documents")


