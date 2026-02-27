from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Product, Activity
from pydantic import BaseModel
from datetime import datetime
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, Integer, String

# =========================
# FastAPI App
# =========================
app = FastAPI(
    title="Inventory Service V2",
    root_path="/api"
)

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Password Hash
# =========================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# =========================
# User Model (Admin Login)
# =========================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password = Column(String)


# =========================
# Create tables + Admin
# =========================
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    admin = db.query(User).filter(User.username == "admin").first()

    if not admin:
        new_admin = User(
            username="admin",
            password=pwd_context.hash("admin123")
        )
        db.add(new_admin)
        db.commit()

    db.close()


# =========================
# DB Dependency
# =========================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# Schemas
# =========================
class ProductCreate(BaseModel):
    name: str
    quantity: int


class ProductResponse(BaseModel):
    id: int
    name: str
    quantity: int

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    username: str
    password: str


# =========================
# Health
# =========================
@app.get("/health")
def health():
    return {"status": "ok"}


# =========================
# LOGIN
# =========================
@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.username == data.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not pwd_context.verify(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "Login successful"}


# =========================
# CREATE Product
# =========================
@app.post("/products", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):

    new_product = Product(
        name=product.name,
        quantity=product.quantity
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    activity = Activity(
        action="Added",
        details=f"Added product '{new_product.name}'",
        timestamp=datetime.utcnow()
    )

    db.add(activity)
    db.commit()

    return new_product


# =========================
# READ Products
# =========================
@app.get("/products", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()


# =========================
# UPDATE Product
# =========================
@app.put("/products/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product: ProductCreate, db: Session = Depends(get_db)):

    db_product = db.query(Product).filter(Product.id == product_id).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    db_product.name = product.name
    db_product.quantity = product.quantity

    db.commit()
    db.refresh(db_product)

    activity = Activity(
        action="Updated",
        details=f"Updated product '{db_product.name}'",
        timestamp=datetime.utcnow()
    )

    db.add(activity)
    db.commit()

    return db_product


# =========================
# DELETE Product
# =========================
@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):

    db_product = db.query(Product).filter(Product.id == product_id).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    activity = Activity(
        action="Deleted",
        details=f"Deleted product '{db_product.name}'",
        timestamp=datetime.utcnow()
    )

    db.add(activity)
    db.commit()

    db.delete(db_product)
    db.commit()

    return {"message": "Product deleted successfully"}


# =========================
# Activities
# =========================
@app.get("/activities")
def get_activities(db: Session = Depends(get_db)):
    return db.query(Activity).order_by(Activity.timestamp.desc()).all()