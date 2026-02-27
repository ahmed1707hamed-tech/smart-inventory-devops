import requests
import random
import time

API_URL = "http://inventory-backend:8000/products"

# ===============================
# Wait for API
# ===============================
print("Waiting for API...")

while True:
    try:
        r = requests.get(API_URL)
        if r.status_code == 200:
            break
    except:
        pass
    time.sleep(2)

print("API Ready ✅")

# ===============================
# Get existing products
# ===============================
existing_products = []

response = requests.get(API_URL)
if response.status_code == 200:
    existing_products = [p["name"] for p in response.json()]

print(f"Existing products: {len(existing_products)}")

# ===============================
# Products list
# ===============================
products = [
    "Laptop Dell","HP Laptop","MacBook Pro","Wireless Mouse",
    "Gaming Keyboard","USB Flash 64GB","External HDD 2TB",
    "Samsung Monitor","LG Monitor","Office Chair","Standing Desk",
    "Webcam HD","Bluetooth Speaker","Router TP-Link",
    "Network Switch","Printer Canon","Scanner Epson",
    "Graphics Tablet","Microphone USB","Headphones Sony",
    "Power Bank","Smart Watch","Tablet Samsung","iPad Air",
    "Phone Stand","Laptop Bag","Cooling Pad","LED Desk Lamp",
    "Projector","HDMI Cable","Ethernet Cable","SSD 512GB",
    "RAM 16GB","GPU RTX 3060","CPU Ryzen 7","Motherboard ASUS",
    "PC Case","Gaming Chair","Mechanical Mouse","Wireless Charger",
    "Security Camera","Smart Bulb","Smart Plug",
    "Fingerprint Scanner","Barcode Scanner","POS Machine",
    "Receipt Printer","NAS Storage","Mini PC","Docking Station"
]

print("\nAdding missing products...\n")

added = 0

for product in products:

    if product in existing_products:
        continue

    data = {
        "name": product,
        "quantity": random.randint(5, 50)
    }

    res = requests.post(API_URL, json=data)

    if res.status_code == 200:
        added += 1
        print(f"✅ Added: {product}")

print(f"\n🎉 Added {added} new products!")