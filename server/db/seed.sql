-- HomeFax Database Seed Data
-- Mock data for testing and demonstration

-- Insert Admin Keys
INSERT INTO admin_keys (key_value, is_used)
VALUES 
('ADMIN-KEY-2024-001', FALSE),
('ADMIN-KEY-2024-002', FALSE),
('ADMIN-KEY-2024-003', FALSE),
('CITY-MASTER-KEY', FALSE),
('SUPER-ADMIN-2024', FALSE);

-- Insert Users
INSERT INTO users (name, email, password_hash, role, approved_by_admin, company, contractor_role)
VALUES 
('Alice Green', 'alice@homefax.com', '$2b$10$example_hash_1', 'homeowner', TRUE, NULL, NULL),
('Bob Smith', 'bob@contractor.com', '$2b$10$example_hash_2', 'contractor', TRUE, 'Smith Construction', 'General Contractor'),
('Clara Admin', 'clara@city.gov', '$2b$10$example_hash_3', 'admin', TRUE, NULL, NULL),
('David Wilson', 'david@homefax.com', '$2b$10$example_hash_4', 'homeowner', TRUE, NULL, NULL),
('Eva Martinez', 'eva@contractor.com', '$2b$10$example_hash_5', 'contractor', TRUE, 'Martinez Electric', 'Electrician'),
('Frank Johnson', 'frank@city.gov', '$2b$10$example_hash_6', 'admin', TRUE, NULL, NULL),
('Grace Lee', 'grace@homefax.com', '$2b$10$example_hash_7', 'homeowner', FALSE, NULL, NULL),
('Henry Brown', 'henry@contractor.com', '$2b$10$example_hash_8', 'contractor', TRUE, 'Brown Plumbing', 'Plumber'),
('Abhijit Paradkar', 'abhijit@homefax.com', '$2b$10$example_hash_9', 'homeowner', TRUE, NULL, NULL);

-- Insert Properties
INSERT INTO properties (address, owner_id, registration_number, build_year, connected_utilities, zoning, blueprints, photos)
VALUES
('123 Maple St', (SELECT id FROM users WHERE name='Alice Green'), 'REG-1001', 2008, 
 '{"internet": true, "power": "Line-45A", "water": "WL-102", "gas": "GL-56"}', 
 'Residential', ARRAY['/blueprints/maple_2008.pdf'], ARRAY['/photos/maple_front.jpg', '/photos/maple_back.jpg']),

('456 Oak Ave', (SELECT id FROM users WHERE name='David Wilson'), 'REG-1002', 2015,
 '{"internet": true, "power": "Line-45B", "water": "WL-103", "gas": "GL-57"}',
 'Residential', ARRAY['/blueprints/oak_2015.pdf'], ARRAY['/photos/oak_front.jpg']),

('789 Pine Rd', (SELECT id FROM users WHERE name='Grace Lee'), 'REG-1003', 1995,
 '{"internet": false, "power": "Line-45C", "water": "WL-104", "gas": "GL-58"}',
 'Residential', ARRAY['/blueprints/pine_1995.pdf'], ARRAY['/photos/pine_front.jpg']),

('6000 SW Broadway St', (SELECT id FROM users WHERE name='Abhijit Paradkar'), 'REG-1004', 2018,
 '{"internet": true, "power": "Line-46A", "water": "WL-105", "gas": "GL-59"}',
 'Residential', ARRAY['/blueprints/broadway_2018.pdf'], ARRAY['/photos/broadway_front.jpg', '/photos/broadway_back.jpg']);

-- Insert Projects
INSERT INTO projects (property_id, contractor_id, admin_id, type, description, status, percent_complete, attachments)
VALUES 
((SELECT id FROM properties WHERE address='123 Maple St'),
 (SELECT id FROM users WHERE name='Bob Smith'),
 (SELECT id FROM users WHERE name='Clara Admin'),
 'renovation', 'Roof replacement and solar panel install', 'in_progress', 40,
 ARRAY['/attachments/roof_plan.pdf', '/attachments/solar_specs.pdf']),

((SELECT id FROM properties WHERE address='456 Oak Ave'),
 (SELECT id FROM users WHERE name='Eva Martinez'),
 (SELECT id FROM users WHERE name='Frank Johnson'),
 'repair', 'Kitchen plumbing repair and fixture replacement', 'pending', 0,
 ARRAY['/attachments/plumbing_issue.jpg']),

((SELECT id FROM properties WHERE address='789 Pine Rd'),
 (SELECT id FROM users WHERE name='Henry Brown'),
 (SELECT id FROM users WHERE name='Clara Admin'),
 'utility_fix', 'Electrical panel upgrade and safety inspection', 'completed', 100,
 ARRAY['/attachments/electrical_report.pdf', '/attachments/inspection_cert.pdf']);

-- Insert Access Requests
INSERT INTO access_requests (property_id, contractor_id, owner_id, admin_id, status)
VALUES
((SELECT id FROM properties WHERE address='123 Maple St'),
 (SELECT id FROM users WHERE name='Bob Smith'),
 (SELECT id FROM users WHERE name='Alice Green'),
 (SELECT id FROM users WHERE name='Clara Admin'),
 'approved'),

((SELECT id FROM properties WHERE address='456 Oak Ave'),
 (SELECT id FROM users WHERE name='Eva Martinez'),
 (SELECT id FROM users WHERE name='David Wilson'),
 (SELECT id FROM users WHERE name='Frank Johnson'),
 'pending'),

((SELECT id FROM properties WHERE address='789 Pine Rd'),
 (SELECT id FROM users WHERE name='Henry Brown'),
 (SELECT id FROM users WHERE name='Grace Lee'),
 (SELECT id FROM users WHERE name='Clara Admin'),
 'denied');

-- Insert Notices
INSERT INTO notices (title, type, description, affected_properties, contractor_id, status, percent_complete)
VALUES
('Water outage - Maple District', 'water_outage', 'Main water line maintenance scheduled for next week.', 
 ARRAY[(SELECT id FROM properties WHERE address='123 Maple St')],
 (SELECT id FROM users WHERE name='Bob Smith'),
 'active', 0),

('Road construction - Oak Avenue', 'road_block', 'Road resurfacing project will affect traffic for 2 weeks.',
 ARRAY[(SELECT id FROM properties WHERE address='456 Oak Ave')],
 (SELECT id FROM users WHERE name='Eva Martinez'),
 'active', 25),

('Power grid upgrade - Pine Road', 'power_issue', 'Electrical infrastructure upgrade in progress.',
 ARRAY[(SELECT id FROM properties WHERE address='789 Pine Rd')],
 (SELECT id FROM users WHERE name='Henry Brown'),
 'active', 60),

('City-wide maintenance notice', 'general', 'Annual city infrastructure inspection beginning next month.',
 ARRAY[(SELECT id FROM properties WHERE address='123 Maple St'), (SELECT id FROM properties WHERE address='456 Oak Ave')],
 NULL,
 'active', 0);

-- Insert Upkeep Logs
INSERT INTO upkeep_logs (property_id, contractor_id, action, notes, attachments)
VALUES
((SELECT id FROM properties WHERE address='123 Maple St'),
 (SELECT id FROM users WHERE name='Bob Smith'),
 'Roof repair', 'Partial work completed, awaiting inspection.', 
 ARRAY['/attachments/roof_progress.jpg']),

((SELECT id FROM properties WHERE address='456 Oak Ave'),
 (SELECT id FROM users WHERE name='Eva Martinez'),
 'Plumbing inspection', 'Found minor leak in kitchen sink, scheduled repair.',
 ARRAY['/attachments/leak_photo.jpg']),

((SELECT id FROM properties WHERE address='789 Pine Rd'),
 (SELECT id FROM users WHERE name='Henry Brown'),
 'Electrical upgrade', 'Panel replacement completed successfully.',
 ARRAY['/attachments/new_panel.jpg', '/attachments/inspection_report.pdf']),

((SELECT id FROM properties WHERE address='123 Maple St'),
 (SELECT id FROM users WHERE name='Bob Smith'),
 'Solar installation', 'Solar panels installed, awaiting utility connection.',
 ARRAY['/attachments/solar_install.jpg']),

((SELECT id FROM properties WHERE address='6000 SW Broadway St'),
 (SELECT id FROM users WHERE name='Bob Smith'),
 'Annual HVAC maintenance', 'HVAC system serviced and filters replaced. All systems operating efficiently.',
 ARRAY['/attachments/hvac_service_report.pdf']),

((SELECT id FROM properties WHERE address='6000 SW Broadway St'),
 (SELECT id FROM users WHERE name='Eva Martinez'),
 'Plumbing inspection', 'Complete plumbing inspection completed. No issues found. All fixtures in excellent condition.',
 ARRAY['/attachments/plumbing_inspection_2024.pdf']),

((SELECT id FROM properties WHERE address='6000 SW Broadway St'),
 (SELECT id FROM users WHERE name='Henry Brown'),
 'Electrical safety check', 'Annual electrical safety inspection completed. All outlets and circuits tested. No issues found.',
 ARRAY['/attachments/electrical_safety_2024.pdf']);

-- Insert Public Utilities
INSERT INTO public_utilities (name, type, location, status, notes)
VALUES
('Maple District Water Line WL-102', 'water_line', 'Maple Ave', 'operational', 'Scheduled maintenance next month'),
('Oak Avenue Road Surface', 'road', 'Oak Ave', 'maintenance', 'Resurfacing in progress'),
('Pine Road Power Grid', 'power_grid', 'Pine Rd', 'upgrade', 'Infrastructure upgrade completed'),
('Central Park Playground', 'park', 'Central Park', 'operational', 'Regular maintenance schedule'),
('Main Street Gas Line', 'gas_main', 'Main St', 'operational', 'Annual inspection completed');

-- Update some properties with additional data
UPDATE properties 
SET percent_complete = 85, 
    easement_file = '/easements/maple_easement.pdf'
WHERE address = '123 Maple St';

UPDATE properties 
SET percent_complete = 95,
    easement_file = '/easements/oak_easement.pdf'
WHERE address = '456 Oak Ave';

UPDATE properties 
SET percent_complete = 100,
    easement_file = '/easements/pine_easement.pdf'
WHERE address = '789 Pine Rd';

UPDATE properties 
SET percent_complete = 100,
    easement_file = '/easements/broadway_easement.pdf'
WHERE address = '6000 SW Broadway St';
