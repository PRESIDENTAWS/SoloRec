-- Enables Supabase Realtime (Postgres Changes) for the tables that drive
-- AI HQ's live state — see lib/realtime/useAgentActivity.ts. RLS still
-- applies to realtime change feeds, so a client only receives changes for
-- rows it could otherwise SELECT.
alter publication supabase_realtime add table agent_tasks;
alter publication supabase_realtime add table agent_events;
alter publication supabase_realtime add table approvals;
