-- ============================================================================
-- 0003 — Demo seed (idempotent)
-- ============================================================================
-- Seeds a demo organization, target companies and canonical jobs so the
-- connected backend returns data out of the box. Mirrors lib/recruiting's mock
-- dataset; the cached scores are the outputs the lib/recruiting engine produces
-- for these inputs. Safe to re-run: every insert is ON CONFLICT DO NOTHING.
--
-- No auth users / profiles are seeded here (those come from Supabase Auth at
-- sign-up); org-scoped reads use the service-role key, which bypasses RLS.
-- ============================================================================

-- Demo organization ---------------------------------------------------------
insert into organizations (id, name, slug, plan_tier)
values ('d0000000-0000-4000-8000-000000000001', 'SoloRec Demo Agency', 'solorec-demo', 'agency')
on conflict (id) do nothing;

-- Target companies ----------------------------------------------------------
insert into companies (id, organization_id, name, domain, industry, headquarters)
values
  ('c0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001', 'Lockheed Martin', 'lockheedmartin.com', 'Aerospace & Defense', 'Bethesda, MD'),
  ('c0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000001', 'RTX', 'rtx.com', 'Aerospace & Defense', 'Arlington, VA'),
  ('c0000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000001', 'Northrop Grumman', 'northropgrumman.com', 'Aerospace & Defense', 'Falls Church, VA'),
  ('c0000000-0000-4000-8000-000000000004', 'd0000000-0000-4000-8000-000000000001', 'Booz Allen Hamilton', 'boozallen.com', 'Consulting', 'McLean, VA'),
  ('c0000000-0000-4000-8000-000000000005', 'd0000000-0000-4000-8000-000000000001', 'Atlas Health', 'atlashealth.com', 'Healthcare', 'Dallas, TX'),
  ('c0000000-0000-4000-8000-000000000006', 'd0000000-0000-4000-8000-000000000001', 'Vertex AI Labs', 'vertexailabs.com', 'Artificial Intelligence', 'San Francisco, CA'),
  ('c0000000-0000-4000-8000-000000000007', 'd0000000-0000-4000-8000-000000000001', 'Acme Aerospace', 'acmeaero.com', 'Aerospace', 'Wichita, KS')
on conflict (id) do nothing;

-- Canonical jobs (scores are the lib/recruiting engine outputs) --------------
insert into intel_jobs (
  id, organization_id, company_id, title, normalized_title, description, location,
  employment_type, workplace_type, salary_min, salary_max, currency, fingerprint,
  first_seen_at, last_seen_at, status, repost_count,
  ghost_score, hiring_probability, staffing_opportunity_score
) values
  ('40000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001',
   'Senior Cybersecurity Engineer', 'cybersecurity engineer', 'Lead defensive security engineering for mission systems.', 'Orlando, FL',
   'full_time', 'onsite', 135000, 165000, 'USD', 'seed-lm-cyber-orlando',
   '2026-08-15', '2026-08-18', 'reposted', 1, 0, 93, 93),
  ('40000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000002',
   'Systems Engineer II', 'systems engineer', 'Model-based systems engineering across radar programs.', 'Tucson, AZ',
   'full_time', 'onsite', 118000, 148000, 'USD', 'seed-rtx-sys-tucson',
   '2026-08-13', '2026-08-18', 'open', 0, 0, 82, 82),
  ('40000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000003',
   'Aegis Combat Systems Engineer', 'aegis combat systems engineer', 'Combat systems integration for naval platforms.', 'San Diego, CA',
   'full_time', 'onsite', 128000, 158000, 'USD', 'seed-ng-aegis-sandiego',
   '2026-08-17', '2026-08-18', 'reposted', 1, 0, 95, 94),
  ('40000000-0000-4000-8000-000000000004', 'd0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000004',
   'Cloud Engineer', 'cloud engineer', 'AWS-based cloud modernization for federal clients.', 'Tampa, FL',
   'full_time', 'onsite', 110000, 140000, 'USD', 'seed-ba-cloud-tampa',
   '2026-08-02', '2026-08-18', 'open', 0, 0, 74, 72),
  ('40000000-0000-4000-8000-000000000005', 'd0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000005',
   'Registered Nurse — ICU', 'registered nurse icu', 'ICU RN, night shift, sign-on bonus.', 'Dallas, TX',
   'full_time', 'onsite', 88000, 112000, 'USD', 'seed-atlas-rn-dallas',
   '2026-08-14', '2026-08-18', 'open', 0, 0, 89, 87),
  ('40000000-0000-4000-8000-000000000006', 'd0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000006',
   'Machine Learning Engineer', 'machine learning engineer', 'Train and serve large models; remote-friendly.', 'Remote',
   'full_time', 'remote', 170000, 210000, 'USD', 'seed-vertex-ml-remote',
   '2026-08-17', '2026-08-18', 'open', 0, 0, 91, 89),
  ('40000000-0000-4000-8000-000000000007', 'd0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000007',
   'Software Developer', 'software developer', 'General software development role.', 'Wichita, KS',
   'full_time', 'onsite', null, null, 'USD', 'seed-acme-dev-wichita',
   '2026-06-01', '2026-08-18', 'closed', 5, 100, 0, 0)
on conflict (id) do nothing;

-- A couple of source rows for the Lockheed opportunity (ATS + board) ---------
insert into intel_job_sources (
  id, organization_id, job_id, source, external_id, source_url, apply_url,
  first_seen_at, last_seen_at, source_posted_at, source_status
) values
  ('50000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001',
   'greenhouse', 'gh-lm-88213', 'https://boards.greenhouse.io/lockheedmartin/jobs/88213', 'https://boards.greenhouse.io/lockheedmartin/jobs/88213',
   '2026-08-15', '2026-08-18', '2026-08-15', 'open'),
  ('50000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001',
   'linkedin', 'li-77120', 'https://linkedin.com/jobs/view/77120', 'https://linkedin.com/jobs/view/77120',
   '2026-08-16', '2026-08-18', '2026-08-16', 'open')
on conflict (source, external_id) do nothing;

-- A demo watchlist and saved search -----------------------------------------
insert into intel_watchlists (id, organization_id, name)
values ('60000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001', 'Defense — High Priority Accounts')
on conflict (id) do nothing;

insert into intel_watchlist_items (id, organization_id, watchlist_id, company_id)
values
  ('61000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001'),
  ('61000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000003')
on conflict (id) do nothing;

insert into intel_saved_searches (id, organization_id, name, query)
values (
  '70000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001',
  'Engineering · High Opportunity',
  '{"keywords":"engineer","minStaffingOpportunity":80}'::jsonb
)
on conflict (id) do nothing;
