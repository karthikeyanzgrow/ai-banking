import random
from datetime import datetime, timedelta
from database import SessionLocal, engine
import models
import json

# Ensure tables are created
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

def seed_database():
    # Check if we already have data
    if db.query(models.User).first():
        print("Database already seeded!")
        return
    
    print("Seeding mock applications...")
    
    # Create a dummy user
    dummy_user = models.User(email="client@test.com", hashed_password="pwd", role="client")
    db.add(dummy_user)
    db.commit()
    db.refresh(dummy_user)
    
    # App 1: Good Application
    app1 = models.Application(
        user_id=dummy_user.id,
        status="pending",
        type="account_onboarding",
        ai_summary="All documents valid. Passport matches Emirates ID. Salary certificate confirms income of 45,000 AED/month. No discrepancies found.",
        ai_recommendation="approve"
    )
    db.add(app1)
    db.commit()
    
    # Docs for App 1
    db.add(models.Document(application_id=app1.id, filename="passport.pdf", document_type="passport", extracted_data='{"name": "John Doe", "expiry": "2030-01-01"}', is_valid=True))
    db.add(models.Document(application_id=app1.id, filename="emirates_id.pdf", document_type="emirates_id", extracted_data='{"name": "John Doe", "expiry": "2028-05-15"}', is_valid=True))
    db.add(models.Document(application_id=app1.id, filename="salary_cert.pdf", document_type="salary", extracted_data='{"income": "45000", "company": "Tech Corp"}', is_valid=True))
    db.commit()

    # App 2: Problematic Application
    app2 = models.Application(
        user_id=dummy_user.id,
        status="pending",
        type="loan",
        ai_summary="WARNING: Emirates ID is expired. Name mismatch detected between Passport ('Jane Doe') and Trade License ('Jane D. LLC').",
        ai_recommendation="review"
    )
    db.add(app2)
    db.commit()
    
    # Docs for App 2
    db.add(models.Document(application_id=app2.id, filename="passport.pdf", document_type="passport", extracted_data='{"name": "Jane Doe", "expiry": "2029-01-01"}', is_valid=True))
    db.add(models.Document(application_id=app2.id, filename="emirates_id.pdf", document_type="emirates_id", extracted_data='{"name": "Jane Doe", "expiry": "2023-01-01"}', is_valid=False, validation_notes="EXPIRED ID"))
    db.add(models.Document(application_id=app2.id, filename="trade_license.pdf", document_type="trade_license", extracted_data='{"name": "Jane D. LLC"}', is_valid=False, validation_notes="Name mismatch with passport"))
    db.commit()
    
    print("Application Seeding complete.")

if __name__ == "__main__":
    seed_database()
