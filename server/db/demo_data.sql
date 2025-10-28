-- Demo Data for HomeFax
-- 20 New Properties for Pending Verification
-- 10 New Contractors with Active Projects
-- This saturates the system to show it in full use

-- First, let's create 10 new contractors with varied specialties
INSERT INTO users (name, email, password_hash, role, approved_by_admin, company, contractor_role)
VALUES
  ('Michael Chen', 'michael.chen@builders.com', '$2b$10$r.QnXyKqZ8qJQdQ5KXjK9uJQdQ5KXjK9uJQdQ5KXjK9uJQdQ5KXjK9', 'contractor', true, 'Chen Construction Inc', 'General Contractor'),
  ('Sarah Johnson', 'sarah.johnson@designbuild.com', '$2b$10$r.QnXyKqZ8qJQdQ5KXjK9uJQdQ5KXjK9uJQdQ5KXjK9uJQdQ5KXjK9', 'contractor', true, 'Johnson Design Build', 'Architect'),
  ('David Martinez', 'david.martinez@elitebuilders.com', '$2b$10$r.QnXyKqZ8qJQdQ5KXjK9uJQdQ5KXjK9uJQdQ5KXjK9uJQdQ5KXjK9', 'contractor', true, 'Elite Builders LLC', 'Project Manager'),
  ('Emily Rodriguez', 'emily.rodriguez@modernhomes.com', '$2b$10$r.QnXyKqZ8qJQdQ5KXjK9uJQdQ5KXjK9uJQdQ5KXjK9uJQdQ5KXjK9', 'contractor', true, 'Modern Homes Construction', 'Designer'),
  ('James Wilson', 'james.wilson@premiumbuilds.com', '$2b$10$r.QnXyKqZ8qJQdQ5KXjK9uJQdQ5KXjK9uJQdQ5KXjK9uJQdQ5KXjK9', 'contractor', true, 'Premium Builds Co', 'Foreman'),
  ('Lisa Anderson', 'lisa.anderson@smartbuild.com', '$2b$10$r.QnXyKqZ8qJQdQ5KXjK9uJQdQ5KXjK9uJQdQ5KXjK9uJQdQ5KXjK9', 'contractor', true, 'Smart Build Solutions', 'Engineer'),
  ('Robert Taylor', 'robert.taylor@luxuryconstruction.com', '$2b$10$r.QnXyKqZ8qJQdQ5KXjK9uJQdQ5KXjK9uJQdQ5KXjK9uJQdQ5KXjK9', 'contractor', true, 'Luxury Construction Group', 'Estimator'),
  ('Maria Garcia', 'maria.garcia@greenbuild.com', '$2b$10$r.QnXyKqZ8qJQdQ5KXjK9uJQdQ5KXjK9uJQdQ5KXjK9uJQdQ5KXjK9', 'contractor', true, 'Green Build LLC', 'Sustainability Expert'),
  ('Kevin Brown', 'kevin.brown@fasttrack.com', '$2b$10$r.QnXyKqZ8qJQdQ5KXjK9uJQdQ5KXjK9uJQdQ5KXjK9uJQdQ5KXjK9', 'contractor', true, 'Fast Track Builders', 'Superintendent'),
  ('Jennifer Lee', 'jennifer.lee@prestigehomes.com', '$2b$10$r.QnXyKqZ8qJQdQ5KXjK9uJQdQ5KXjK9uJQdQ5KXjK9uJQdQ5KXjK9', 'contractor', true, 'Prestige Homes Inc', 'Inspector')
ON CONFLICT (email) DO NOTHING;

-- Now let's get the IDs of these contractors and Richard Jackson
WITH contractor_ids AS (
  SELECT id, name FROM users WHERE role = 'contractor' AND approved_by_admin = true ORDER BY created_at DESC LIMIT 11
)
SELECT id, name FROM contractor_ids;

-- 20 New Properties for Pending Verification
-- These are submitted by contractors and awaiting admin approval
INSERT INTO properties (address, build_year, zoning, registration_number, status, property_category, property_value, created_at)
VALUES
  ('500 Innovation Drive, Bentonville AR', 2025, 'Commercial', 'COM-2025-001', 'pending_verification', 'commercial', 3500000.00, NOW()),
  ('750 Tech Parkway, Bentonville AR', 2025, 'Mixed Use', 'MIX-2025-002', 'pending_verification', 'mixed_use', 4200000.00, NOW()),
  ('850 Executive Boulevard, Bentonville AR', 2025, 'Commercial', 'COM-2025-003', 'pending_verification', 'commercial', 2800000.00, NOW()),
  ('920 Development Road, Bentonville AR', 2025, 'Residential', 'RES-2025-004', 'pending_verification', 'residential', 1800000.00, NOW()),
  ('1100 Business Circle, Bentonville AR', 2025, 'Commercial', 'COM-2025-005', 'pending_verification', 'commercial', 5100000.00, NOW()),
  ('1250 Corporate Way, Bentonville AR', 2025, 'Mixed Use', 'MIX-2025-006', 'pending_verification', 'mixed_use', 3900000.00, NOW()),
  ('1400 Enterprise Avenue, Bentonville AR', 2025, 'Commercial', 'COM-2025-007', 'pending_verification', 'commercial', 6700000.00, NOW()),
  ('1550 Industry Lane, Bentonville AR', 2025, 'Residential', 'RES-2025-008', 'pending_verification', 'residential', 2200000.00, NOW()),
  ('1700 Commerce Street, Bentonville AR', 2025, 'Commercial', 'COM-2025-009', 'pending_verification', 'commercial', 4400000.00, NOW()),
  ('1850 Trade Center Blvd, Bentonville AR', 2025, 'Mixed Use', 'MIX-2025-010', 'pending_verification', 'mixed_use', 5500000.00, NOW()),
  ('2000 Marketplace Drive, Bentonville AR', 2025, 'Residential', 'RES-2025-011', 'pending_verification', 'residential', 1600000.00, NOW()),
  ('2150 Business Park Dr, Bentonville AR', 2025, 'Commercial', 'COM-2025-012', 'pending_verification', 'commercial', 3300000.00, NOW()),
  ('2300 Corporate Plaza, Bentonville AR', 2025, 'Commercial', 'COM-2025-013', 'pending_verification', 'commercial', 4800000.00, NOW()),
  ('2450 Financial Center, Bentonville AR', 2025, 'Mixed Use', 'MIX-2025-014', 'pending_verification', 'mixed_use', 5200000.00, NOW()),
  ('2600 Healthcare Campus, Bentonville AR', 2025, 'Mixed Use', 'MIX-2025-015', 'pending_verification', 'mixed_use', 5900000.00, NOW()),
  ('2750 Retail District, Bentonville AR', 2025, 'Commercial', 'COM-2025-016', 'pending_verification', 'commercial', 4100000.00, NOW()),
  ('2900 Innovation Hub, Bentonville AR', 2025, 'Commercial', 'COM-2025-017', 'pending_verification', 'commercial', 6300000.00, NOW()),
  ('3050 Research Park, Bentonville AR', 2025, 'Mixed Use', 'MIX-2025-018', 'pending_verification', 'mixed_use', 5400000.00, NOW()),
  ('3200 Medical Plaza, Bentonville AR', 2025, 'Commercial', 'COM-2025-019', 'pending_verification', 'commercial', 7200000.00, NOW()),
  ('3350 Education Center, Bentonville AR', 2025, 'Mixed Use', 'MIX-2025-020', 'pending_verification', 'mixed_use', 4600000.00, NOW());

-- Now create 20 pending access requests for these new properties
-- We'll assign them to different contractors
WITH new_properties AS (
  SELECT id FROM properties WHERE status = 'pending_verification' ORDER BY created_at DESC LIMIT 20
),
contractor_list AS (
  SELECT id FROM users WHERE role = 'contractor' AND approved_by_admin = true LIMIT 11
)
INSERT INTO access_requests (property_id, contractor_id, request_type, status, requester_details)
SELECT 
  np.id,
  cl.id,
  'new_property_submission',
  'pending',
  'Pending admin verification for new property construction project'
FROM new_properties np
CROSS JOIN LATERAL (SELECT id FROM contractor_list ORDER BY RANDOM() LIMIT 1) cl;

-- Also create Richard Jackson's 100M dollar property for Mr. Caspian Holstrom
INSERT INTO properties (address, build_year, zoning, registration_number, status, property_category, property_value, created_at)
VALUES 
  ('3906 SW Stonefield St, Bentonville AR', 2025, 'Mixed Use', 'LUX-2025-100M', 'in_progress', 'mixed_use', 67000000.00, NOW());

-- Create a project for Richard Jackson on this property
WITH richard AS (SELECT id FROM users WHERE email = 'richard.jackson@renovator.com'),
     property_id AS (SELECT id FROM properties WHERE address = '3906 SW Stonefield St, Bentonville AR')
INSERT INTO projects (property_id, contractor_id, type, description, status, percent_complete, created_at)
SELECT property_id.id, richard.id, 'build', 'Complete 100M dollar mixed-use neuroscience clinic with private runway', 'in_progress', 15, NOW()
FROM richard, property_id;

