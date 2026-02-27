from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Product
from passlib.context import CryptContext

print("🚀 Initializing database...")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create tables
Base.metadata.create_all(bind=engine)

db: Session = SessionLocal()

# =====================
# Seed Products
# =====================

products = [
    {"name": "Laptop Dell", "quantity": 10},
    {"name": "Wireless Mouse", "quantity": 50},
    {"name": "Mechanical Keyboard", "quantity": 25},
    {"name": "27inch Monitor", "quantity": 15},
    {"name": "USB-C Hub", "quantity": 30},
]

print("📦 Syncing products...")

added = 0

for p in products:
    exists = db.query(Product).filter(
        Product.name == p["name"]
    ).first()

    if not exists:
        db.add(Product(**p))
        added += 1

db.commit()

print(f"✅ {added} products added or synced!")

db.close()

print("✅ Database ready")