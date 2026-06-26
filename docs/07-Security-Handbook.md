# PlacementPilot AI — Security Handbook

**Document ID:** PP-SEC-001
**Version:** 1.0.0
**Status:** Security Engineering Standard

---

# Table of Contents

1. Security Principles
2. Authentication
3. Authorization
4. JWT Strategy
5. Cookie Policy
6. Password Storage
7. Input Validation
8. CORS
9. CSRF
10. Helmet
11. Rate Limiting
12. NoSQL Injection Prevention
13. XSS Prevention
14. File Upload Security
15. Secrets Management
16. Logging Guidelines
17. AI Prompt Injection Defense
18. OWASP Checklist
19. Secure Deployment

---

# 1. Security Principles

- Secure by default
- Least privilege
- Defense in depth
- Fail securely
- Never trust client input

---

# 2. Authentication

Supported methods:

- Email & Password
- Google OAuth

Use HTTP-only cookies for authentication.

Never store access tokens in localStorage.

---

# 3. Authorization

Roles:

- student
- admin

Enforce authorization in middleware, never in UI.

---

# 4. JWT Strategy

- Short-lived access token
- Refresh token ready
- Signed with strong secret
- Rotation support for future versions

---

# 5. Cookie Policy

Cookies must be:

- HttpOnly
- Secure (production)
- SameSite=Lax (or Strict where appropriate)

Clear cookies on logout.

---

# 6. Password Storage

- bcrypt hashing
- Strong work factor
- Never log passwords
- Never store plaintext

---

# 7. Input Validation

Validate:

- Body
- Params
- Query
- Uploaded files

Use schema validation for every endpoint.

---

# 8. CORS

Allow only trusted frontend origins.

Credentials enabled only for approved origins.

Reject wildcard origins in production.

---

# 9. CSRF

Primary protection:

- SameSite cookies

Future:

- CSRF tokens for sensitive operations if architecture evolves.

---

# 10. Helmet

Enable:

- CSP
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- HSTS (production)

---

# 11. Rate Limiting

Protect:

- Login
- Register
- AI endpoints
- File uploads

Use IP and user-based limits.

---

# 12. NoSQL Injection Prevention

- Validate all input
- Never pass raw client objects to Mongo queries
- Whitelist fields
- Sanitize query operators

---

# 13. XSS Prevention

- Escape user-generated content
- Sanitize HTML if ever supported
- Never trust rendered markdown without sanitization

---

# 14. File Upload Security

Accept only approved MIME types.

Validate:

- File size
- Extension
- MIME type

Store uploads in Cloudinary.

Never execute uploaded files.

---

# 15. Secrets Management

Store secrets only in environment variables.

Examples:

- JWT_SECRET
- MONGODB_URI
- GEMINI_API_KEY
- CLOUDINARY_SECRET

Never commit secrets to Git.

---

# 16. Logging

Never log:

- Passwords
- Tokens
- Cookies
- API keys

Mask personally identifiable information where appropriate.

---

# 17. AI Prompt Injection Protection

Treat uploaded documents as untrusted.

Never allow prompt instructions from user content to override system prompts.

Validate AI outputs before persistence.

---

# 18. OWASP Checklist

- Broken Access Control
- Cryptographic Failures
- Injection
- Insecure Design
- Security Misconfiguration
- Vulnerable Components
- Authentication Failures
- Logging & Monitoring

Review before every major release.

---

# 19. Secure Deployment

- HTTPS only
- Secure cookies
- Environment-specific configs
- Rotate secrets
- Monitor logs
- Keep dependencies updated
- Enable automated backups

# End of Document
