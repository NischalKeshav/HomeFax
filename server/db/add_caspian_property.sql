-- Add property for Caspian Holstrom and create urgent notification
DO $$
DECLARE
    caspian_user_id UUID;
    caspian_property_id UUID;
    septic_maintenance_id UUID;
BEGIN
    -- Get Caspian Holstrom's user ID
    SELECT id INTO caspian_user_id FROM users WHERE name ILIKE '%Caspian%Holstrom%' LIMIT 1;
    
    IF caspian_user_id IS NULL THEN
        RAISE NOTICE 'Caspian Holstrom not found in users table';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found Caspian Holstrom with ID: %', caspian_user_id;
    
    -- Insert new property for Caspian (old country house) worth $50k
    INSERT INTO properties (
        address, 
        owner_id, 
        registration_number, 
        build_year, 
        property_type,
        property_category,
        property_value,
        connected_utilities, 
        zoning, 
        status
    ) VALUES (
        'Rural Route 5, Countryside Estate, Bentonville AR 72713',
        caspian_user_id,
        'REG-HOLSTROM-COUNTRY-001',
        1975,
        'primary',
        'residential',
        50000,
        '{"septic": true, "power": "RR-Power-12", "well": true}',
        'Rural',
        'active'
    ) RETURNING id INTO caspian_property_id;
    
    RAISE NOTICE 'Created property with ID: %', caspian_property_id;
    
    -- Create urgent notification about septic tank (using notices table schema)
    INSERT INTO notices (
        title,
        type,
        description,
        affected_properties
    ) VALUES (
        'Septic Tank Replacement Required',
        'general',
        'The septic tank at your old country house is in need of replacement',
        ARRAY[caspian_property_id]
    );
    
    RAISE NOTICE 'Created notification for Caspian';
    
    -- Create high priority maintenance task for septic replacement
    INSERT INTO maintenance_tasks (
        property_id,
        task_name,
        task_type,
        status,
        notes,
        homeowner_editable,
        next_due_date
    ) VALUES (
        caspian_property_id,
        'Septic Tank Replacement - URGENT',
        'general',
        'pending',
        'URGENT: Complete septic tank replacement required. The current system is failing and poses health and environmental risks. Contact licensed installer immediately.',
        FALSE,
        NOW() + INTERVAL '14 days'
    ) RETURNING id INTO septic_maintenance_id;
    
    RAISE NOTICE 'Created maintenance task with ID: %', septic_maintenance_id;
    
    RAISE NOTICE 'Successfully added Caspian Holstrom property, notification, and maintenance task';
END $$;
