-- Populate comprehensive data for all existing properties

-- Update all properties with basic information if missing
UPDATE properties
SET 
    parcel_number = COALESCE(parcel_number, 'TBD-' || substr(id::text, 1, 8)),
    county_name = COALESCE(county_name, 'Benton County'),
    school_district = COALESCE(school_district, 'Bentonville School District'),
    subdivision = COALESCE(subdivision, 'SW Broadway Estates')
WHERE parcel_number IS NULL OR county_name IS NULL;

-- Add sample data to properties that don't have it
UPDATE properties
SET 
    land_value = COALESCE(land_value, CASE WHEN property_value > 500000 THEN 150000 ELSE 75000 END),
    improvements_value = COALESCE(improvements_value, CASE WHEN property_value > 500000 THEN property_value * 0.75 ELSE property_value * 0.65 END),
    total_appraised_value = COALESCE(total_appraised_value, property_value),
    total_assessed_value = COALESCE(total_assessed_value, property_value * 0.20),
    taxable_value = COALESCE(taxable_value, property_value * 0.166),
    millage_rate = COALESCE(millage_rate, 0.06152),
    estimated_taxes = COALESCE(estimated_taxes, property_value * 0.0102),
    assessment_year = COALESCE(assessment_year, 2025),
    beds = COALESCE(beds, CASE WHEN property_value > 500000 THEN 4 ELSE 2 END),
    baths = COALESCE(baths, CASE WHEN property_value > 500000 THEN 3.0 ELSE 1.5 END),
    sqft = COALESCE(sqft, CASE WHEN property_value > 500000 THEN 2200 ELSE 1200 END),
    lot_size = COALESCE(lot_size, CASE WHEN property_value > 500000 THEN 0.25 ELSE 0.15 END),
    levels = COALESCE(levels, CASE WHEN property_value > 500000 THEN 2 ELSE 1 END),
    rooms = COALESCE(rooms, CASE WHEN property_value > 500000 THEN 8 ELSE 5 END),
    fireplaces = COALESCE(fireplaces, CASE WHEN property_value > 500000 THEN 1 ELSE 0 END),
    poa_fees = COALESCE(poa_fees, 150.00),
    taxes = COALESCE(taxes, estimated_taxes),
    homeowners_insurance = COALESCE(homeowners_insurance, property_value * 0.006),
    google_maps_url = COALESCE(google_maps_url, 'https://maps.google.com/?q=' || replace(address, ' ', '+'))
WHERE beds IS NULL OR land_value IS NULL;

-- Add builder information for properties without it
UPDATE properties
SET 
    builder_name = COALESCE(builder_name, 'Paradkar Builders'),
    builder_contact = COALESCE(builder_contact, 'builder@paradkar.com'),
    builder_url = COALESCE(builder_url, 'https://paradkarbuilders.com')
WHERE builder_name IS NULL;

