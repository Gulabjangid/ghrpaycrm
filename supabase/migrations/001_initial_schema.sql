-- supabase/migrations/001_initial_schema.sql

-- USERS / AGENTS TABLE
CREATE TABLE agents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  phone       TEXT,
  role        TEXT NOT NULL CHECK (role IN ('admin', 'agent', 'viewer')),
  avatar_url  TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- PROPERTIES TABLE
CREATE TABLE properties (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  address      TEXT NOT NULL,
  city         TEXT NOT NULL DEFAULT 'Bengaluru',
  locality     TEXT,
  total_units  INTEGER DEFAULT 0,
  vacant_units INTEGER DEFAULT 0,
  rent_range   NUMRANGE,
  property_type TEXT CHECK (property_type IN ('coliving', 'apartment', 'villa')),
  images       TEXT[],
  amenities    TEXT[],
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- LEADS TABLE (core entity)
CREATE TABLE leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  email           TEXT,
  phone           TEXT NOT NULL,
  whatsapp        TEXT,
  source          TEXT CHECK (source IN (
                    'web', 'referral', 'walk_in', 'social',
                    'broker', 'portal', 'cold_call'
                  )),
  stage           TEXT NOT NULL DEFAULT 'new' CHECK (stage IN (
                    'new', 'contacted', 'tour_scheduled', 'tour_done',
                    'negotiation', 'booked', 'lost'
                  )),
  temperature     TEXT DEFAULT 'warm' CHECK (temperature IN ('hot', 'warm', 'cold')),
  score           INTEGER DEFAULT 50 CHECK (score BETWEEN 0 AND 100),
  assigned_to     UUID REFERENCES agents(id) ON DELETE SET NULL,
  property_id     UUID REFERENCES properties(id) ON DELETE SET NULL,
  budget_min      NUMERIC,
  budget_max      NUMERIC,
  preferred_move  DATE,
  occupants       INTEGER DEFAULT 1,
  notes           TEXT,
  tags            TEXT[],
  last_contacted  TIMESTAMPTZ,
  next_follow_up  TIMESTAMPTZ,
  lost_reason     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- VISITS / TOURS TABLE
CREATE TABLE visits (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id      UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  property_id  UUID NOT NULL REFERENCES properties(id),
  agent_id     UUID REFERENCES agents(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_min INTEGER DEFAULT 30,
  status       TEXT DEFAULT 'scheduled' CHECK (status IN (
                 'scheduled', 'completed', 'cancelled', 'no_show'
               )),
  notes        TEXT,
  feedback     TEXT,
  post_tour_form_filled BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ACTIVITIES / TIMELINE TABLE
CREATE TABLE activities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  agent_id    UUID REFERENCES agents(id),
  type        TEXT NOT NULL CHECK (type IN (
                'call', 'whatsapp', 'email', 'visit',
                'note', 'stage_change', 'assignment'
              )),
  content     TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- FOLLOW-UPS TABLE
CREATE TABLE follow_ups (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  agent_id    UUID REFERENCES agents(id),
  due_at      TIMESTAMPTZ NOT NULL,
  type        TEXT CHECK (type IN ('call', 'whatsapp', 'email', 'visit')),
  note        TEXT,
  is_done     BOOLEAN DEFAULT false,
  done_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES (Row Level Security)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;

-- Agents see only their leads; admins see all
CREATE POLICY "leads_agent_access" ON leads
  FOR ALL USING (
    assigned_to = (SELECT id FROM agents WHERE user_id = auth.uid())
    OR
    (SELECT role FROM agents WHERE user_id = auth.uid()) = 'admin'
  );

-- INDEXES for performance
CREATE INDEX idx_leads_stage ON leads(stage);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_score ON leads(score DESC);
CREATE INDEX idx_visits_scheduled_at ON visits(scheduled_at);
CREATE INDEX idx_follow_ups_due_at ON follow_ups(due_at) WHERE is_done = false;
CREATE INDEX idx_activities_lead_id ON activities(lead_id, created_at DESC);
