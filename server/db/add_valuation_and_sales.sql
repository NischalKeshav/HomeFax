-- Add property valuation, sales history, and parcel details columns
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS land_value DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS improvements_value DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS total_appraised_value DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS total_assessed_value DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS taxable_value DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS millage_rate DECIMAL(10,6),
ADD COLUMN IF NOT EXISTS estimated_taxes DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS assessment_year INT,
ADD COLUMN IF NOT EXISTS sales_history JSONB,
ADD COLUMN IF NOT EXISTS parcel_number TEXT,
ADD COLUMN IF NOT EXISTS county_name TEXT,
ADD COLUMN IF NOT EXISTS mailing_address TEXT,
ADD COLUMN IF NOT EXISTS collectors_address TEXT,
ADD COLUMN IF NOT EXISTS total_acres DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS timber_acres DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS sec_twp_rng TEXT,
ADD COLUMN IF NOT EXISTS lot_block TEXT,
ADD COLUMN IF NOT EXISTS legal_description TEXT,
ADD COLUMN IF NOT EXISTS homestead_parcel BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS over_65 BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_for_rent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_for_sale BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS rent_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS sale_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS listing_date DATE,
ADD COLUMN IF NOT EXISTS land_division_details JSONB;

-- Update 6000 SW Broadway with comprehensive parcel data
UPDATE properties
SET 
    -- Valuation and Assessment
    land_value = 78000,
    improvements_value = 224715,
    total_appraised_value = 302715,
    total_assessed_value = 60543,
    taxable_value = 50150,
    millage_rate = 0.06152,
    estimated_taxes = 3085.23,
    assessment_year = 2025,
    
    -- Sales History
    sales_history = '[
        {"filed": "2022-05-20", "sold": "2022-03-15", "price": 0, "grantor": "SHAH, ABHINAV", "grantee": "SUPEKAR, DEVAYANI", "book": "L2022", "page": 33870, "deed_type": "QCD"},
        {"filed": "2019-03-29", "sold": "2019-03-27", "price": 181000, "grantor": "KINLOCH PARTNERS IV LLC", "grantee": "SUPEKAR, DEVAYANI & SHAH, ABHINAV", "book": "L2019", "page": 14362, "deed_type": "WD"},
        {"filed": "2018-11-13", "sold": "2018-11-09", "price": 0, "grantor": "KINLOCH REAL ESTATE PARTNERS LLC", "grantee": "KINLOCH PARTNERS IV LLC", "book": "L2018", "page": 59292, "deed_type": "WD"},
        {"filed": "2018-08-31", "sold": "2018-08-30", "price": 169000, "grantor": "RCPV LLC", "grantee": "KINLOCH REAL ESTATE PARTNERS LLC", "book": "L2018", "page": 46227, "deed_type": "WD"},
        {"filed": "2017-02-16", "sold": "2017-02-15", "price": 0, "grantor": "PROVIDENCE 2016 LLC", "grantee": "RCPV LLC (77PC)", "book": "2017", "page": 8301, "deed_type": "WD"}
    ]'::jsonb,
    
    -- Parcel Details
    parcel_number = '01-17914-000',
    county_name = 'Benton County',
    mailing_address = '3607 SW MISTLETOE AVE, BENTONVILLE AR 72713',
    collectors_address = 'LERETA LLC, 901 CORPORATE CENTER DRIVE, POMONA, CA 91768',
    total_acres = 0.19,
    timber_acres = 0.00,
    sec_twp_rng = '22-19-31',
    lot_block = '77/',
    subdivision = 'PROVIDENCE VILLAGE-BENTONVILLE',
    legal_description = 'PLAT 1/12/2017 2017/20 THRU 26',
    homestead_parcel = FALSE,
    over_65 = FALSE,
    
    -- Land Division Details
    land_division_details = '{
        "land_type": "RES",
        "quantity": "0.19 acres",
        "sqft": 8276,
        "front_width": null,
        "rear_width": null,
        "depth_1": null,
        "depth_2": null,
        "quarter": null
    }'::jsonb

WHERE address ILIKE '%6000%Broadway%' OR address ILIKE '%broadway%';

-- Update mailing address for the property itself
UPDATE properties
SET address = '6000 SW Broadway St, Bentonville AR 72713'
WHERE address ILIKE '%6000%Broadway%' OR address ILIKE '%broadway%';

