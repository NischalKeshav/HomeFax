-- Add maintenance system tables to existing database

-- 8. Maintenance Tasks Table
CREATE TABLE IF NOT EXISTS maintenance_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  task_type TEXT CHECK (task_type IN ('roofing', 'hail_damage', 'windows', 'filters', 'winterization', 'general')) NOT NULL,
  frequency_months INT, -- How often in months (e.g., 3 = every 3 months)
  last_completed TIMESTAMP,
  next_due_date TIMESTAMP,
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed
  homeowner_editable BOOLEAN DEFAULT FALSE, -- Can homeowner update this themselves?
  contractor_id UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 9. Property History Table
CREATE TABLE IF NOT EXISTS property_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  event_type TEXT CHECK (event_type IN ('ownership_change', 'renovation', 'maintenance', 'damage', 'inspection', 'repair')) NOT NULL,
  description TEXT NOT NULL,
  contractor_id UUID REFERENCES users(id),
  homeowner_id UUID REFERENCES users(id),
  event_date TIMESTAMP DEFAULT NOW(),
  attachments TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- 10. Parts Inventory Table
CREATE TABLE IF NOT EXISTS parts_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  part_name TEXT NOT NULL,
  part_type TEXT, -- e.g., "paint", "fixture", "appliance", "window", "door"
  manufacturer TEXT,
  model_number TEXT,
  purchase_date DATE,
  warranty_until DATE,
  quantity INT DEFAULT 1,
  location TEXT, -- e.g., "Kitchen", "Living Room", "Exterior"
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_property_id ON maintenance_tasks(property_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_status ON maintenance_tasks(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_next_due_date ON maintenance_tasks(next_due_date);
CREATE INDEX IF NOT EXISTS idx_property_history_property_id ON property_history(property_id);
CREATE INDEX IF NOT EXISTS idx_property_history_event_date ON property_history(event_date);
CREATE INDEX IF NOT EXISTS idx_parts_inventory_property_id ON parts_inventory(property_id);

