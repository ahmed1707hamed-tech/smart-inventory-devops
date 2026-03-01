# Smart Inventory Dashboard (DevOps Edition)

A professional, production-ready inventory management system designed for DevOps portfolios. This project demonstrates clean architecture, RESTful API integration, and modern frontend practices without the complexity of heavy build tools.

## Features

### 🚀 DevOps & System
-   **Health Check API**: `/health` endpoint for monitoring system status.
-   **Environment Awareness**: Visual indicators for `Local`, `Staging`, or `Production` environments.
-   **Activity Logging**: Tracks all create, update, and delete operations with timestamps.
-   **Resilience**: Graceful handling of API downtime with UI feedback.

### 📊 Dashboard & Analytics
-   **Real-time Stats**: Total products, total quantity, and low stock alerts.
-   **Visualizations**: Interactive Bar and Pie charts (using Chart.js).
-   **Advanced UI**: Glassmorphism design, dark mode, and responsive grid layout.

### 🛠 Inventory Management
-   **Search & Filter**: Real-time search by name, and filtering for Low/Out of Stock items.
-   **Sorting**: Sort by Name (A-Z) or Quantity (High/Low).
-   **Stock Badges**: Visual indicators (Green/Yellow/Red) for stock levels.
-   **Toast Notifications**: Immediate feedback for all actions (Success/Error).

### 🔐 Security & Roles
-   **Role-Based Access**:
    -   **Admin**: Full access (Read/Write/Delete).
    -   **Viewer**: Read-only access.
-   **Validation**: Backend enforcement of data integrity (no negative quantities).

## Tech Stack

-   **Backend**: Python (FastAPI)
-   **Frontend**: Vanilla HTML/CSS/JS (Modern ES6+)
-   **Libraries**: Chart.js (Visualization), Toastify (Notifications)
-   **Data Persistence**: JSON-based (Mock Database)

## Setup & Running

1.  **Install Dependencies**:
    ```bash
    cd services/inventory-service
    pip install fastapi uvicorn
    ```

2.  **Start Backend**:
    ```bash
    # Run locally
    uvicorn main:app --reload --port 8000
    
    # Run with Environment Variable (Optional)
    # Windows (PowerShell)
    $env:ENV="Staging"; uvicorn main:app --reload
    ```

3.  **Run Frontend**:
    -   Simply open `services/dashboard/index.html` in your browser.
    -   Or use a live server extension.

## Credentials

| Role | Username | Password | Permissions |
|------|----------|----------|-------------|
| **Admin** | `admin` | `admin` | Full Access |
| **Viewer** | `viewer` | `viewer` | Read Only |

## API Endpoints

-   `GET /health`: System status.
-   `GET /products`: List all products.
-   `GET /activities`: List recent activities.
-   `POST /login`: Authenticate user.
-   `POST /products`: Add new product (Admin).
-   `PUT /products/{name}`: Update stock (Admin).
-   `DELETE /products/{name}`: Remove product (Admin).
