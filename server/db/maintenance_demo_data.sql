-- Add maintenance system demo data for 6000 SW Broadway and other properties

-- Add maintenance tasks for 6000 SW Broadway St (owned by Abhijit Paradkar)
INSERT INTO maintenance_tasks (property_id, task_name, task_type, frequency_months, last_completed, next_due_date, status, homeowner_editable, notes)
SELECT 
  p.id,
  'Replace Air Filter',
  'filters',
  2, -- Every 2 months
  NOW() - INTERVAL '1 month',
  NOW() + INTERVAL '1 month',
  'pending',
  true,
  'HVAC air filter in basement'
FROM properties p WHERE p.address LIKE '%6000%SW%Broadway%'
LIMIT 1;

INSERT INTO maintenance_tasks (property_id, task_name, task_type, frequency_months, last_completed, next_due_date, status, homeowner_editable, notes)
SELECT 
  p.id,
  'Replace Water Filter in Fridge',
  'filters',
  2, -- Every 2 months
  NOW() - INTERVAL '20 days',
  NOW() + INTERVAL '40 days',
  'pending',
  true,
  'Refrigerator water filter - Samsung model'
FROM properties p WHERE p.address LIKE '%6000%SW%Broadway%'
LIMIT 1;

INSERT INTO maintenance_tasks (property_id, task_name, task_type, frequency_months, last_completed, next_due_date, status, homeowner_editable, contractor_id, notes)
SELECT 
  p.id,
  'Roof Inspection and Repair',
  'roofing',
  12, -- Annual
  NOW() - INTERVAL '8 months',
  NOW() + INTERVAL '4 months',
  'pending',
  false,
  (SELECT id FROM users WHERE company = 'Utility Maintenance Co.' AND role = 'contractor' LIMIT 1),
  'Check for hail damage, loose shingles, and seal any leaks'
FROM properties p WHERE p.address LIKE '%6000%SW%Broadway%'
LIMIT 1;

INSERT INTO maintenance_tasks (property_id, task_name, task_type, frequency_months, last_completed, next_due_date, status, homeowner_editable, contractor_id, notes)
SELECT 
  p.id,
  'Window Replacement',
  'windows',
  24, -- Every 2 years
  NOW() - INTERVAL '18 months',
  NOW() + INTERVAL '6 months',
  'pending',
  false,
  (SELECT id FROM users WHERE company = 'Utility Maintenance Co.' AND role = 'contractor' LIMIT 1),
  'Replace old single-pane windows for better temperature control'
FROM properties p WHERE p.address LIKE '%6000%SW%Broadway%'
LIMIT 1;

INSERT INTO maintenance_tasks (property_id, task_name, task_type, frequency_months, last_completed, next_due_date, status, homeowner_editable, contractor_id, notes)
SELECT 
  p.id,
  'Winterization Check',
  'winterization',
  12, -- Annual
  NOW() - INTERVAL '3 months',
  NOW() + INTERVAL '9 months',
  'pending',
  false,
  (SELECT id FROM users WHERE company = 'Utility Maintenance Co.' AND role = 'contractor' LIMIT 1),
  'Inspect pipes, insulation, and heating system'
FROM properties p WHERE p.address LIKE '%6000%SW%Broadway%'
LIMIT 1;

INSERT INTO maintenance_tasks (property_id, task_name, task_type, frequency_months, last_completed, next_due_date, status, homeowner_editable, contractor_id, notes)
SELECT 
  p.id,
  'Hail Damage Assessment',
  'hail_damage',
  NULL, -- One-time or as needed
  NULL,
  NULL,
  'pending',
  false,
  (SELECT id FROM users WHERE company = 'Utility Maintenance Co.' AND role = 'contractor' LIMIT 1),
  'Recent hail storm - check for roof and siding damage'
FROM properties p WHERE p.address LIKE '%6000%SW%Broadway%'
LIMIT 1;

-- Add property history for 6000 SW Broadway St
INSERT INTO property_history (property_id, action_type, description, date_performed, attachments, performed_by)
SELECT 
  p.id,
  'renovation',
  'Property purchased by Abhijit Paradkar',
  '2022-01-15'::date,
  ARRAY[]::text[],
  'Abhijit Paradkar'
FROM properties p WHERE p.address LIKE '%6000%SW%Broadway%'
LIMIT 1;

INSERT INTO property_history (property_id, action_type, description, date_performed, attachments, performed_by)
SELECT 
  p.id,
  'repair',
  'Annual HVAC system inspection and tune-up',
  (NOW() - INTERVAL '6 months')::date,
  ARRAY[]::text[],
  'Utility Maintenance Co.'
FROM properties p WHERE p.address LIKE '%6000%SW%Broadway%'
LIMIT 1;

INSERT INTO property_history (property_id, action_type, description, date_performed, attachments, performed_by)
SELECT 
  p.id,
  'renovation',
  'Kitchen remodel - new cabinets, countertops, and appliances',
  (NOW() - INTERVAL '2 years')::date,
  ARRAY[]::text[],
  'Richard Jackson'
FROM properties p WHERE p.address LIKE '%6000%SW%Broadway%'
LIMIT 1;

INSERT INTO property_history (property_id, action_type, description, date_performed, attachments, performed_by)
SELECT 
  p.id,
  'inspection',
  'Pre-purchase home inspection - good condition overall',
  '2021-12-10'::date,
  ARRAY[]::text[],
  'Home Inspector Mike'
FROM properties p WHERE p.address LIKE '%6000%SW%Broadway%'
LIMIT 1;

-- Add parts inventory for 6000 SW Broadway St
INSERT INTO parts_inventory (property_id, part_name, part_type, brand, model, quantity, location, condition, notes)
SELECT 
  p.id, 'HVAC Air Filter', 'filter', 'Honeywell', 'FPR5', 2, 'Basement', 'good', 'Standard size filter'
FROM properties p WHERE p.address LIKE '%6000%SW%Broadway%';

INSERT INTO parts_inventory (property_id, part_name, part_type, brand, model, quantity, location, condition, notes)
SELECT 
  p.id, 'Refrigerator Water Filter', 'filter', 'Samsung', 'DA29-00020B', 1, 'Kitchen', 'good', 'Fridge water filter'
FROM properties p WHERE p.address LIKE '%6000%SW%Broadway%';

INSERT INTO parts_inventory (property_id, part_name, part_type, brand, model, quantity, location, condition, notes)
SELECT 
  p.id, 'Paint - Interior Eggshell White', 'paint', 'Sherwin Williams', 'Dover White SW6385', 5, 'Garage', 'good', 'Interior walls'
FROM properties p WHERE p.address LIKE '%6000%SW%Broadway%';

INSERT INTO parts_inventory (property_id, part_name, part_type, brand, model, quantity, location, condition, notes)
SELECT 
  p.id, 'Kitchen Faucet', 'fixture', 'Delta', 'Trinsic', 1, 'Kitchen', 'excellent', 'Touch-activated single-handle faucet'
FROM properties p WHERE p.address LIKE '%6000%SW%Broadway%';

INSERT INTO parts_inventory (property_id, part_name, part_type, brand, model, quantity, location, condition, notes)
SELECT 
  p.id, 'Refrigerator', 'appliance', 'Samsung', 'RF28R7351SG', 1, 'Kitchen', 'excellent', 'French door with ice maker'
FROM properties p WHERE p.address LIKE '%6000%SW%Broadway%';

INSERT INTO parts_inventory (property_id, part_name, part_type, brand, model, quantity, location, condition, notes)
SELECT 
  p.id, 'Double Pane Windows', 'window', 'Andersen', '400 Series', 12, 'Throughout', 'good', 'Energy efficient windows'
FROM properties p WHERE p.address LIKE '%6000%SW%Broadway%';

INSERT INTO parts_inventory (property_id, part_name, part_type, brand, model, quantity, location, condition, notes)
SELECT 
  p.id, 'Front Door', 'door', 'Masonite', 'Deluxia Steel', 1, 'Front Entry', 'excellent', 'Steel entry door with decorative glass'
FROM properties p WHERE p.address LIKE '%6000%SW%Broadway%';

-- Create a utility manager contractor
INSERT INTO users (name, email, password_hash, role, company, contractor_role, approved_by_admin, created_at)
VALUES (
  'James Utility',
  'james.utility@example.com',
  '$2b$10$rHpwZ8VJqFPZf2qQxC.8vODkEkGQxfQvMpHZQFP7QdFJF7ZGJZKYC', -- Password: utility123
  'contractor',
  'Utility Maintenance Co.',
  'Utility Manager',
  true,
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Grant access to 6000 SW Broadway for the utility manager
INSERT INTO access_requests (property_id, contractor_id, owner_id, admin_id, status)
SELECT 
  p.id,
  (SELECT id FROM users WHERE email = 'james.utility@example.com'),
  p.owner_id,
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
  'approved'
FROM properties p WHERE p.address LIKE '%6000%SW%Broadway%'
LIMIT 1;

