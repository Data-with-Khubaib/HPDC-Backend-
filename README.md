# HPDC Backend Services

> A robust, scalable, and highly decoupled backend infrastructure for the HPDC (Halal Product Development Center) platform, built with Node.js and Fastify.

## 📖 Overview
The HPDC Backend is a modern API designed to manage the end-to-end lifecycle of product certification. It handles authentication, company profiles, application processing, certificate generation, real-time collaboration (comments), and analytical dashboard metrics. 

The architecture strictly adheres to the **CQRS & Mediator Pattern** alongside a centralized **Dependency Injection Container**, ensuring that the routing layer is completely decoupled from business logic. Every request passes through a strict, schema-driven validation pipeline before execution.

## ✨ Key Features

- **🛡️ CQRS & Mediator Pattern**: Clean architecture separating Commands (state changes) and Queries (data fetching) with dedicated Handlers.
- **✅ Pipeline Validation**: Integrated **Zod** schema validation behavior injected straight into the Mediator pipeline. Invalid data never reaches the business logic layer.
- **⚡ Fastify Driven**: Built on top of Fastify for maximum throughput and low latency API responses.
- **🔌 Real-Time Collaboration**: Integrated WebSockets allowing users to leave live comments on active applications.
- **📊 Comprehensive Domains**:
  - **Auth & Users**: Secure login, registration, password recovery, and OTP verification.
  - **Company & Applications**: Complete management of company profiles and certification workflows.
  - **Certificates**: Automated multi-site certificate PDF generation, suspension tracking, and payment flows.
  - **Surveys**: Dynamic survey delivery and answer processing.
  - **Dashboard & Logs**: Metric aggregations for admin/company views, backed by comprehensive audit logging.

## 🏗️ Architecture Design

The project structure is strictly vertical and behavior-driven:

```text
src/
├── controllers/       # Fastify route controllers (No business logic, pure request handling)
├── mediator/          
│   ├── behaviors/     # Pipeline behaviors (e.g., validation.behavior.js)
│   ├── command/       # DTOs defining intents (Commands/Queries)
│   └── handler/       # Execution logic mapping to specific commands
├── schemas/           # Zod validation schemas for all incoming data
├── services/          # Core business logic and database repository interactions
└── container.js       # Centralized Dependency Injection and Mediator mapping hub
```
### 🔀 The Request Lifecycle Flow
```mermaid
graph TD
    %% Node Definitions & Connections
    A[HTTP Request Client] --> B[Fastify Route Controller]
    B -->|Extracts DTO Data| C[Instantiate Command / Query Object]
    C --> D[Send to Central Mediator]
    D --> E{Validation Behavior Interceptor}
    E -->|Fails Zod Schema| F[Instant 400 Bad Request Response]
    E -->|Passes Validation| G[Route to Context Handler]
    G --> H[Invoke Core Business Service]
    H -->|Database Access via Prisma| I[(PostgreSQL Database)]
    I --> H
    H -->|Return Safe Response| B

    %% Custom CSS Color-Coding Classes
    classDef client fill:#34495e,stroke:#2c3e50,stroke-width:2px,color:#fff;
    classDef routing fill:#2980b9,stroke:#1f3a60,stroke-width:2px,color:#fff;
    classDef mediator fill:#8e44ad,stroke:#5b2c6f,stroke-width:2px,color:#fff;
    classDef validation fill:#d35400,stroke:#935116,stroke-width:2px,color:#fff;
    classDef error fill:#c0392b,stroke:#78281f,stroke-width:2px,color:#fff;
    classDef business fill:#27ae60,stroke:#145a32,stroke-width:2px,color:#fff;
    classDef database fill:#f1c40f,stroke:#b7950b,stroke-width:2px,color:#2c3e50;

    %% Class Assigning
    class A client;
    class B routing;
    class C,D,G mediator;
    class E validation;
    class F error;
    class H business;
    class I database;
```
---

## 🛠️ Tech Stack & Ecosystem

* **Runtime:** Node.js (v18+)
* **Web Framework:** Fastify
* **Database ORM:** Prisma ORM
* **Data Layer:** PostgreSQL Database
* **Validation Layer:** Zod Schemas
* **Design Engine:** CQRS, Mediator, and Dependency Injection
* **Streaming Engine:** WebSockets (`ws`)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your development machine:
* **Node.js** (v18.0.0 or higher recommended)
* **npm** or **yarn** package manager
* An active **PostgreSQL** instance

### 1. Installation
Clone the repository to your local path and install dependencies:
```bash
git clone https://github.com/Data-with-Khubaib/HPDC-Backend-.git
cd HPDC-Backend-
npm install
```

### 2. Environment Configuration
Create a secure configuration environment file in your project root:
```bash
cp .env.example .env
```

Open the newly created `.env` file and configure your credentials:
```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/hpdc"
JWT_SECRET="your-super-secret-production-grade-encryption-key"
```

### 3. Database Initial Setup
Synchronize your local PostgreSQL schema with the current Prisma domain models:
```bash
npx prisma migrate dev
```

### 4. Running the Code
Start the development server with hot-reload enabled:
```bash
npm run dev
```
The server will boot up and spin up a listener on your designated `PORT` environment parameter.

---

## 📄 License

This project is proprietary and confidential. All rights reserved. Built for the **Halal Product Development Center (HPDC)**.
