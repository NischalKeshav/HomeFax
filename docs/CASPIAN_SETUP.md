# Caspian Holstrom Property Setup

## What Was Added

I've created a SQL script that adds:

1. **New Property** for Caspian Holstrom:
   - Address: "Rural Route 5, Countryside Estate, Bentonville AR 72713"
   - Value: $50,000
   - Type: Residential
   - Year: 1975
   - Connected Utilities: Septic system, power, well

2. **Urgent Notification**:
   - Title: "Septic Tank Replacement Required"
   - Message: "The septic tank at your old country house is in need of replacement"
   - Priority: Urgent (indicated in maintenance task)

3. **High Priority Maintenance Task**:
   - Task: "Septic Tank Replacement - URGENT"
   - Status: Pending
   - Due: 14 days from creation
   - Notes: Complete replacement required due to system failure

## To Execute the SQL Script

If you have PostgreSQL installed and psql in your PATH:

```bash
cd server/db
psql -U arjunparadkar -d homefax -f add_caspian_property.sql
```

Or manually connect to your database and run the SQL:

```bash
psql -U arjunparadkar -d homefax
```

Then paste the contents of `add_caspian_property.sql`.

## What You'll See

When Caspian Holstrom logs into his homeowner dashboard:
- A new property showing "Rural Route 5, Countryside Estate"
- An urgent notification about the septic tank
- A high-priority maintenance task on the property page
- The property value showing $50,000

The maintenance task will show on the property details page with urgent priority styling.

