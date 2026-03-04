# 🚀 Smart Inventory Dashboard (DevOps Edition)

![Architecture](screenshots/devops_architecture.gif)

A **production-ready inventory management system** designed to demonstrate modern **DevOps practices** including CI/CD automation, containerization, Kubernetes deployment, infrastructure as code, and monitoring.

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

# 📑 Table of Contents

- [Architecture](#architecture)
- [Features](#features)
- [Dashboard](#dashboard)
- [CI/CD Pipeline](#cicd-pipeline)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Monitoring](#monitoring)
- [API Documentation](#api-documentation)
- [Tech Stack](#tech-stack)
- [Setup & Running](#setup--running)
- [Credentials](#credentials)
- [API Endpoints](#api-endpoints)

---

# 🏗 Architecture

![Architecture](docs/screenshots/devops_architecture.gif)

This project demonstrates a **complete DevOps workflow**:

Developer → GitHub → Jenkins CI/CD → Docker → Kubernetes → Monitoring → Users

Infrastructure is provisioned using **Terraform** and configured using **Ansible**.

---

# ✨ Features

## 🚀 DevOps & System

- Health Check API (`/health`)
- Environment Awareness (Local / Staging / Production)
- Activity Logging
- API Failure Handling
- Infrastructure Automation

---

## 📊 Dashboard

![Dashboard](screenshots/dashboard.png)

- Real-time inventory statistics
- Interactive charts using **Chart.js**
- Dark mode UI
- Responsive layout
- Glassmorphism design

---

## ⚙️ CI/CD Pipeline

![Jenkins Pipeline](docs/screenshots/jenkins-pipeline.png.png)

Pipeline stages:

1️⃣ Pull code from GitHub  
2️⃣ Build Docker images  
3️⃣ Push images to registry  
4️⃣ Deploy to Kubernetes  

---

## ☸ Kubernetes Deployment

![Kubernetes Pods](docs/screenshots/kubernetes-pods.png.png)

Services run inside Kubernetes pods to ensure:

- Scalability
- Fault tolerance
- High availability

---

# 📊 Monitoring

## Grafana Dashboard

![Grafana](docs/screenshots/grafana-dashboard.png.png)

Grafana visualizes metrics collected by Prometheus.

---

## Prometheus Targets

![Prometheus](docs/screenshots/prometheus-targets.png.png)

Prometheus monitors system health, containers, and services.

---

# 📘 API Documentation

![Swagger](docs/screenshots/swagger.png)

FastAPI automatically generates interactive **Swagger documentation**.

---

# 🧰 Tech Stack

### Backend
- Python
- FastAPI

### Frontend
- HTML
- CSS
- JavaScript

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

# 🧱 Project Structure




