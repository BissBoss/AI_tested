# Study AI V5 — QA notes

## Verified in this environment
- `node --check` for all three frontend script blocks.
- `node --check` for both `api/chat.js` and `api/generate.js`.
- Browser automation (Chromium via Playwright, rendered from embedded HTML): 6-step wizard on mobile 390×844; course create/switch; upload TXT and extract facts; exam date/target/daily minutes; select levels; show no-backend warning without inventing questions. **0 page errors** in tested flow.
- Backend mock tests: GET readiness; reject wrong PIN (401); verify source evidence quote exists; mock OpenAI structured-output draft and independent verification; accept exactly one valid conceptual MCQ with sources.
- Regression: old labeled offline generator creates a bank; Quiz and Flashcards open successfully; no JavaScript page errors in tested tabs.
- Frontend mocked-cloud integration: generated conceptual question is inserted, shown in Quiz, no browser errors.

## NOT tested / NOT claimed
- No actual OpenAI API key was supplied: no live model quality/accuracy measurements, nor real endpoint latency/cost tests.
- No real HTTPS deployment was performed and therefore Safari standalone/PWA network behavior remains unverified.
- Cannot claim 100% prevention of hallucination. The verification pipeline is a risk-reduction measure.
- No complete screen-reader/iOS physical-device test.

## Known limitations
- Cloud generator requires Vercel-compatible serverless host, API key and a private PIN.
- MCQ explanation and high-order reasoning must be reviewed by the student/teacher for high-stakes exams.
- 8–120 questions per setup; if too few source facts are available, output may be lower than requested.
- Full file remains in browser, but selected snippets are sent to the model.
