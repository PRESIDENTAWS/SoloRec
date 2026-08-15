# ADR-008: Managed Auth Provider (Clerk) with Business RBAC in Our Own Tables

**Status:** Accepted — revisit if per-seat auth-vendor pricing becomes material at scale

## Context

SoloRec needs organizations, users, memberships, invitations, and (eventually) SSO — all before
Sprint 1 ships anything else, since nothing else is reachable without auth. Building this from
scratch (password hashing, session management, invite flows, eventual SAML/SSO) is a lot of
security-sensitive surface area to own for a feature that isn't the product's differentiation.

## Decision

Use a managed auth provider (**Clerk**) for authentication, session management, and organization/
membership/invitation primitives. SoloRec's own `organizations`, `organization_memberships`,
`roles`, `permissions` tables remain the source of truth for **business** RBAC (Section G) — synced
from Clerk's user/org IDs via webhook, not replaced by Clerk's own role system.

## Alternatives considered

- **Roll our own auth (NextAuth/Auth.js + custom org tables)** — full control, no per-seat vendor
  cost, but requires building and maintaining invite flows, session security, and eventually
  SSO/MFA ourselves — security-sensitive work this team should not spend Sprint 1–2 on when a
  managed option exists. Revisit if Clerk's pricing at scale (per-MAU) becomes worse than the cost
  of owning this.
- **Supabase Auth** — reasonable alternative, considered roughly equivalent for this use case;
  Clerk's organization/invitation primitives are slightly more purpose-built for B2B multi-tenant
  SaaS out of the box. Either is an acceptable choice; Clerk is the pick, not a rejection of
  Supabase Auth on technical grounds.
- **Use Clerk's own Organization Roles as the sole RBAC system** — rejected: SoloRec's permission
  model (Section G) needs fine-grained, product-specific permissions (`candidate:read_pii`,
  `submission:approve`) that don't map cleanly onto a generic auth vendor's role primitives, and
  coupling business authorization logic to a third-party vendor's schema makes it harder to
  evolve independently or migrate auth vendors later without an RBAC rewrite.

## Consequences

- `users.auth_provider_id` stores the Clerk user ID; a webhook keeps `organization_memberships` in
  sync when invitations are accepted/roles assigned in Clerk's UI (for the pieces of org management
  Clerk's own UI handles) or via SoloRec's own invite flow calling Clerk's API.
- Business permission checks (`requirePermission`) never call out to Clerk at request time — they
  read `organization_memberships.role_id` → `role_permissions` from our own database, so Clerk
  being unavailable degrades login, not already-authenticated in-app authorization checks.
- Vendor lock-in risk is scoped to authentication/session mechanics only, not business logic —
  migrating auth providers later means re-pointing `auth_provider_id` and login flows, not touching
  RBAC.
