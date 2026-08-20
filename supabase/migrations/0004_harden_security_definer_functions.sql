-- ============================================================================
-- 0004 — Harden SECURITY DEFINER helpers
-- ============================================================================
-- The helpers from 0001 are used internally by RLS policies and triggers. By
-- default PostgREST exposes any public-schema function as an RPC endpoint
-- (/rest/v1/rpc/<name>), which would let anon/authenticated callers invoke
-- them directly — `handle_new_user()` especially must never be callable.
--
-- Supabase's database linter flags this as:
--   0028_anon_security_definer_function_executable
--   0029_authenticated_security_definer_function_executable
-- ============================================================================

revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.current_profile_org() from anon, authenticated, public;
revoke execute on function public.current_profile_role() from anon, authenticated, public;
revoke execute on function public.set_updated_at() from anon, authenticated, public;
