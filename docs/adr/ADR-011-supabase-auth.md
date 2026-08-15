# ADR-011: Supabase Auth, Superseding ADR-008 (Clerk)

**Status:** Accepted

## Context

[ADR-008](./ADR-008-auth-provider.md) chose Clerk for authentication, made before SoloRec had a
live backend and while evaluating auth vendors on a level playing field. That's no longer the
situation: this sprint connects a real Supabase project as the primary data store, and that project
already provides Postgres, Storage, and Realtime that SoloRec needs regardless of the auth
decision. pgvector (for the memory architecture in
[`docs/architecture/04-ai-and-agents.md`](../architecture/04-ai-and-agents.md#m-memory-architecture))
also lives in that same Postgres instance. Layering Clerk on top now would mean running two
identity systems that both need to agree on who a user is — a webhook-synced `auth_provider_id`
(ADR-008's design) plus Supabase's own `auth.users`, RLS's `auth.uid()`, and Storage's access
policies all keying off Supabase's identity instead.

## Decision

Use **Supabase Auth** for authentication and session management. Business RBAC remains exactly
where ADR-008 put it: SoloRec-owned `organizations`, `organization_memberships`, `roles`,
`permissions`, `role_permissions` tables, independent of the auth provider's own user object.
`auth.users` (Supabase's table) is the identity anchor; `public.profiles` (one row per
`auth.users.id`) holds SoloRec-specific profile fields; `organization_memberships.role` is what
`requirePermission()` actually checks — never Supabase user metadata.

## Reasons

- Supabase Postgres, Storage, and Realtime are already required dependencies (ADR-001, and this
  sprint's `agent_tasks`/`agent_events`/`approvals` realtime subscriptions) — Supabase Auth is the
  same project, same connection, same RLS story, not an additional vendor.
- Supabase RLS policies can reference `auth.uid()` directly, which is simpler and more idiomatic
  than the session-GUC approach (`SET app.current_org_id` per transaction) that a non-Supabase-auth
  provider would have required — see the `user_organization_ids()` helper function in
  `supabase/migrations/20260815000002_identity_and_tenancy.sql` for the resulting policy pattern.
- One fewer vendor webhook to keep in sync (ADR-008's Clerk→`organization_memberships` sync job is
  eliminated entirely — Supabase's own `auth.users` insert trigger creates the `profiles` row
  directly, in the same transaction, with no webhook round-trip to go stale).
- Cost: Supabase Auth is included in the same project/plan already being paid for; Clerk would have
  been a second per-MAU bill for a project at this stage.

## What does NOT change

Everything in ADR-008 about **why RBAC stays app-owned** still applies, verbatim, just pointed at a
different provider: `organization_memberships.role` and the `role_permissions` grant table are the
only things `requirePermission()` (`lib/auth/authorization.ts`) ever checks. Supabase user metadata
(`raw_user_meta_data`, `app_metadata`) is never treated as an authorization source — it's used only
to seed `profiles.first_name`/`last_name` on signup. This is the same non-negotiable line ADR-008
drew against Clerk's role primitives, now drawn against Supabase's.

## Alternatives considered

- **Keep Clerk, add Supabase only for data** — rejected: this is the two-identity-systems problem
  described in Context. Every RLS policy would need a Clerk-ID-to-Supabase-`auth.uid()` mapping
  layer that doesn't need to exist if Supabase Auth issues the JWT RLS already trusts natively.
- **Roll a fully custom auth system** — rejected for the same reasons ADR-008 rejected it: password
  handling, session security, and email flows (confirmation, password reset) are security-sensitive
  surface area with no product-differentiation upside to owning it.

## Consequences

- `middleware.ts` + `lib/supabase/middleware.ts` refresh the Supabase session cookie on every
  request and redirect unauthenticated requests away from protected routes — see
  [`docs/PRODUCT_ARCHITECTURE.md`](../PRODUCT_ARCHITECTURE.md) for the route list.
- `lib/auth/bootstrap.ts`'s `ensureOrganizationForUser` replaces ADR-008's webhook sync: it runs
  synchronously (via the service-role client) the first time a user with no active membership hits
  an authenticated route, creating their organization, owner membership, and default agent registry
  in one place — no webhook, no eventual-consistency window.
- RLS policies reference `auth.uid()` through the `user_organization_ids()` SECURITY DEFINER helper
  function rather than a session-local GUC — see
  [`docs/architecture/03-security-and-tenancy.md`](../architecture/03-security-and-tenancy.md),
  which should be read as updated by this ADR for the specific RLS mechanism (the two-layer
  isolation *principle* — app-layer scoping plus RLS as defense-in-depth — is unchanged).
- Any future SSO/SAML requirement is a Supabase Auth configuration change, not a provider migration.
