-- Add comprehensive property details columns
-- Run this on the properties table

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS beds INT,
ADD COLUMN IF NOT EXISTS baths DECIMAL(3,1),
ADD COLUMN IF NOT EXISTS sqft INT,
ADD COLUMN IF NOT EXISTS lot_size DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS school_district TEXT,
ADD COLUMN IF NOT EXISTS fireplaces INT,
ADD COLUMN IF NOT EXISTS levels INT,
ADD COLUMN IF NOT EXISTS rooms INT,
ADD COLUMN IF NOT EXISTS builder_name TEXT,
ADD COLUMN IF NOT EXISTS builder_contact TEXT,
ADD COLUMN IF NOT EXISTS builder_url TEXT,
ADD COLUMN IF NOT EXISTS subdivision TEXT,
ADD COLUMN IF NOT EXISTS google_maps_url TEXT,
ADD COLUMN IF NOT EXISTS poa_fees DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS taxes DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS homeowners_insurance DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS cooking_range_details JSONB,
ADD COLUMN IF NOT EXISTS fireplace_details JSONB,
ADD COLUMN IF NOT EXISTS living_areas JSONB,
ADD COLUMN IF NOT EXISTS floor_coverings JSONB,
ADD COLUMN IF NOT EXISTS additive_items JSONB,
ADD COLUMN IF NOT EXISTS outbuildings_yard JSONB;

-- Add constraints
ALTER TABLE properties 
ADD CONSTRAINT chk_beds CHECK (beds IS NULL OR beds >= 0),
ADD CONSTRAINT chk_baths CHECK (baths IS NULL OR baths >= 0),
ADD CONSTRAINT chk_sqft CHECK (sqft IS NULL OR sqft >= 0),
ADD CONSTRAINT chk_lot_size CHECK (lot_size IS NULL OR lot_size >= 0),
ADD CONSTRAINT chk_fireplaces CHECK (fireplaces IS NULL OR fireplaces >= 0),
ADD CONSTRAINT chk_levels CHECK (levels IS NULL OR levels >= 0),
ADD CONSTRAINT chk_rooms CHECK (rooms IS NULL OR rooms >= 0);

