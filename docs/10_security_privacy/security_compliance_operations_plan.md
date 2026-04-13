# Phase 4
## Security, compliance, and operational hardening

### Goal

Harden the whole module so it is safe to operate at scale and aligned with EU privacy requirements.

### Scope

- RBAC refinement;
- specialist-limited access;
- admin hardening;
- audit logging;
- retention automation;
- deletion and export workflows;
- privacy-event tracking;
- incident and recovery procedures;
- MFA for privileged roles where applicable.

### Must preserve

- least privilege;
- privacy by design;
- no shared operator identities;
- no uncontrolled file access;
- no customer-visible leakage of internal notes.

### Out of scope

- unrelated product features outside request tracking and customer portal;
- speculative integrations without a documented privacy basis.

### Main deliverables

- finalized RBAC matrix;
- privileged-session rules;
- audit-log coverage for critical actions;
- retention and deletion policy implementation plan;
- operational incident checklist for lost requests, wrong access, and stalled handoff.

### Acceptance

- specialist access is limited to assigned requests and minimum necessary data;
- privileged actions are auditable;
- retention and deletion behavior matches the documented privacy policy;
- the request-tracking and portal stack can pass a serious internal security/privacy review before production.

