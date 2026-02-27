#!/bin/sh

echo "Starting backend..."

echo "Initializing DB..."
python init_db.py

echo "Starting API..."
uvicorn main:app --host 0.0.0.0 --port 8000 &

echo "Waiting before seeding..."
sleep 5

python seed_products.py

wait