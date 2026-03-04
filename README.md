
# Smart Inventory Dashboard (DevOps Edition)

A professional, production-ready inventory management system designed for DevOps portfolios. This project demonstrates clean architecture, RESTful API integration, and modern frontend practices without the complexity of heavy build tools.

---

# 🏗 DevOps Architecture

![Architecture](docs/screenshots/devops_architecture.gif)

---

# 🏷 DevOps Stack

![Docker](https://img.shields.io/badge/Docker-Containerization-blue)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestration-blue)
![Jenkins](https://img.shields.io/badge/Jenkins-CI/CD-red)
![Terraform](https://img.shields.io/badge/Terraform-Infrastructure-purple)
![Ansible](https://img.shields.io/badge/Ansible-Automation-red)
![Prometheus](https://img.shields.io/badge/Prometheus-Monitoring-orange)
![Grafana](https://img.shields.io/badge/Grafana-Visualization-yellow)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)

---

# 📊 System Screenshots

<p align="center">

<img src="docs/screenshots/dashboard.png" width="30%">
<img src="docs/screenshots/swagger.png" width="30%">
<img src="docs/screenshots/jenkins-pipeline.png.png" width="30%">

</p>

---

# ☸ Kubernetes & Monitoring

<p align="center">

<img src="docs/screenshots/kubernetes-pods.png.png" width="30%">
<img src="docs/screenshots/grafana-dashboard.png.png" width="30%">
<img src="docs/screenshots/prometheus-targets.png.png" width="30%">

</p>

---

# Features

### 🚀 DevOps & System

- **Health Check API**: `/health` endpoint for monitoring system status.
- **Environment Awareness**: Visual indicators for `Local`, `Staging`, or `Production` environments.
- **Activity Logging**: Tracks all create, update, and delete operations with timestamps.
- **Resilience**: Graceful handling of API downtime with UI feedback.

---

### 📊 Dashboard & Analytics

- **Real-time Stats**: Total products, total quantity, and low stock alerts.
- **Visualizations**: Interactive Bar and Pie charts (using Chart.js).
- **Advanced UI**: Glassmorphism design, dark mode, and responsive grid layout.

---

### 🛠 Inventory Management

- **Search & Filter**: Real-time search by name, and filtering for Low/Out of Stock items.
- **Sorting**: Sort by Name (A-Z) or Quantity (High/Low).
- **Stock Badges**: Visual indicators (Green/Yellow/Red) for stock levels.
- **Toast Notifications**: Immediate feedback for all actions (Success/Error).

---

### 🔐 Security & Roles

- **Role-Based Access**:
  - **Admin**: Full access (Read/Write/Delete).
  - **Viewer**: Read-only access.

- **Validation**: Backend enforcement of data integrity (no negative quantities).

---

# Tech Stack

### Backend
- Python (FastAPI)

### Frontend
- HTML
- CSS
- JavaScript

### Libraries
- Chart.js
- Toastify

### DevOps

- Docker
- Kubernetes
- Jenkins
- Terraform
- Ansible
- AWS EC2
- Prometheus
- Grafana
- Nginx

---

# Setup & Running

### 1️⃣ Install Dependencies

```bash
cd services/inventory-service
pip install fastapi uvicorn

# Run locally
uvicorn main:app --reload --port 8000

# Run with Environment Variable (Optional)

$env:ENV="Staging"; uvicorn main:app --reload

services/dashboard/index.html

📌 Project Conclusion

This project demonstrates a complete DevOps workflow by combining modern backend development with cloud-native deployment practices.

Through this system, the following DevOps principles are showcased:

CI/CD automation using Jenkins

Containerization with Docker

Container orchestration using Kubernetes

Infrastructure automation using Terraform and Ansible

Monitoring and observability using Prometheus and Grafana

The goal of this project is to provide a real-world DevOps portfolio project that demonstrates both development and operational skills in a production-style environment.

👨‍💻 Author

Ahmed Hamed
DevOps Engineer




