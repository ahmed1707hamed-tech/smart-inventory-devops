# Smart Inventory Dashboard (DevOps Edition)

A professional, production-ready inventory management system designed for DevOps portfolios. This project demonstrates clean architecture, RESTful API integration, and modern frontend practices without the complexity of heavy build tools.

---

# 🏗 DevOps Architecture

![Architecture](docs/devops_architecture.gif)

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

# 📊 Dashboard

![Dashboard](docs/screenshots/dashboard.png)

---

# ⚙️ CI/CD Pipeline

![Jenkins](docs/screenshots/jenkins-pipeline.png.png)

---

# ☸ Kubernetes Deployment

![Kubernetes](docs/screenshots/kubernetes-pods.png.png)

---

# 📊 Monitoring

## Grafana Dashboard

![Grafana](docs/screenshots/grafana-dashboard.png.png)

## Prometheus Targets

![Prometheus](docs/screenshots/prometheus-targets.png.png)

---

# 📘 API Documentation

![Swagger](docs/screenshots/swagger.png)

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

- **Backend**: Python (FastAPI)
- **Frontend**: Vanilla HTML/CSS/JS (Modern ES6+)
- **Libraries**: Chart.js (Visualization), Toastify (Notifications)
- **Data Persistence**: JSON-based (Mock Database)

---
# ⚙️ Setup & Running

## 1️⃣ Install Dependencies

```bash
cd services/inventory-service
pip install fastapi uvicorn
```

---

## 2️⃣ Start Backend

Run locally:

```bash
uvicorn main:app --reload --port 8000
```

Run with Environment Variable (Optional):

```bash
$env:ENV="Staging"; uvicorn main:app --reload
```

---

## 3️⃣ Run Frontend

Simply open:

```
services/dashboard/index.html
```

---

# ☁️ Infrastructure Deployment

## 4️⃣ Provision Infrastructure with Terraform

```bash
cd infra/terraform

terraform init
terraform plan
terraform apply
```

---

## 5️⃣ Configure Servers with Ansible

```bash
cd infra/ansible

ansible-playbook setup.yml
```

---

## 6️⃣ Deploy Application to Kubernetes

```bash
cd infra/k8s

kubectl apply -f .
```

---

## 7️⃣ Verify Deployment

Check Kubernetes Pods:

```bash
kubectl get pods
```

You should see running pods similar to:

- inventory-service
- alert-service
- dashboard
- nginx-gateway

---

# 📊 Monitor the System

## 8️⃣ Access Monitoring Stack

Grafana and Prometheus are used for monitoring.

Check Prometheus targets:

```
http://<server-ip>:9090
```

Open Grafana dashboard:

```
http://<server-ip>:3000
```

# Conclusion

This project demonstrates the implementation of a complete DevOps workflow by building and deploying a smart inventory management system. The application was developed using FastAPI for the backend and a lightweight frontend using HTML, CSS, and JavaScript.

Throughout this project, several DevOps practices were applied, including containerization with Docker, continuous integration and continuous deployment using Jenkins, and orchestration using Kubernetes. Infrastructure provisioning was automated using Terraform, while server configuration was handled through Ansible.

In addition, monitoring and observability were implemented using Prometheus and Grafana to track system performance and service health. The goal of this project was to simulate a real-world DevOps environment and demonstrate practical skills in building, deploying, and managing cloud-native applications.






