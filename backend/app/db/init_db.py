from app.core.database import Base, engine, SessionLocal
from app.db.seed_data import seed_database
import app.models # Register models

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized & seeded successfully!")
