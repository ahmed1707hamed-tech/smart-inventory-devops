from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
from datetime import datetime
from typing import Optional

app = FastAPI(title="Inventory Service")

# =====================
# Configuration
# =====================
# Read from env vars, default to 'Local'
ENV_NAME = os.getenv("ENV", "Local")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files (CSS, JS, images)
# Ensure the directory "static" exists if you plan to use it, or remove if unused.
# app.mount("/static", StaticFiles(directory="static"), name="static")

DATA_FILE = "products.json"
ACTIVITY_FILE = "activities.json"

# =====================
# Models
# =====================
class Product(BaseModel):
    name: str
    quantity: int

class LoginRequest(BaseModel):
    username: str
    password: str

class Activity(BaseModel):
    action: str
    details: str
    timestamp: str

# =====================
# Helper functions
# =====================
def load_json(filename):
    if not os.path.exists(filename):
        return []
    try:
        with open(filename, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []

def save_json(filename, data):
    with open(filename, "w") as f:
        json.dump(data, f, indent=2)

def log_activity(action: str, details: str):
    activities = load_json(ACTIVITY_FILE)
    new_activity = {
        "action": action,
        "details": details,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    # Keep only last 50 activities
    activities.insert(0, new_activity)
    if len(activities) > 50:
        activities = activities[:50]
    save_json(ACTIVITY_FILE, activities)

# =====================
# Routes
# =====================

@app.get("/health")
def health_check():
    """
    Health check endpoint for DevOps monitoring.
    """
    return {
        "status": "healthy",
        "env": ENV_NAME,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/login")
def login(login_request: LoginRequest):
    # Dummy Auth with Roles
    if login_request.username == "admin" and login_request.password == "admin":
        return {
            "token": "admin-token",
            "username": "admin",
            "role": "admin"
        }
    elif login_request.username == "viewer" and login_request.password == "viewer":
        return {
            "token": "viewer-token",
            "username": "viewer",
            "role": "viewer"
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/products")
def get_products():
    return load_json(DATA_FILE)

@app.get("/activities")
def get_activities():
    return load_json(ACTIVITY_FILE)

@app.post("/products")
def add_product(product: Product):
    # Validation
    if not product.name or product.name.strip() == "":
        raise HTTPException(status_code=400, detail="Product name cannot be empty")
    if product.quantity < 0:
        raise HTTPException(status_code=400, detail="Quantity cannot be negative")

    products = load_json(DATA_FILE)

    # Prevent duplicate
    for p in products:
        if p["name"] == product.name:
            raise HTTPException(status_code=400, detail="Product already exists")

    products.append(product.dict())
    save_json(DATA_FILE, products)
    
    log_activity("Added", f"Added product '{product.name}' with qty {product.quantity}")

    return {"message": "Product added", "product": product}

@app.put("/products/{name}")
def update_product(name: str, updated_product: Product):
    if updated_product.quantity < 0:
        raise HTTPException(status_code=400, detail="Quantity cannot be negative")

    products = load_json(DATA_FILE)

    for product in products:
        if product["name"] == name:
            old_qty = product["quantity"]
            product["quantity"] = updated_product.quantity
            save_json(DATA_FILE, products)
            
            log_activity("Updated", f"Updated '{name}' (Qty: {old_qty} -> {updated_product.quantity})")
            
            return {"message": "Product updated", "product": product}

    raise HTTPException(status_code=404, detail="Product not found")

@app.delete("/products/{name}")
def delete_product(name: str):
    products = load_json(DATA_FILE)

    for i, product in enumerate(products):
        if product["name"] == name:
            deleted = products.pop(i)
            save_json(DATA_FILE, products)
            
            log_activity("Deleted", f"Deleted product '{name}'")
            
            return {"message": "Product deleted", "product": deleted}

    raise HTTPException(status_code=404, detail="Product not found")
