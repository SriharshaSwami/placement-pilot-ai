# PlacementPilot AI — Database Design Specification

**Document ID:** PP-DB-001  
**Version:** 1.0.0  
**Status:** Canonical Database Specification

---

# Table of Contents

1. Database Philosophy
2. Naming Conventions
3. Collection Overview
4. Collection Specifications
5. Relationships
6. Index Strategy
7. Validation Rules
8. Scalability
9. Migration Strategy

---

# 1. Database Philosophy

PlacementPilot AI uses MongoDB Atlas with Mongoose.

Guiding principles:

- Store source-of-truth data only.
- Avoid unnecessary duplication.
- Prefer references over embedding for long-lived entities.
- Every collection contains:
  - createdAt
  - updatedAt
- Soft deletion should be supported for business entities where recovery is valuable.

---

# 2. Naming Conventions

- Collections: plural, lowercase (`users`, `resumes`)
- Fields: camelCase
- IDs: ObjectId references
- Boolean fields start with `is`, `has`, `can`

---

# 3. Collection Overview

| Collection | Purpose |
|------------|---------|
| users | User profiles and authentication |
| resumes | Uploaded resumes |
| resumeAnalyses | AI-generated resume analysis |
| jobs | Saved job descriptions |
| applications | Job application tracking |
| interviewSessions | Mock interview sessions |
| interviewMessages | Conversation history |
| codingReviews | AI code review results |
| aiConversations | AI chat metadata |
| userPreferences | Product preferences |
| activityLogs | Auditable user activity |

---

# 4. Collection Specifications

## users

Purpose:
Stores account information.

Core Fields:

- name
- email (unique)
- passwordHash (nullable for OAuth)
- avatar
- provider
- role
- isVerified
- lastLoginAt

Indexes:

- unique(email)
- role

Reasoning:

Authentication, ownership and authorization originate from this collection.

---

## resumes

Purpose:

Stores uploaded resume metadata.

Fields:

- userId
- title
- cloudinaryPublicId
- fileUrl
- parsedText
- version
- isPrimary

Indexes:

- userId
- userId + isPrimary

---

## resumeAnalyses

Purpose:

Stores structured AI outputs.

Fields:

- resumeId
- atsScore
- strengths
- weaknesses
- suggestions
- keywordCoverage
- generatedByModel

Keep raw AI response only if useful for debugging.

---

## jobs

Fields

- userId
- company
- role
- description
- source
- status

Indexes

- userId
- company
- status

---

## applications

Tracks application lifecycle.

Fields

- userId
- jobId
- appliedAt
- currentStage
- notes

---

## interviewSessions

Fields

- userId
- topic
- difficulty
- status
- startedAt
- completedAt

---

## interviewMessages

Fields

- sessionId
- sender
- message
- structuredMetadata

---

## codingReviews

Fields

- userId
- language
- repository
- prompt
- aiFeedback
- score

---

## aiConversations

Fields

- userId
- feature
- model
- tokenUsage
- latencyMs

Supports future analytics.

---

## userPreferences

Fields

- theme
- preferredLanguage
- notificationSettings
- onboardingCompleted

---

## activityLogs

Purpose:

Immutable audit trail.

Fields

- userId
- action
- resource
- metadata
- ipAddress
- userAgent

---

# 5. Relationships

users

├── resumes

│      └── resumeAnalyses

├── jobs

│      └── applications

├── interviewSessions

│      └── interviewMessages

└── aiConversations

---

# 6. Validation Rules

- Email format validation
- Strong password policy
- Enum validation for roles/status
- Maximum upload size enforced
- AI structured JSON validated before persistence

---

# 7. Index Strategy

Primary indexes:

- email
- userId
- sessionId
- resumeId

Compound indexes:

- userId + createdAt
- userId + status
- company + role

Text indexes (future):

- parsedText
- job description

---

# 8. Scalability

- Separate large AI outputs into dedicated collections.
- Avoid embedding growing arrays.
- Archive old activity logs.
- Introduce sharding only when operationally required.

---

# 9. Future Migration Strategy

Future additions should not require destructive schema changes.

Use additive migrations:

- Add nullable fields first.
- Backfill asynchronously.
- Remove deprecated fields only after rollout.

Maintain backward compatibility for API consumers.

---

# Example User Document

```json
{
  "_id": "...",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "provider": "local",
  "role": "student",
  "isVerified": true,
  "createdAt": "...",
  "updatedAt": "..."
}
```

# End of Document
