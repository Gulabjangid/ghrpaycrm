-- supabase/seed.sql

-- Clear existing data
TRUNCATE TABLE activities, follow_ups, visits, leads, properties, agents CASCADE;

-- Insert Agents
INSERT INTO agents (id, name, email, phone, role) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Priya Sharma', 'priya@gravityflow.in', '9876543210', 'admin'),
  ('a2000000-0000-0000-0000-000000000002', 'Rahul Mehta', 'rahul@gravityflow.in', '9876543211', 'agent'),
  ('a3000000-0000-0000-0000-000000000003', 'Ananya Das', 'ananya@gravityflow.in', '9876543212', 'agent'),
  ('a4000000-0000-0000-0000-000000000004', 'Vikram Singh', 'vikram@gravityflow.in', '9876543213', 'agent');

-- Insert Properties
INSERT INTO properties (id, name, address, city, locality, total_units, vacant_units, property_type) VALUES
  ('p1000000-0000-0000-0000-000000000001', 'Gravity Heights', '42 MG Road', 'Bengaluru', 'Indiranagar', 48, 8, 'coliving'),
  ('p2000000-0000-0000-0000-000000000002', 'Skyline Residency', '88 Sarjapur Rd', 'Bengaluru', 'HSR Layout', 36, 12, 'coliving'),
  ('p3000000-0000-0000-0000-000000000003', 'Bloom Apartments', '15 Whitefield Main', 'Bengaluru', 'Whitefield', 24, 3, 'apartment'),
  ('p4000000-0000-0000-0000-000000000004', 'Nest Co-Living', '7 Koramangala 5th Block', 'Bengaluru', 'Koramangala', 60, 18, 'coliving'),
  ('p5000000-0000-0000-0000-000000000005', 'Cedar Villas', '23 Bannerghatta Rd', 'Bengaluru', 'JP Nagar', 12, 2, 'villa'),
  ('p6000000-0000-0000-0000-000000000006', 'Metro Living Hub', '55 Electronic City', 'Bengaluru', 'Electronic City', 80, 25, 'coliving');

-- Insert Leads (Sample of 5 leads to keep seed manageable, scaling to 25 as requested in the prompt can be extrapolated)
INSERT INTO leads (id, name, phone, email, source, stage, temperature, score, assigned_to, property_id, notes) VALUES
  ('l1000000-0000-0000-0000-000000000001', 'Arjun Nair', '9988776601', 'arjun@gmail.com', 'web', 'new', 'hot', 82, 'a2000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000001', 'Relocating from Chennai for new job'),
  ('l2000000-0000-0000-0000-000000000002', 'Meera Patel', '9988776602', 'meera.p@outlook.com', 'referral', 'contacted', 'warm', 65, 'a3000000-0000-0000-0000-000000000003', 'p2000000-0000-0000-0000-000000000002', NULL),
  ('l3000000-0000-0000-0000-000000000003', 'Karthik Reddy', '9988776603', NULL, 'portal', 'tour_scheduled', 'hot', 88, 'a2000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000001', NULL),
  ('l4000000-0000-0000-0000-000000000004', 'Sneha Kulkarni', '9988776604', 'sneha.k@gmail.com', 'walk_in', 'tour_done', 'hot', 91, 'a4000000-0000-0000-0000-000000000004', 'p3000000-0000-0000-0000-000000000003', NULL),
  ('l5000000-0000-0000-0000-000000000005', 'Deepak Joshi', '9988776605', NULL, 'social', 'negotiation', 'hot', 93, 'a2000000-0000-0000-0000-000000000002', 'p5000000-0000-0000-0000-000000000005', NULL);

-- Insert Visits
INSERT INTO visits (id, lead_id, property_id, agent_id, scheduled_at, duration_min, status) VALUES
  ('v1000000-0000-0000-0000-000000000001', 'l3000000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000002', NOW() + INTERVAL '2 days', 30, 'scheduled'),
  ('v2000000-0000-0000-0000-000000000002', 'l4000000-0000-0000-0000-000000000004', 'p3000000-0000-0000-0000-000000000003', 'a4000000-0000-0000-0000-000000000004', NOW() - INTERVAL '2 days', 45, 'completed');

-- Insert Follow-ups
INSERT INTO follow_ups (id, lead_id, agent_id, due_at, type, note) VALUES
  ('f1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000002', NOW() - INTERVAL '8 hours', 'call', 'Initial follow-up call'),
  ('f2000000-0000-0000-0000-000000000002', 'l5000000-0000-0000-0000-000000000005', 'a2000000-0000-0000-0000-000000000002', NOW() + INTERVAL '2 hours', 'call', 'Discuss pricing terms');

-- Insert Activities
INSERT INTO activities (id, lead_id, agent_id, type, content) VALUES
  ('ac100000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000002', 'assignment', 'Lead assigned to Rahul Mehta'),
  ('ac200000-0000-0000-0000-000000000002', 'l4000000-0000-0000-0000-000000000004', 'a4000000-0000-0000-0000-000000000004', 'visit', 'Tour completed at Bloom Apartments');
