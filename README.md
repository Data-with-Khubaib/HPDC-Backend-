# 🏢 HPDC Backend Services

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
