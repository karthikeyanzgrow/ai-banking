import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Check for a Postgres URL in the environment
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Use PostgreSQL (no check_same_thread needed)
    print("Using PostgreSQL Database...")
    engine = create_engine(DATABASE_URL)
else:
    # Fallback to SQLite for local testing
    print("Using SQLite Database (Fallback)...")
    SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
