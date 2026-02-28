# 📘 Budget Planner – Full-Stack DevOps Project

A complete Full-Stack Budget Planner application built using **React (Vite), Spring Boot (Java 21), MySQL, Docker, Kubernetes, GitHub Actions, and Ansible**.

This project demonstrates a complete modern DevOps + Full-Stack workflow from development to automated Kubernetes deployment.

---

## 📌 Project Overview

Budget Planner is a secure, containerized, production-ready application designed to:

- Manage monthly budgets
- Track user expenses
- Provide secure JWT authentication
- Support CI/CD automation
- Deploy on Kubernetes using Ansible

---

## 🏗️ Architecture

```
User → React Frontend → Spring Boot Backend → MySQL
                                ↓
                        Docker Containers
                                ↓
                         Kubernetes Cluster
                                ↓
                         Ansible Automation
```

---

## 🚀 Features

### 🔐 Authentication

- JWT-based Login / Registration
- Secure password hashing (BCrypt)
- Stateless authentication
- CORS configured for Kubernetes deployment
- Unique username & email constraints

---

### 💼 Budget Management

- Create monthly budgets
- Update & delete budgets
- Track total spent amount
- Associate budgets per user

---

### 🧾 Expense Management

- Add & delete expenses
- Expense category, amount, description, date
- Linked to specific budget
- User-isolated data access

---

### 🧑‍💼 User Features

- Each user sees only their own budgets & expenses
- Secure role-based access
- Database-level constraints for data integrity

---

## ⚙ DevOps Highlights

- Dockerized Backend & Frontend
- Docker Hub image hosting
- GitHub Actions CI/CD pipeline
- Kubernetes Deployments & Services
- NodePort exposure
- Ansible automated Kubernetes deployment
- Persistent MySQL storage

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Axios
- Context API

### Backend
- Spring Boot 3 (Java 21)
- Spring Security + JWT
- JPA + Hibernate
- MySQL

### DevOps
- Docker
- Docker Hub
- GitHub Actions
- Kubernetes (Deployments, Services, PVC)
- Ansible

---

## 📦 Project Structure

```
budget-planner-devops/
│
├── ansible/
│   ├── deploy.yml
│   ├── hosts
│   └── roles/
│
├── k8s/
│   ├── mysql-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── backend-nodeport.yaml
│   ├── frontend-deployment.yaml
│   └── frontend-service.yaml
│
├── BudgetPlannerr/          # Spring Boot backend
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── budget-frontend/         # React frontend
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── vite.config.js
│
└── README.md
```

---

## 🐳 Docker Setup

### Backend Image

```bash
docker build -t kollijayanth2006/budget-backend:latest .
docker push kollijayanth2006/budget-backend:latest
```

### Frontend Image

```bash
npm run build
docker build -t kollijayanth2006/budget-frontend:latest .
docker push kollijayanth2006/budget-frontend:latest
```

---

## 🤖 GitHub Actions CI/CD

GitHub Actions automatically:

- Builds backend JAR
- Builds frontend production assets
- Builds Docker images
- Pushes images to Docker Hub

Workflow files are located under:

```
.github/workflows/
```

---

## ☸ Kubernetes Deployment

Apply all Kubernetes resources:

```bash
kubectl apply -f k8s/
```

### Access Application

Frontend (NodePort):
```
http://localhost:30000
```

Backend API:
```
http://localhost:30001/api
```

---

## 🛠 Ansible Automated Deployment

Run Ansible inside Docker:

```bash
docker run --rm -it \
  -v "%cd%:/workspace" \
  -v "%USERPROFILE%/.kube:/root/.kube" \
  -w /workspace \
  williamyeh/ansible:alpine3 \
  sh -c "apk add --no-cache curl && \
  curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl && \
  chmod +x kubectl && mv kubectl /usr/local/bin/kubectl && \
  ansible-playbook -i hosts deploy.yml"
```

This command deploys:

- MySQL Deployment
- Backend Deployment
- Backend Service
- Backend NodePort
- Frontend Deployment
- Frontend Service

---

## 🧪 API Testing

### Login

```http
POST http://localhost:30001/api/auth/login
```

```json
{
  "username": "jayanth",
  "password": "123456"
}
```

---

### Create Expense

```http
POST /api/expenses
Authorization: Bearer <token>
```

---

## 📸 Screenshots

(Add screenshots for:)

- Login Page
- Dashboard
- Budget & Expense View
- Kubernetes Pods
- Docker Hub Images
- Ansible Deployment Output

---

## 🎯 Project Status

- Fully working full-stack application
- Complete CI/CD pipeline
- Automated Kubernetes deployment
- Production-ready container architecture

---

## 📄 License

MIT License — Free to use for learning and portfolio projects.

---

## 👨‍💻 Author

**Kolli Jayanth Eswar**

DevOps & Full-Stack Developer
