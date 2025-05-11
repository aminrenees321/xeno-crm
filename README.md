## 📋 Overview
A Mini CRM platform with customer segmentation, campaign management, and AI-powered insights.

## 🛠️ Local Setup

### Prerequisites
- Node.js v16+
- Docker & Docker Compose
- MySQL 8.0+
- RabbitMQ

### Installation
```bash
# 1. Clone repository
git clone https://github.com/aminrenees321/xeno-crm.git
cd xeno-crm

# 2. Start infrastructure
docker-compose up -d mysql rabbitmq

# 3. Setup backend
cd server
cp .env.example .env  # Update with your values
npm install
npm run dev

# 4. Setup frontend (in new terminal)
cd ../client
cp .env.example .env  # Set REACT_APP_API_URL
npm install
npm start

 System Architecture
![System Architecture](https://github.com/user-attachments/assets/ad1a6e12-2cb6-46f7-8c3d-e71ca48f6664)


