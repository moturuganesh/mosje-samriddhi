from sqlalchemy import create_engine, Column, Integer, String, JSON, ForeignKey, Float
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

from pathlib import Path
DATABASE_URL = f"sqlite:///{Path(__file__).parent.parent.resolve() / 'mosje_samriddhi.db'}"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String, unique=True, index=True)
    security_pin = Column(String)
    name = Column(String)
    applications = relationship("Application", back_populates="user")

class Application(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    arn = Column(String, unique=True, index=True)
    scheme_data = Column(JSON)
    branch_data = Column(JSON)
    sri_score = Column(Float)
    status = Column(String, default="Routed to Branch")
    
    user = relationship("User", back_populates="applications")

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
