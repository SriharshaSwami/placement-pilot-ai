# PlacementPilot AI — Architecture Bible

**Document ID:** PP-ARCH-001  
**Version:** 1.0.0  
**Status:** Canonical Engineering Specification  
**Last Updated:** June 2026

> This document is the authoritative architectural specification for PlacementPilot AI. It should be treated as the source of truth for all implementation decisions, alongside the Project Constitution and Project Initialization documents.

---

# Table of Contents

1. Purpose
2. Architectural Vision
3. Engineering Principles
4. System Overview
5. High-Level Architecture
6. Technology Stack
7. Architectural Characteristics
8. Project Structure Philosophy
9. Layered Backend Architecture
10. Frontend Architecture
11. Service Boundaries
12. Authentication & Authorization
13. API Design Principles
14. Database Philosophy
15. AI Architecture Overview
16. Prompt Architecture
17. Future RAG & Memory
18. File Upload Architecture
19. Configuration Management
20. Logging & Observability
21. Error Handling
22. Security Principles
23. Caching Strategy
24. Rate Limiting
25. Deployment Philosophy
26. Scalability Strategy
27. Future Evolution

---

# 1. Purpose

PlacementPilot AI is designed as a production-quality AI-powered placement preparation platform. Every architectural decision must prioritize long-term maintainability over short-term implementation speed.

The project is intentionally engineered to resemble an early-stage SaaS product rather than a college project.

---

# 2. Architectural Vision

The architecture is built around five goals:

- Modular feature development
- AI-first but not AI-dependent product design
- Layered backend architecture
- Feature-oriented frontend architecture
- Extensible AI platform capable of future RAG, memory and multi-agent workflows

---

# 3. Engineering Principles

## Single Responsibility

Every module owns exactly one responsibility.

## Separation of Concerns

Controllers never contain business logic.

Controllers → Services → Repositories → Database

## Composition over Duplication

Reusable modules are preferred over inheritance or copy-paste.

## Backward Compatibility

New features should extend existing abstractions instead of rewriting them.

---

# 4. High-Level System

```text
React Application
        │
Axios / TanStack Query
        │
Express REST API
        │
Controllers
        │
Services
        │
Repositories
        │
MongoDB Atlas

              │

AI Platform
 ├─ Prompt Builder
 ├─ Model Adapter
 ├─ Response Parser
 ├─ Validation
 └─ Cache

External Services
 ├─ Gemini
 ├─ Cloudinary
 ├─ Google OAuth
 └─ Future Vector DB
```

---

# 5. Technology Stack

## Frontend

- React (Vite)
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form
- Zod
- Axios
- Framer Motion
- Recharts

## Backend

- Node.js
- Express
- JWT
- HTTP-only Cookies
- Helmet
- Cookie Parser
- Mongoose

## Infrastructure

- MongoDB Atlas
- Cloudinary
- Vercel
- Railway / Render

---

# 6. Layered Backend Architecture

Request Lifecycle

Client

↓

Router

↓

Middleware

↓

Controller

↓

Service

↓

Repository

↓

MongoDB

Responsibilities:

### Controllers

- Validate request
- Call service
- Return standardized response

### Services

- Business logic
- Transactions
- AI orchestration
- Domain rules

### Repositories

- Database access
- Query optimization
- Data mapping

---

# 7. Frontend Architecture

The frontend follows a feature-oriented design.

Rules:

- Shared components remain framework agnostic.
- Business logic belongs in hooks/services.
- Components remain presentation-focused.
- State is colocated whenever possible.

---

# 8. Authentication

Authentication uses:

- HTTP-only Cookies
- JWT Access Tokens
- Refresh Token support (future)
- Google OAuth

Authorization is role-ready from day one.

Initial roles:

- Student
- Admin

---

# 9. API Philosophy

Every response follows:

Success

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

Failure

```json
{
  "success": false,
  "message": "...",
  "error": "...",
  "details": {}
}
```

---

# 10. Database Philosophy

- Normalize where appropriate.
- Avoid duplicated data.
- Timestamp every collection.
- Design for future analytics.
- Support soft deletion when beneficial.

---

# 11. AI Architecture

Controllers never call Gemini directly.

Pipeline:

Controller

↓

AI Service

↓

Prompt Builder

↓

Model Adapter

↓

Response Parser

↓

Validation

↓

Client

Advantages:

- Model swapping
- Logging
- Caching
- Evaluation
- Future tool calling

---

# 12. Prompt Architecture

Every prompt consists of:

1. System Prompt
2. Developer Instructions
3. User Context
4. Task Payload

Prompts remain modular and reusable.

---

# 13. Future RAG

Future additions include:

- Resume Knowledge Base
- Interview Knowledge Base
- Company Knowledge Base
- Embeddings
- Vector Database
- Context Retrieval
- Memory Layer

No existing APIs should require redesign when these features are added.

---

# 14. File Uploads

Uploads:

Client

↓

Backend Validation

↓

Cloudinary

↓

Store Metadata in MongoDB

↓

Return Secure URL

The backend never trusts client-provided MIME types.

---

# 15. Configuration

Environment variables are grouped by:

- Server
- Database
- Authentication
- AI
- Cloudinary
- OAuth
- Email
- Deployment

No secrets are hardcoded.

---

# 16. Logging

Use structured logging.

Levels:

- INFO
- WARN
- ERROR
- DEBUG

Never leave console.log in production code.

---

# 17. Error Handling

Use centralized middleware.

Custom error classes define:

- Status Code
- Error Code
- Message
- Safe Metadata

Controllers should not contain repetitive try/catch blocks.

---

# 18. Security

Production defaults include:

- Helmet
- CORS
- Rate Limiting
- Secure Cookies
- Password Hashing
- Input Validation
- XSS Protection
- NoSQL Injection Prevention

---

# 19. Caching Strategy

Current:

- Browser Cache
- TanStack Query

Future:

- Redis
- AI Response Cache
- Embedding Cache

---

# 20. Deployment

Frontend:

Vercel

Backend:

Railway or Render

Database:

MongoDB Atlas

Media:

Cloudinary

---

# 21. Scalability

The architecture assumes growth to tens of thousands of users.

Design principles:

- Stateless backend
- Horizontal scaling
- Repository abstraction
- AI provider abstraction
- Independent feature modules

---

# 22. Future Evolution

The architecture intentionally supports:

- Resume tailoring
- Interview simulator
- Coding mentor
- Multi-agent AI
- Long-term memory
- Organization dashboards
- Subscription plans
- Analytics
- Notifications

without requiring major architectural rewrites.

---

# End of Document

This document should be reviewed before introducing any major feature or architectural change.
