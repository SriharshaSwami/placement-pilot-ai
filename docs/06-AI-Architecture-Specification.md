# PlacementPilot AI — AI Architecture Specification

**Document ID:** PP-AI-001
**Version:** 1.0.0
**Status:** Canonical AI Engineering Specification

---

# Table of Contents

1. Vision
2. AI Architecture
3. AI Request Lifecycle
4. Model Abstraction
5. Prompt Engineering Strategy
6. Prompt Template Structure
7. Structured Output Schemas
8. Conversation Memory
9. Future RAG Pipeline
10. Tool Calling
11. Response Validation
12. Caching Strategy
13. Cost Optimization
14. Hallucination Mitigation
15. Evaluation & Observability
16. Multi-Agent Roadmap

---

# 1. Vision

AI in PlacementPilot is a platform capability, not a collection of API calls.

Goals:

- Reusable
- Observable
- Provider agnostic
- Secure
- Extensible

---

# 2. AI Architecture

Client

↓

REST API

↓

AI Service

↓

Prompt Builder

↓

Model Adapter

↓

Gemini API

↓

Response Parser

↓

Validator

↓

Structured JSON

---

# 3. AI Request Lifecycle

1. Validate input
2. Build prompt
3. Select model
4. Execute request
5. Parse response
6. Validate JSON
7. Store metadata
8. Return standardized response

---

# 4. Model Abstraction

Never call Gemini directly from controllers.

Create interchangeable adapters:

- GeminiAdapter
- OpenAIAdapter (future)
- ClaudeAdapter (future)
- LocalModelAdapter (future)

Business logic must remain unchanged when swapping providers.

---

# 5. Prompt Engineering Strategy

Every prompt contains:

- System Prompt
- Developer Instructions
- Dynamic Context
- User Input
- Output Schema

Keep prompts modular and reusable.

---

# 6. Prompt Templates

Examples:

- Resume Analysis
- Resume Tailoring
- Job Matching
- Interview Evaluation
- Coding Review
- Career Roadmap

Each template should exist independently.

---

# 7. Structured Outputs

Prefer JSON over free-form text.

Example:

```json
{
  "score": 92,
  "strengths": [],
  "weaknesses": [],
  "recommendations": []
}
```

Validate every AI response before persistence.

---

# 8. Conversation Memory

Phase 1:
No persistent memory.

Phase 2:
Conversation summaries.

Phase 3:
Long-term user preferences.

---

# 9. Future RAG

Pipeline

User Query

↓

Embedding

↓

Vector Search

↓

Relevant Context

↓

Prompt Builder

↓

LLM

Future stores:

- FAISS
- Pinecone
- Qdrant

---

# 10. Tool Calling

Future tools:

- Resume Parser
- ATS Checker
- Job Matcher
- Calendar
- Email
- Coding Evaluator

The orchestration layer decides which tools execute.

---

# 11. Response Validation

Reject:

- Invalid JSON
- Missing required fields
- Hallucinated schema
- Unsafe content

Fallback to retry or graceful error.

---

# 12. Caching

Current:

- Client cache
- TanStack Query

Future:

- Redis
- AI response cache
- Embedding cache

Cache deterministic AI tasks whenever possible.

---

# 13. Cost Optimization

- Minimize repeated prompts
- Cache reusable outputs
- Use smaller models for simple tasks
- Reserve premium models for complex workflows

---

# 14. Hallucination Mitigation

- Explicit output schemas
- Context grounding
- Temperature tuning
- Validation layer
- RAG for factual tasks

Never trust raw LLM output without validation.

---

# 15. Evaluation & Observability

Track:

- Model
- Latency
- Token usage
- Success rate
- Failure rate
- Retry count

Enable future prompt evaluation experiments.

---

# 16. Future Multi-Agent Architecture

Planned agents:

- Resume Agent
- Interview Agent
- Career Agent
- Coding Agent
- Planning Agent

A central orchestrator coordinates agents while preserving a single API interface.

# End of Document
