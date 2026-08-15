-- System role/permission catalog — global reference data (not org-specific),
-- so it belongs in a migration, not a per-environment seed script. See
-- lib/auth/authorization.ts for the requirePermission() module that reads
-- this at runtime.

insert into roles (key, name) values
  ('owner', 'Owner'),
  ('admin', 'Admin'),
  ('recruiter', 'Recruiter'),
  ('sales', 'Sales'),
  ('coordinator', 'Coordinator'),
  ('finance', 'Finance')
on conflict (key) do nothing;

insert into permissions (key, description) values
  ('candidate:read', 'View candidate records'),
  ('candidate:create', 'Create candidate records'),
  ('candidate:update', 'Edit candidate records'),
  ('candidate:read_pii', 'View candidate contact info and other sensitive fields'),
  ('job:read', 'View job requisitions'),
  ('job:create', 'Create job requisitions'),
  ('job:update', 'Edit job requisitions'),
  ('job:close', 'Close or cancel a job'),
  ('client:read', 'View client and company records'),
  ('client:create', 'Create client and company records'),
  ('client:update', 'Edit client and company records'),
  ('submission:create', 'Create a candidate submission'),
  ('submission:approve', 'Approve a candidate submission'),
  ('approval:decide', 'Approve or reject a pending AI approval request'),
  ('finance:read', 'View invoices and financial records'),
  ('invoice:create', 'Create invoices'),
  ('org:manage_members', 'Invite, remove, and change the role of organization members')
on conflict (key) do nothing;

insert into role_permissions (role_key, permission_id)
select 'owner', id from permissions
on conflict do nothing;

insert into role_permissions (role_key, permission_id)
select 'admin', id from permissions where key <> 'org:manage_members'
on conflict do nothing;

insert into role_permissions (role_key, permission_id)
select 'recruiter', id from permissions
where key in (
  'candidate:read','candidate:create','candidate:update','candidate:read_pii',
  'job:read','job:create','job:update',
  'client:read',
  'submission:create','submission:approve'
)
on conflict do nothing;

insert into role_permissions (role_key, permission_id)
select 'sales', id from permissions
where key in ('client:read','client:create','client:update','job:read','candidate:read')
on conflict do nothing;

insert into role_permissions (role_key, permission_id)
select 'coordinator', id from permissions
where key in ('client:read','job:read','candidate:read','submission:approve')
on conflict do nothing;

insert into role_permissions (role_key, permission_id)
select 'finance', id from permissions
where key in ('finance:read','invoice:create','client:read')
on conflict do nothing;
