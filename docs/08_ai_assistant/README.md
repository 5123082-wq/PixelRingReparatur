# 08 AI Assistant

## Context Beacon

Purpose: short router for AI assistant product behavior and implementation scope.

This folder covers the assistant itself: intake, chat behavior, safety boundaries, operator handoff, knowledge context usage, channel behavior, and chat persistence. It is not the home for SEO/GEO/AI visibility strategy.

Startup rule:

- Do not read full progress log at startup.
- Read this README first, then open deeper documents only for the task area.
- Read deep only when touching Telegram/chat/safety/retrieval.
- For history, read the latest checkpoint below first, then use [ai_assistant_progress_log.md](ai_assistant_progress_log.md) in small date-based batches.

## Current Assistant Boundary

- PixelRing Reparatur remains one accountable service company, not a marketplace, contractor directory, listing platform, or "find a master" product.
- AI assists intake, triage, request clarification, and handoff language; human specialists execute the real service.
- Customer-facing assistant behavior must not expose raw CRM internals, internal notes, hidden statuses, tokens, or private customer data.
- Request number alone must never expose private request data; status or request details require the existing safe proof/session path.
- Public chat knowledge may use only public-safe context. Draft, private, internal CRM, and unpublished material must stay out of public assistant responses unless a separate authenticated/internal mode explicitly allows it.
- German is canonical-first. MVP language scope remains DE, EN, RU, TR, PL, and AR; Arabic work must remain RTL-aware.

## Read-First Rules

- General assistant orientation: read this README only.
- Website chat/intake behavior: read [ai_chat_intake.md](ai_chat_intake.md).
- Conversation tone, branching, and multilingual behavior: read [ai_conversation_design.md](ai_conversation_design.md).
- Telegram, active-request state, known-contact behavior, runtime safety, or retrieval changes: read the relevant latest entries in [ai_assistant_progress_log.md](ai_assistant_progress_log.md) before implementation.
- Security/privacy-sensitive changes: also route through `../10_security_privacy/` as needed, but keep assistant notes in this folder.

## Task-Specific Docs

- [ai_chat_intake.md](ai_chat_intake.md) - current MVP website chat intake, trigger behavior, attachments, assistant boundary, and planned intake model.
- [ai_conversation_design.md](ai_conversation_design.md) - conversation design reference for role, tone, scenarios, branching, handoff language, fallback behavior, multilingual behavior, and channel-specific behavior.
- [ai_assistant_progress_log.md](ai_assistant_progress_log.md) - full AI assistant progress history. Do not read full progress log at startup.

Planned base documents:

- `ai_assistant_blueprint.md`
- `intake_conversation_flow.md`
- `safety_and_boundaries.md`
- `handoff_to_operator.md`
- `knowledge_context_usage.md`
- `chat_persistence.md`

## Retrieval Checkpoint

Current working solution:

- The public assistant uses live runtime retrieval from published CMS articles.
- Only `PUBLISHED` article content for the active locale is eligible for public chat context.
- The implementation ranks CMS article fields and short content excerpts at request time, then sends only a compact knowledge block to OpenAI.
- This is not model training and does not require a static frozen article set.

Planned improvement options:

- Automatic CMS chunk index rebuilt whenever an article is published or updated.
- Embedding-based retrieval for stronger semantic matching once the article library grows.
- Optional OpenAI File Search / vector store evaluation for public-only knowledge if hosted retrieval becomes more practical than local indexing.
- Separate draft/preview assistant mode for owner review, so unfinished `DRAFT` or `IN_REVIEW` content can be tested without exposing it to public users.

## Latest Checkpoint

### 2026-06-17 - Telegram Conversation Controller Refactor

- **Status**: Implemented.
- **Done**: explicit Telegram conversation controller now routes new chat, intake pending, form link sent, active request, known contact without active request, and completed/cancelled request states; active PR follow-up/status turns route before the LLM; return handling reads active Telegram case context; case summary is no longer overwritten by every Telegram message after PR issuance.
- **In Progress**: Live Telegram QA after deployment.
- **Next Action**: Retest the full Telegram flow with a real chat: new problem, form submit, PR confirmation, return, `Ok`, `Что дальше?`, `Как дела с моей заявкой?`, `У меня нет заявки?`, ordinary detail update, photo upload, and explicit separate new-problem request.
- **Blockers/Risks**: Future richer client/account modeling should still separate Telegram identity from per-case routing more explicitly.
- **Full Log**: [ai_assistant_progress_log.md](ai_assistant_progress_log.md)

### 2026-06-17 - Telegram Active-Request Form Loop Guard

- **Status**: Implemented.
- **Done**: backend guard prevents active Telegram PR chats from reopening or refilling the secure form after a PR has already been issued.
- **In Progress**: Live Telegram QA after deployment.
- **Next Action**: Retest short follow-ups such as `Ok`, `Что дальше?`, and `Есть информация?`; verify the bot keeps active PR context and does not offer the secure form again.
- **Full Log**: [ai_assistant_progress_log.md](ai_assistant_progress_log.md)
