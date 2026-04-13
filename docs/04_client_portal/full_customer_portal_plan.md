# Phase 3
## Full customer portal with verified email

### Goal

Open the real customer cabinet after the request is already meaningful and the client verifies email.

### Scope

- verified email identity;
- magic-link login;
- account-to-request linkage;
- multi-request customer view;
- interactive diagnosis history and technical reports;
- consolidated photo/video gallery (web + selected messenger media);
- warranty section;
- client-visible portal notifications.

### Must preserve

- email becomes mandatory only at this phase;
- full cabinet access requires verified email;
- client-facing data stays normalized and safe for exposure;
- CRM internals are not shown raw to the customer.

### Out of scope

- password-heavy auth complexity unless explicitly approved later;
- billing and accounting expansion beyond the defined cabinet scope;
- partner-facing portal views.

### Main deliverables

- verified email auth flow;
- customer dashboard for active and completed requests;
- diagnosis and photo-report views;
- warranty records and downloadable files;
- request history bound to one customer identity.

### Acceptance

- a qualified client can create a verified portal identity;
- the client can see all linked requests from one account;
- diagnosis, photo report, and warranty are visible only inside the verified cabinet;
- the transition from lightweight tracking to full cabinet is clear and reversible only through server-side checks.

