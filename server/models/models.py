from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, Float, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from enum import Enum

Base = declarative_base()

class UserRole(str, Enum):
    HOMEOWNER = "homeowner"
    CONTRACTOR = "contractor"
    BUYER = "buyer"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    firebase_uid = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, nullable=False, default=UserRole.BUYER)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    owned_properties = relationship("Property", back_populates="owner")
    submitted_reports = relationship("Report", back_populates="submitter")
    contractor_assignments = relationship("ContractorAssignment", back_populates="contractor")

class Property(Base):
    __tablename__ = "properties"
    
    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    zip_code = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    property_type = Column(String, nullable=False)  # single_family, condo, townhouse, etc.
    year_built = Column(Integer, nullable=True)
    square_feet = Column(Integer, nullable=True)
    bedrooms = Column(Integer, nullable=True)
    bathrooms = Column(Float, nullable=True)
    lot_size = Column(Float, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_verified = Column(Boolean, default=False)
    verification_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="owned_properties")
    reports = relationship("Report", back_populates="property")
    renovations = relationship("Renovation", back_populates="property")
    community_updates = relationship("CommunityUpdate", back_populates="property")

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    submitter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    report_type = Column(String, nullable=False)  # inspection, repair, permit, etc.
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    report_data = Column(JSON, nullable=True)  # Structured data for the report
    attachments = Column(JSON, nullable=True)  # File URLs/paths
    status = Column(String, default="pending")  # pending, approved, rejected
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    property = relationship("Property", back_populates="reports")
    submitter = relationship("User", back_populates="submitted_reports", foreign_keys=[submitter_id])
    reviewer = relationship("User", foreign_keys=[reviewed_by])

class Renovation(Base):
    __tablename__ = "renovations"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    contractor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    renovation_type = Column(String, nullable=False)  # kitchen, bathroom, roof, etc.
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    cost = Column(Float, nullable=True)
    materials = Column(JSON, nullable=True)  # List of materials used
    blueprints = Column(JSON, nullable=True)  # File URLs/paths
    photos = Column(JSON, nullable=True)  # Photo URLs/paths
    status = Column(String, default="in_progress")  # planned, in_progress, completed
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    property = relationship("Property", back_populates="renovations")
    contractor = relationship("User")

class CommunityUpdate(Base):
    __tablename__ = "community_updates"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=True)  # Null for general community updates
    neighborhood_id = Column(String, nullable=True)  # Neighborhood identifier
    update_type = Column(String, nullable=False)  # construction, traffic, school, event, etc.
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    impact_level = Column(String, nullable=False)  # low, medium, high
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    location = Column(JSON, nullable=True)  # GeoJSON or coordinates
    is_verified = Column(Boolean, default=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    property = relationship("Property", back_populates="community_updates")
    creator = relationship("User")

class ContractorAssignment(Base):
    __tablename__ = "contractor_assignments"
    
    id = Column(Integer, primary_key=True, index=True)
    contractor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    assignment_type = Column(String, nullable=False)  # renovation, inspection, repair, etc.
    status = Column(String, default="assigned")  # assigned, in_progress, completed
    assigned_date = Column(DateTime, default=datetime.utcnow)
    completed_date = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    
    # Relationships
    contractor = relationship("User", back_populates="contractor_assignments")
    property = relationship("Property")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False)  # create, update, delete, approve, reject
    resource_type = Column(String, nullable=False)  # property, report, renovation, etc.
    resource_id = Column(Integer, nullable=False)
    old_values = Column(JSON, nullable=True)
    new_values = Column(JSON, nullable=True)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User")
