from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User, Property, Report, Renovation, CommunityUpdate, ContractorAssignment, AuditLog
from datetime import datetime
import json

def create_sample_data():
    """Create sample data for development and testing"""
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Create sample users
        users = [
            User(
                email="homeowner@example.com",
                firebase_uid="firebase_uid_1",
                role="homeowner",
                first_name="John",
                last_name="Doe",
                phone="+1234567890",
                is_active=True
            ),
            User(
                email="contractor@example.com",
                firebase_uid="firebase_uid_2",
                role="contractor",
                first_name="Jane",
                last_name="Smith",
                phone="+1234567891",
                is_active=True
            ),
            User(
                email="buyer@example.com",
                firebase_uid="firebase_uid_3",
                role="buyer",
                first_name="Bob",
                last_name="Johnson",
                phone="+1234567892",
                is_active=True
            ),
            User(
                email="admin@example.com",
                firebase_uid="firebase_uid_4",
                role="admin",
                first_name="Alice",
                last_name="Admin",
                phone="+1234567893",
                is_active=True
            )
        ]
        
        for user in users:
            db.add(user)
        db.commit()
        
        # Create sample properties
        properties = [
            Property(
                address="123 Main St",
                city="San Francisco",
                state="CA",
                zip_code="94102",
                latitude=37.7749,
                longitude=-122.4194,
                property_type="single_family",
                year_built=1950,
                square_feet=2500,
                bedrooms=3,
                bathrooms=2.5,
                lot_size=0.25,
                owner_id=1,
                is_verified=True,
                verification_date=datetime(2024, 1, 15)
            ),
            Property(
                address="456 Oak Ave",
                city="San Francisco",
                state="CA",
                zip_code="94103",
                latitude=37.7849,
                longitude=-122.4094,
                property_type="condo",
                year_built=1985,
                square_feet=1200,
                bedrooms=2,
                bathrooms=2.0,
                lot_size=0.1,
                owner_id=None,
                is_verified=False
            ),
            Property(
                address="789 Pine St",
                city="San Francisco",
                state="CA",
                zip_code="94104",
                latitude=37.7949,
                longitude=-122.3994,
                property_type="townhouse",
                year_built=1995,
                square_feet=1800,
                bedrooms=3,
                bathrooms=2.0,
                lot_size=0.15,
                owner_id=1,
                is_verified=True,
                verification_date=datetime(2024, 2, 1)
            )
        ]
        
        for property in properties:
            db.add(property)
        db.commit()
        
        # Create sample reports
        reports = [
            Report(
                property_id=1,
                submitter_id=1,
                report_type="inspection",
                title="Annual Home Inspection",
                description="Comprehensive inspection of all major systems",
                report_data={
                    "electrical": "Good",
                    "plumbing": "Good",
                    "hvac": "Needs maintenance",
                    "roof": "Good"
                },
                attachments=["inspection_report.pdf", "photos.zip"],
                status="approved",
                reviewed_by=4,
                reviewed_at=datetime(2024, 1, 20)
            ),
            Report(
                property_id=1,
                submitter_id=2,
                report_type="repair",
                title="Kitchen Renovation",
                description="Complete kitchen remodel with new appliances",
                report_data={
                    "cost": 25000,
                    "duration": "6 weeks",
                    "contractor": "ABC Construction"
                },
                attachments=["before_photos.zip", "after_photos.zip", "receipts.pdf"],
                status="pending"
            )
        ]
        
        for report in reports:
            db.add(report)
        db.commit()
        
        # Create sample renovations
        renovations = [
            Renovation(
                property_id=1,
                contractor_id=2,
                title="Kitchen Renovation",
                description="Complete kitchen remodel with new appliances",
                renovation_type="kitchen",
                start_date=datetime(2024, 1, 15),
                end_date=datetime(2024, 2, 28),
                cost=25000.0,
                materials={
                    "cabinets": "Custom oak cabinets",
                    "countertops": "Quartz countertops",
                    "appliances": "Stainless steel appliances"
                },
                blueprints=["kitchen_layout.pdf", "electrical_plan.pdf"],
                photos=["before_photos.zip", "progress_photos.zip", "after_photos.zip"],
                status="completed",
                is_verified=True
            ),
            Renovation(
                property_id=2,
                contractor_id=2,
                title="Bathroom Remodel",
                description="Master bathroom renovation",
                renovation_type="bathroom",
                start_date=datetime(2024, 2, 1),
                cost=15000.0,
                materials={
                    "tile": "Ceramic tile",
                    "fixtures": "Modern fixtures",
                    "vanity": "Custom vanity"
                },
                blueprints=["bathroom_layout.pdf"],
                photos=["before_photos.zip"],
                status="in_progress",
                is_verified=False
            )
        ]
        
        for renovation in renovations:
            db.add(renovation)
        db.commit()
        
        # Create sample community updates
        community_updates = [
            CommunityUpdate(
                property_id=None,
                neighborhood_id="sf_downtown",
                update_type="construction",
                title="New Office Building Construction",
                description="Large office building construction project starting next month",
                impact_level="high",
                start_date=datetime(2024, 3, 1),
                end_date=datetime(2024, 12, 31),
                location={
                    "type": "Point",
                    "coordinates": [-122.4194, 37.7749]
                },
                is_verified=True,
                created_by=4
            ),
            CommunityUpdate(
                property_id=None,
                neighborhood_id="sf_downtown",
                update_type="traffic",
                title="Road Closure on Main Street",
                description="Main Street will be closed for utility work",
                impact_level="medium",
                start_date=datetime(2024, 2, 15),
                end_date=datetime(2024, 2, 20),
                location={
                    "type": "LineString",
                    "coordinates": [[-122.4194, 37.7749], [-122.4184, 37.7759]]
                },
                is_verified=True,
                created_by=4
            )
        ]
        
        for update in community_updates:
            db.add(update)
        db.commit()
        
        # Create sample contractor assignments
        assignments = [
            ContractorAssignment(
                contractor_id=2,
                property_id=1,
                assignment_type="renovation",
                status="completed",
                assigned_date=datetime(2024, 1, 1),
                completed_date=datetime(2024, 2, 28),
                notes="Kitchen renovation completed successfully"
            ),
            ContractorAssignment(
                contractor_id=2,
                property_id=2,
                assignment_type="renovation",
                status="in_progress",
                assigned_date=datetime(2024, 1, 15),
                notes="Bathroom renovation in progress"
            )
        ]
        
        for assignment in assignments:
            db.add(assignment)
        db.commit()
        
        print("Sample data created successfully!")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data()
