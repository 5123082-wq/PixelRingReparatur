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

## Progress Log

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
