# 08 AI Assistant

Purpose: AI assistant product behavior and implementation scope for intake, chat, safety, handoff, memory, and operator control.

This folder is for the assistant itself, not for SEO/GEO/AI visibility.

Planned base documents:
- `ai_assistant_blueprint.md`
- `intake_conversation_flow.md`
- `safety_and_boundaries.md`
- `handoff_to_operator.md`
- `knowledge_context_usage.md`
- `chat_persistence.md`

## Knowledge Retrieval Roadmap Note

Current working solution:
- The public assistant uses live runtime retrieval from published CMS articles.
- Only `PUBLISHED` article content for the active locale is eligible for public chat context.
- The current implementation is intentionally lightweight: it ranks CMS article fields and short content excerpts at request time, then sends only a compact knowledge block to OpenAI.
- This is not model training and does not require a static frozen article set.

Planned improvement options:
- Automatic CMS chunk index rebuilt whenever an article is published or updated.
- Embedding-based retrieval for stronger semantic matching once the article library grows.
- Optional OpenAI File Search / vector store evaluation for public-only knowledge if hosted retrieval becomes more practical than local indexing.
- Separate draft/preview assistant mode for owner review, so unfinished `DRAFT` or `IN_REVIEW` content can be tested without exposing it to public users.

## Progress Log

### 2026-06-16
**Telegram Known-Contact Intent Hotfix**
- **Status**: Hotfix implemented.
- **Done**:
  - Removed broad pre-AI keyword matching for known Telegram repeat-request creation so words such as "заявка" no longer create a new PR path by themselves.
  - Kept `/request` as the deterministic fallback command for unknown-contact secure form routing.
  - Let the shared assistant decide when a known Telegram customer needs the create-request confirmation button by emitting the existing action marker through the `inline_buttons` capability.
  - Tightened prompt guidance so greetings stay neutral, status questions stay status-oriented, and known-contact request creation is not treated as a website form handoff.
- **In Progress**:
  - Live Telegram QA after deployment.
- **Next Action**:
  - Retest `Привет`, `Что с моей заявкой?`, `/request`, and one clear new-problem request in the real Telegram bot.
- **Blockers/Risks**:
  - The final decision still depends on the configured AI provider; backend remains responsible for the actual PR creation confirmation.
- **Updated Documents**: `docs/08_ai_assistant/README.md`, `PROGRESS.md`

### 2026-06-16
**Telegram Known-Contact Assistant Context**
- **Status**: Implementation baseline updated.
- **Done**:
  - Added a privacy-safe known-contact state for Telegram assistant turns so the assistant can behave naturally with returning Telegram customers without receiving full email, phone, Telegram chat id, or CRM identifiers.
  - Updated assistant prompt behavior for known messenger contacts: do not announce recognition, do not ask for email/phone again, do not reveal saved contact data, and do not route ordinary new-request creation to a contact form.
  - Connected the Telegram webhook so known contacts can confirm a new request through Telegram while the shared assistant still handles normal follow-up conversation.
- **In Progress**:
  - Runtime QA of natural Telegram conversations after a known contact creates a second PR.
- **Next Action**:
  - Test a returning Telegram user asking a question, asking for a new request, and attempting to change contact data; confirm the assistant stays natural and the backend keeps contact changes out of normal chat.
- **Blockers/Risks**:
  - The prompt is guidance only; backend enforcement remains the safety boundary for contact changes and PR creation.
- **Updated Documents**: `docs/08_ai_assistant/README.md`, `docs/06_crm/README.md`, `PROGRESS.md`

### 2026-06-13
**Baseline Markdown Knowledge Refresh**
- **Status**: Implemented
- **Done**:
  - Rewrote the baseline assistant Markdown knowledge files under `signage-service/knowledge_base/` away from the obsolete LED ring-light and Dusseldorf repair-shop context.
  - Updated service scope, FAQ, intake flow, and assistant boundaries for signage repair, light advertising, installation/dismantling, modernization, film/print/branding, request status, and safety handling.
  - Reinforced that published CMS retrieval is the freshest problem-specific source and that the Markdown files are only baseline orientation/fallback context.
- **In Progress**:
  - Runtime chat QA remains pending.
- **Next Action**:
  - Test representative prompts where no CMS article is retrieved and confirm the assistant still stays in the signage-service domain.
- **Blockers/Risks**:
  - The Markdown baseline is intentionally compact; detailed problem answers should continue to come from published CMS retrieval.
- **Updated Documents**: `docs/08_ai_assistant/README.md`, `PROGRESS.md`

### 2026-06-13
**Live CMS Knowledge Retrieval MVP**
- **Status**: Implemented as a temporary working retrieval layer
- **Done**:
  - Replaced broad CMS article prompt injection with runtime relevance retrieval over published CMS articles.
  - The assistant now receives compact article knowledge blocks based on the latest user message instead of full articles loaded in sort order.
  - Structured CMS fields such as short answer, causes, safe checks, urgent warnings, service process, and work-scope factors are prioritized before full-text excerpts.
  - Added a roadmap note for future automatic chunk indexing, embedding/vector retrieval, OpenAI File Search evaluation, and draft preview mode.
- **In Progress**:
  - Runtime QA against real published problem articles and service questions.
- **Next Action**:
  - Test representative DE/RU chat prompts for common signage problems and tune lexical scoring or token limits if the wrong article is retrieved.
- **Blockers/Risks**:
  - Current retrieval is lexical, not semantic; it is a pragmatic MVP until automatic chunk/embedding retrieval is added.
  - Public chat still excludes drafts and in-review content by design.
- **Updated Documents**: `docs/08_ai_assistant/README.md`, `PROGRESS.md`

### 2026-05-06
**Shared Assistant Orchestrator**
- **Status**: In progress (Telegram CRM integration baseline)
- **Done**:
  - Added a shared assistant turn layer that reuses the existing chat reply engine, system prompt, safety filter, and history mapping.
  - Connected Telegram CRM messages to the shared assistant layer without creating a separate Telegram AI.
  - Added structured assistant action output for future channel-specific rendering.
- **In Progress**:
  - Runtime validation of Telegram channel behavior after deployment.
- **Next Action**:
  - Validate live Telegram AI replies and confirm website chat behavior remains unchanged.
- **Blockers/Risks**:
  - Website chat still has route-local UI handling for intake cards and language selector; it can be migrated to the shared layer later.
- **Updated Documents**: `docs/08_ai_assistant/README.md`, `docs/06_crm/README.md`, `PROGRESS.md`
