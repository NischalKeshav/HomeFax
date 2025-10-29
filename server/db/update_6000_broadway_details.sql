-- Update 6000 SW Broadway property with comprehensive details
DO $$
DECLARE
    property_uuid UUID;
BEGIN
    -- Find the property
    SELECT id INTO property_uuid FROM properties WHERE address ILIKE '%6000%Broadway%' LIMIT 1;
    
    IF property_uuid IS NULL THEN
        RAISE NOTICE 'Property not found';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found property with ID: %', property_uuid;
    
    -- Update with comprehensive details based on the Residential Improvements data
    UPDATE properties
    SET 
        beds = 3,
        baths = 2.0,
        sqft = 1711,
        lot_size = 0.25,
        school_district = 'Bentonville School District',
        fireplaces = 0,
        levels = 1,
        rooms = 7,
        builder_name = 'Paradkar Builders',
        builder_contact = 'builder@paradkar.com',
        builder_url = 'https://paradkarbuilders.com',
        subdivision = 'SW Broadway Estates',
        google_maps_url = 'https://maps.google.com/?q=6000+SW+Broadway+St+Bentonville+AR',
        poa_fees = 150.00,
        taxes = 3200.00,
        homeowners_insurance = 1800.00,
        
        -- Cooking range details
        cooking_range_details = '{"brand": "GE", "model": "Profile Series", "type": "Gas", "year": 2018}'::jsonb,
        
        -- Fireplace details (none)
        fireplace_details = '[]'::jsonb,
        
        -- Living areas
        living_areas = '{
            "1st_floor": 1711,
            "2nd_floor": 0,
            "basement_unfinished": 0,
            "basement_finished_partitions": 0,
            "basement_finished_no_partitions": 0,
            "living_area_total": 1711,
            "basement_total": 0,
            "occupancy_type": "Single Family",
            "grade": "D4+10",
            "story_height": "1 Story",
            "construction_type": "Masonry",
            "roof_type": "Fiberglass",
            "heat_ac": "Central",
            "foundation_type": "Slab",
            "floor_type": "Elevated Slab"
        }'::jsonb,
        
        -- Floor coverings
        floor_coverings = '{
            "carpet": {"sqft": 856},
            "hardwood_sheath": {"sqft": 513},
            "ceramic": {"sqft": 342}
        }'::jsonb,
        
        -- Additive items (Carport/Driveway/Workshop, Open Porch, Master Fire Alarm)
        additive_items = '[
            {"code": "CDW", "description": "Carport/Driveway/Workshop", "quantity": 672, "size": "42 x 16"},
            {"code": "OP", "description": "Open Porch", "quantity": 70, "size": "5 x 14"},
            {"code": "MFA", "description": "Master Fire Alarm", "quantity": 420, "size": "20 x 21"},
            {"code": "OP", "description": "Open Porch", "quantity": 200, "size": "10 x 20"}
        ]'::jsonb,
        
        -- Outbuildings / Yard Improvements (Workshop/Fence/Extra Storage)
        outbuildings_yard = '[
            {"code": "WFX6", "description": "Workshop/Fence/Extra Storage", "quantity": 164}
        ]'::jsonb,
        
        -- Update zoning to show "Residential Zoning Map" instead of underscores
        zoning = 'Residential Zoning Map'
    
    WHERE id = property_uuid;
    
    RAISE NOTICE 'Successfully updated property with comprehensive details';
END $$;

