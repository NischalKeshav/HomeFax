-- HomeFax Database Schema
-- Property Transparency System with Role-Based Access

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
-- Stores admins, contractors, and homeowners
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'contractor', 'homeowner')) NOT NULL,
  approved_by_admin BOOLEAN DEFAULT FALSE,
  company TEXT, -- For contractors
  contractor_role TEXT, -- For contractors (e.g., "Electrician", "Plumber")
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin Keys Table for Admin Registration
CREATE TABLE admin_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_value TEXT UNIQUE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  used_at TIMESTAMP
);

-- 2. Properties Table
-- Each property belongs to a homeowner, may have linked utilities and projects
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  registration_number TEXT UNIQUE,
  build_year INT,
  status TEXT DEFAULT 'active',
  percent_complete INT DEFAULT 100,
  zoning TEXT,
  easement_file TEXT,
  connected_utilities JSONB, -- { "internet": true, "power": "Line-45A", "water": "WL-102", "gas": "GL-56" }
  blueprints TEXT[], -- file URLs
  photos TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Projects Table
-- Tracks construction/renovation/public repair tasks
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  contractor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('build', 'renovation', 'repair', 'utility_fix')),
  description TEXT,
  status TEXT DEFAULT 'pending',
  percent_complete INT DEFAULT 0,
  attachments TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Access Requests Table
-- Controls property/project data access for contractors
CREATE TABLE access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  contractor_id UUID REFERENCES users(id),
  owner_id UUID REFERENCES users(id),
  admin_id UUID REFERENCES users(id),
  status TEXT CHECK (status IN ('pending', 'approved', 'denied')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Upkeep Logs Table
-- Property upkeep and maintenance history
CREATE TABLE upkeep_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  contractor_id UUID REFERENCES users(id),
  action TEXT,
  date TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  attachments TEXT[]
);

-- 6. Notices Table
-- City-wide or local notices (e.g., outages, construction alerts)
CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  type TEXT CHECK (type IN ('water_outage', 'road_block', 'power_issue', 'general')),
  description TEXT,
  affected_properties UUID[], -- references to properties affected
  contractor_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'active',
  percent_complete INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 7. Public Utilities Table
-- Used for admin-assigned projects (government buildings, parks, infrastructure)
CREATE TABLE public_utilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('park', 'road', 'water_line', 'power_grid', 'gas_main')),
  location TEXT,
  status TEXT DEFAULT 'operational',
  notes TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_properties_owner_id ON properties(owner_id);
CREATE INDEX idx_properties_address ON properties(address);
CREATE INDEX idx_projects_property_id ON projects(property_id);
CREATE INDEX idx_projects_contractor_id ON projects(contractor_id);
CREATE INDEX idx_access_requests_property_id ON access_requests(property_id);
CREATE INDEX idx_access_requests_contractor_id ON access_requests(contractor_id);
CREATE INDEX idx_upkeep_logs_property_id ON upkeep_logs(property_id);
CREATE INDEX idx_notices_type ON notices(type);
CREATE INDEX idx_notices_status ON notices(status);
CREATE INDEX idx_public_utilities_type ON public_utilities(type);

-- Add constraints
ALTER TABLE properties ADD CONSTRAINT chk_percent_complete CHECK (percent_complete >= 0 AND percent_complete <= 100);
ALTER TABLE projects ADD CONSTRAINT chk_project_percent_complete CHECK (percent_complete >= 0 AND percent_complete <= 100);
ALTER TABLE notices ADD CONSTRAINT chk_notice_percent_complete CHECK (percent_complete >= 0 AND percent_complete <= 100);
ALTER TABLE properties ADD CONSTRAINT chk_build_year CHECK (build_year > 1800 AND build_year <= EXTRACT(YEAR FROM NOW()) + 5);
