# Accounts And Identity

## Purpose

This document defines how customer identity, verification, and portal access should work for the PixelRing client portal.

It exists because the public request flow and the private portal flow have different trust levels:

- a public service request can start with either phone or email;
- full portal access requires a verified email identity;
- a public request number must never become an authentication method by itself.

The goal is to keep the flow familiar to users and avoid inventing unusual registration behavior.

## Current Product Boundary

The application currently supports:

- public request creation with one contact value: phone or email;
- public request number generation;
- same-device case access through an HTTP-only cookie;
- public status lookup through request number plus matching contact;
- read-only demo portal behind a local demo gate;
- request-bound portal claim links for production onboarding;
- email-code verification from a claim link;
- production portal users with verified email;
- portal password storage as server-side password hashes;
- account-first registration by email code followed by customer-chosen password;
- portal login by email plus password;
- forgot-password reset by email code followed by a new password;
- request-level portal access grants;
- HTTP-only production portal sessions.

The application does not yet support:

- organization membership;
- object/location/asset persistence for the portal;
- customer-visible production documents, reports, warranties, or billing files;
- customer-managed email change or multi-email account recovery.

## Core Decision

The request intake flow remains low-friction:

- a customer may create a request with either phone or email;
- phone remains valid for urgent or call-first service cases;
- email is not mandatory for initial request creation.

The client portal is stricter:

- full portal access requires verified email;
- registration uses a short email code and then a customer-chosen password;
- login uses email plus password;
- password reset uses a short email code and then a new customer-chosen password;
- phone can support recovery or operator-assisted verification, but it is not the default portal identity;
- request number plus phone is not enough to show private portal data.

## Approved Claim-Link Scenario

The first implemented production onboarding path uses a request-bound link instead of open portal registration.

Flow:

1. Customer submits a request and receives a public request number.
2. System creates a portal claim link for that exact case.
3. The link is posted into the customer-visible conversation and is visible to the manager in CRM.
4. The link is valid for 24 hours.
5. If the request already has an email, the claim page pre-fills it.
6. If the request only has a phone number, the customer adds an email on the claim page.
7. System sends a short email verification code.
8. Customer enters the code on the website and sets a portal password.
9. System creates or updates the portal user, grants access to the claimed request, sets an HTTP-only portal session cookie, and opens the customer portal.
10. If the claim link expires, a manager can issue a new link from the CRM case.

Important boundary:

- the claim link alone does not open private portal data;
- the email verification code is single-use, short-lived, attempt-limited, and stored only as a hash;
- verified email creates a portal user and request-level access grant;
- customer-specific portal data is limited to requests explicitly granted to that portal user.

## Trust Levels

### Level 0: Public Visitor

The user has no trusted session.

Allowed:

- browse public pages;
- start a request;
- submit contact data and attachments through public intake.

Not allowed:

- view private request history;
- view portal messages, attachments, reports, warranties, documents, objects, or organization data.

### Level 1: Same-Device Case Access

The user created or continued a request in the same browser and still has the case access cookie.

Allowed:

- see the safe public status of the current request;
- continue the current website-origin request flow;
- start the portal claim flow for this request;
- add and verify an email for full portal access.

Not allowed:

- access full portal history without verified email;
- access organization-level objects, documents, or other requests by cookie alone.

### Level 2: Request Number Plus Contact Proof

The user provides a public request number and the same phone or email originally used on the request.

This proves knowledge of request metadata. It does not prove strong ownership of the contact channel unless an OTP, email code, or equivalent channel challenge is sent and completed.

Allowed:

- show a safe, customer-facing request status;
- start a claim flow;
- offer email verification for full portal access.

Not allowed:

- show full message history;
- show attachments, documents, reports, warranties, object data, or organization data;
- create a full portal session.

### Level 3: Verified Email Portal Account

The user has verified control of an email address through a single-use email code or equivalent single-use email challenge and can authenticate with the portal password.

Allowed:

- create a portal session in an HTTP-only cookie;
- access requests linked to that verified email and authorized organization membership;
- view portal-safe request details, messages, objects, and future documents according to server-side authorization.

Not allowed:

- access another request or organization because the user knows a public request number;
- bypass server-side authorization through client state.

### Level 4: Organization Member

The user has verified email and has been linked to an organization through a controlled invitation, CRM/admin setup, or approved account-claim flow.

Allowed:

- access organization-scoped portal data according to role and feature flags;
- see only the requests, objects, assets, documents, and members that the server authorizes.

Not allowed:

- self-join an organization only by entering its name, address, public request number, or phone number.

## Verification Paths

### Path A: Request-First User With Email

1. Customer creates a request using email as the contact method.
2. System creates the request, public request number, and same-device case access cookie.
3. System offers portal access after request creation.
4. Customer clicks "open portal" or later opens the portal login screen.
5. Customer enters the same email.
6. System sends a short-lived single-use email code.
7. Customer enters the code on the website.
8. Customer chooses a password.
9. System marks the email as verified, stores only the password hash, and creates a portal session.
10. Portal shows only data authorized for that verified email.

This is the cleanest path and should be the default public explanation for full portal access.

### Path B: Request-First User With Phone On The Same Device

1. Customer creates a request using phone as the contact method.
2. System creates the request, public request number, and same-device case access cookie.
3. System offers: add email to open the full portal.
4. Customer enters email.
5. System sends a short email code to that email.
6. Customer enters the code on the website.
7. Customer chooses a password.
8. System links the verified email to the current request through the existing same-device case access session.
9. System creates a portal session.

This path solves the common phone-first case without forcing email during urgent intake.

Important boundary:

- the phone-only request can start the portal claim only while the same-device case access session is valid;
- if the user loses that session, phone-only recovery requires an additional verification step.

### Path C: Request-First User With Phone On A New Device

1. Customer opens status or portal from a different browser/device.
2. Customer provides public request number and phone.
3. System may show only a safe request status if the phone matches the stored contact.
4. System asks for email to open the full portal.
5. Before linking the new email to the request, system must complete one of these checks:
   - SMS or voice OTP to the stored phone;
   - operator-assisted verification;
   - CRM/admin-issued portal invitation;
   - another approved recovery method.

Without this additional check, public request number plus phone must not bind a new email to the private portal account.

### Path D: Direct Portal Login

1. Customer opens `/[locale]/portal` or `/[locale]/portal/login`.
2. Customer enters email and password.
3. System returns a generic failed-login response if the credentials are invalid.
4. If the credentials are valid, system creates a portal session and shows authorized data.

If no eligible customer or organization is linked to that email, the UI should remain safe and generic. It may guide the user to start a request or contact support, but it must not reveal whether a private customer record exists.

### Path D2: Direct Portal Registration

1. Customer opens `/[locale]/portal`.
2. Customer chooses registration and enters email.
3. System sends a short email code.
4. Customer enters the code on the website.
5. Customer chooses and repeats a password.
6. System creates or updates the portal user, verifies the email, stores only the password hash, creates a portal session, and shows the empty verified dashboard when no requests are linked yet.

Registration alone does not expose request history, CRM data, documents, objects, or organization data.

### Path E: Invited Organization Member

1. Internal staff or an organization owner invites an email.
2. System sends an invitation challenge, preferably a short email code plus invitation context.
3. User verifies email on the website and sets or confirms the portal password.
4. System creates or links the portal account.
5. System grants the organization membership defined by the invitation.

This should be the first organization-member path when member access is introduced.

### Path F: Recovery Or Contact Correction

Recovery is needed when:

- the user typed the phone incorrectly;
- the user lost the original device/cookie;
- the user no longer controls the original phone;
- the user wants to change the portal email;
- the original request has only phone and no email.

Rules:

- same-device users should be allowed to correct or add email with low friction before the session expires;
- phone-only users without same-device access need SMS/voice OTP or operator-assisted verification before the request can be linked to a new email;
- support staff must not expose private request details during recovery until the user is verified;
- recovery outcomes should be audited when they change portal access.

## Phone Handling

Phone remains important for service operations:

- urgent calls;
- technician coordination;
- customer preference;
- cases where the customer does not want to use email during intake.

Phone should not be treated as the default portal identity because:

- numbers can be mistyped;
- SMS can fail;
- numbers can be reassigned or shared;
- corporate phones may be accessible to multiple people;
- SMS/PSTN authentication has known security limitations.

Recommended use:

- phone is a contact channel;
- phone can be a recovery factor;
- phone can help match a request during status lookup;
- phone does not unlock the full portal without additional proof.

## Intake UX Requirements

The first request step should remain simple, but the UI should reduce bad contact data:

- accept phone or email for request creation;
- label the field clearly as "phone or email";
- validate obvious format errors before submit;
- after successful request creation, show the contact value the user entered;
- offer a clear "correct contact" action while same-device access is available;
- offer "add email for full portal access" immediately after request creation;
- explain that email is needed for the full portal, while phone is enough to start the service request.

Do not require email before a request number is issued unless the business explicitly changes the intake strategy.

## Portal UX Requirements

The portal entry must be familiar and predictable:

- ask for email first;
- send a short email code;
- let the customer enter the code on the website;
- let the customer choose or reset a password only after the email code is verified;
- do not reveal whether the email belongs to an existing customer;
- keep session state in HTTP-only cookies;
- provide logout and session expiry.

## Data Model Direction

The first production identity layer should introduce the smallest useful model set:

- portal user;
- verified email;
- portal session;
- verification challenge;
- request-to-user access claim;
- organization membership when organization access is introduced.

Implementation names may differ from these planning terms, but the model must preserve the same boundaries.

Verification challenges should store only safe values:

- token/code hashes, not raw tokens;
- expiry time;
- consumed time;
- target email or phone;
- purpose;
- request or organization context when needed;
- attempt counters or rate-limit metadata where appropriate.

## Security Baseline

Portal identity implementation must preserve these rules:

- all portal authorization checks happen server-side;
- public request number alone never grants access;
- request number plus contact proof never grants full portal access by itself;
- email codes are short-lived, single-use, attempt-limited, and stored only as salted hashes;
- password hashes are stored server-side; plaintext passwords are never stored or emailed;
- login, email-code, recovery, and claim attempts are rate-limited;
- responses for unknown emails, unknown request numbers, and failed claim attempts are generic;
- portal sessions use HTTP-only secure cookies;
- no portal access tokens are stored in `localStorage` or `sessionStorage`;
- sensitive actions such as document download, member invitation, role change, email change, deletion request, and account recovery require audit logs;
- future billing, legal document access, or destructive actions may require step-up verification.

## Minimal Production Beta Scope

For the first real launch, keep the identity scope narrow:

- request intake still accepts phone or email;
- post-request screen offers email-code verification for portal access;
- portal registration uses email code plus password;
- portal login uses email plus password;
- forgot-password uses email code plus new password;
- verified email can see authorized requests and safe request detail;
- phone-only users can see safe status, then add email through same-device access or verified recovery;
- organization member invitations can remain deferred unless needed for the first pilot customer.

Do not ship in the first beta:

- open self-registration for any organization;
- broad RBAC;
- SMS as the default login method;
- document downloads without authorized routes;
- billing or payment account access;
- unverified phone-only access to private portal data.

## Open Decisions

- Which email delivery provider sends portal email codes in production.
- Exact production code lifetime and resend policy.
- Whether the first beta needs SMS/voice OTP or starts with operator-assisted phone recovery.
- How long same-device case access remains valid for portal claim.
- Whether phone correction is customer self-service only during same-device access or also available through CRM.
- Whether organization invitations are included in the first production beta.
- Final database model names and migration order.

## External Security References

The implementation should use these references as security guardrails:

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html): authentication errors, rate limiting, and session safety.
- [OWASP Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html): consistent responses, side-channel reset/login links, random single-use expiring tokens, and secure token storage.
- [NIST SP 800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html): authenticator assurance, OTP behavior, and caution around PSTN/SMS out-of-band authentication.
