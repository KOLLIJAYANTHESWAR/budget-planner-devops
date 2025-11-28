                                    📘 Budget Planner – Full-Stack DevOps Project

A complete full-stack Budget Planner application built using:

React (Vite) – Frontend

Spring Boot (Java 21) – Backend

MySQL – Database

JWT Authentication & Role-Based Access

Docker & Docker Hub – Containerization

GitHub Actions CI/CD – Automated build & push

Kubernetes (Docker Desktop) – Deployment

Ansible – Automated Kubernetes Deployment

This project showcases modern DevOps + Full-Stack workflow end-to-end.

🚀 Features
🔐 Authentication

✔ JWT Login / Register
✔ Secure Password Hashing (BCrypt)
✔ Stateless Authentication
✔ CORS Configured for Kubernetes

💼 Budget Management

✔ Create, update, delete budgets
✔ Track spent amount
✔ Monthly budget system

🧾 Expense Management

✔ Add & delete expenses
✔ Category, amount, description, date
✔ Associated with budget + user

🧑‍💼 User Features

✔ Each user sees only their own data
✔ Email & username unique constraints

⚙ DevOps Highlights

✔ Dockerized Backend & Frontend
✔ GitHub Actions CI/CD pipeline
✔ Kubernetes Deployments + Services
✔ NodePort exposure
✔ Ansible Automated Deployment

🏗 Tech Stack
Frontend:
React (Vite)
Axios
Context API

Backend:
Spring Boot 3
Spring Security + JWT
JPA + Hibernate
MySQL

DevOps:
Docker
Docker Hub
GitHub Actions Workflows
Kubernetes (Deployments, Services, PVC)
Ansible Automation

📦 Project Structure
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


🐳 Docker Setup

Backend Image:
docker build -t kollijayanth2006/budget-backend:latest .
docker push kollijayanth2006/budget-backend:latest

Frontend Image:
npm run build
docker build -t kollijayanth2006/budget-frontend:latest .
docker push kollijiyanth2006/budget-frontend:latest


🤖 GitHub Actions CI/CD

GitHub Actions automatically:
Builds backend JAR
Builds frontend assets
Builds Docker images
Pushes to Docker Hub

Workflow files under:
.github/workflows/


☸ Kubernetes Deployment
Apply all resources:
kubectl apply -f k8s/

Access Application:
Frontend NodePort:
http://localhost:30000

Backend NodePort:

http://localhost:30001/api

🛠 Ansible Automated Deployment
Run Ansible inside Docker:

docker run --rm -it \
  -v "%cd%:/workspace" \
  -v "%USERPROFILE%/.kube:/root/.kube" \
  -w /workspace \
  williamyeh/ansible:alpine3 \
  sh -c "apk add --no-cache curl && \
  curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl && \
  chmod +x kubectl && mv kubectl /usr/local/bin/kubectl && \
  ansible-playbook -i hosts deploy.yml"


This runs:
✔ MySQL Deployment
✔ Backend Deployment
✔ Backend Service
✔ NodePort Service
✔ Frontend Deployment
✔ Frontend Service

🧪 Testing the API

Use Postman / Curl:

Login
POST http://localhost:30001/api/auth/login
{
  "username": "jayanth",
  "password": "123456"
}

Create Expense
POST /api/expenses
Authorization: Bearer <token>

📸 Screenshots
(Add screenshots later: login page, dashboard, Kubernetes pods, Docker Hub images, Ansible output etc.)

🎯 Status
✔ Fully Working Full-Stack Application
✔ Complete CI/CD Pipeline
✔ Automated Deployment using Ansible
✔ Docker + Kubernetes Production Ready

📄 License
MIT License — free to use for learning & portfolio.

🙌 Author
Kolli Jayanth Eswar
DevOps & Full-Stack Developer