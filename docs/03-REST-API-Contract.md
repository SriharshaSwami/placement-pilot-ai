# PlacementPilot AI — REST API Contract

**Document ID:** PP-API-001  
**Version:** 1.0.0  
**Status:** Canonical API Contract

---

# Table of Contents

1. API Principles
2. Global Conventions
3. Authentication APIs
4. User APIs
5. Resume APIs
6. Job APIs
7. Application APIs
8. AI APIs
9. Interview APIs
10. Dashboard APIs
11. Admin APIs
12. Error Codes
13. Versioning Strategy

---

# 1. API Principles

Base URL

```
/api/v1
```

All endpoints return JSON.

Standard Success:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Standard Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": "VALIDATION_ERROR",
  "details": {}
}
```

Authentication: HTTP-only JWT cookie unless otherwise specified.

---

# 2. Global Conventions

- Pagination: `page`, `limit`
- Sorting: `sortBy`, `order`
- Filtering through query parameters
- ISO-8601 timestamps
- UUID/ObjectId in path parameters
- Validation before controller execution

Common HTTP Codes

| Code | Meaning |
|------|---------|
|200|OK|
|201|Created|
|204|No Content|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|409|Conflict|
|422|Validation Error|
|429|Rate Limited|
|500|Internal Server Error|

---

# 3. Authentication

## POST /auth/register

Purpose: Register user

Auth: Public

Body

```json
{
  "name":"John",
  "email":"john@example.com",
  "password":"StrongPassword123!"
}
```

Returns: User profile + authentication cookie

Validation

- Unique email
- Strong password
- Valid email

---

## POST /auth/login

Purpose: Login

Auth: Public

Body

```json
{
  "email":"john@example.com",
  "password":"..."
}
```

Returns authenticated user.

---

## POST /auth/logout

Purpose

Invalidate session.

Auth

Required

Returns

204 No Content

---

## GET /auth/me

Purpose

Return current authenticated user.

---

## POST /auth/google

Purpose

Google OAuth callback/login.

---

# 4. User APIs

## PATCH /users/profile

Update profile.

Auth

Required

Allowed fields

- name
- avatar

---

## GET /users/preferences

Returns saved user preferences.

---

## PATCH /users/preferences

Update settings.

---

# 5. Resume APIs

## POST /resumes

Purpose

Upload resume.

Auth

Required

Content-Type

multipart/form-data

Fields

- file
- title

Response

```json
{
  "resumeId":"..."
}
```

---

## GET /resumes

List user resumes.

Supports

- pagination
- search
- sorting

---

## GET /resumes/:id

Return resume metadata.

---

## DELETE /resumes/:id

Soft delete resume.

---

## POST /resumes/:id/analyze

Purpose

Generate AI resume analysis.

Returns

- ATS score
- strengths
- weaknesses
- keyword gaps
- recommendations

---

# 6. Jobs

## POST /jobs

Save job description.

## GET /jobs

List jobs.

## GET /jobs/:id

Retrieve job.

## PATCH /jobs/:id

Update job.

## DELETE /jobs/:id

Delete job.

---

# 7. Applications

## POST /applications

Create application.

## GET /applications

List applications.

Supports filtering by

- status
- company
- date

## PATCH /applications/:id

Update stage.

---

# 8. AI APIs

## POST /ai/resume-review

Purpose

Analyze uploaded resume.

Response

Structured JSON only.

---

## POST /ai/job-match

Input

Resume + Job Description

Returns

- Match Score
- Missing Skills
- Recommendations

---

## POST /ai/resume-tailor

Returns tailored resume suggestions.

---

## POST /ai/interview

Starts interview session.

---

## POST /ai/code-review

Input

Source code

Returns

- Complexity
- Bugs
- Improvements
- Best Practices

---

## POST /ai/career-roadmap

Returns personalized roadmap.

---

# 9. Interview APIs

## POST /interviews

Create session.

## GET /interviews

List sessions.

## GET /interviews/:id

Session details.

## POST /interviews/:id/message

Continue conversation.

## POST /interviews/:id/end

Finish interview.

---

# 10. Dashboard APIs

## GET /dashboard

Aggregated statistics

Includes

- Resume metrics
- Applications
- AI usage
- Interview summary

---

# 11. Admin APIs (Future)

- GET /admin/users
- GET /admin/analytics
- GET /admin/ai-usage
- PATCH /admin/users/:id/status

Admin role required.

---

# 12. Error Codes

| Code | Description |
|------|-------------|
|VALIDATION_ERROR|Input invalid|
|AUTH_REQUIRED|Authentication required|
|INVALID_TOKEN|Token invalid|
|ACCESS_DENIED|Authorization failed|
|RESOURCE_NOT_FOUND|Missing resource|
|RATE_LIMITED|Too many requests|
|AI_SERVICE_ERROR|LLM unavailable|
|UPLOAD_FAILED|Cloudinary failure|

---

# 13. API Versioning

Current version:

```
/api/v1
```

Breaking changes require `/v2`.

New optional fields may be added without version changes.

Deprecation policy:

- Maintain previous version during migration.
- Announce deprecation before removal.

# End of Document
