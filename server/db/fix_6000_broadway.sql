-- Fix 6000 SW Broadway with correct owner and build year
UPDATE properties
SET 
    build_year = 2017,
    percent_complete = 100,
    -- Use actual property value from database
    total_appraised_value = property_value,
    total_assessed_value = property_value * 0.20,
    taxable_value = property_value * 0.166,
    estimated_taxes = property_value * 0.0102,
    -- Set correct owner (Abhijit Paradkar)
    mailing_address = '6000 SW Broadway St, Bentonville AR 72713',
    -- Remove Shah/Supekar from sales history - keep it blank or minimal
    sales_history = NULL
WHERE address ILIKE '%6000%SW%Broadway%';

-- Update all properties to set percent_complete to 100 if they have a build year
UPDATE properties
SET percent_complete = 100
WHERE build_year IS NOT NULL AND build_year < EXTRACT(YEAR FROM NOW());

