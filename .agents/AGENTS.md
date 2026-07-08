
## Resume Fit Rules

The application should prioritize deterministic post-processing over repeated AI generation.

Never repeatedly invoke Gemini to make incremental layout adjustments.

The preferred pipeline is:
Generate Once -> Render -> Measure -> Deterministic Compression -> Render Again -> Export

Only if deterministic compression fails should ONE optional AI compression pass be executed.

Repeated AI retries for layout fitting are prohibited because they increase cost without providing proportional value.

The system should optimize for:
1. Tailoring quality
2. ATS compatibility
3. Single-page layout
4. AI cost efficiency
5. Predictable rendering
