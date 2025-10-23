from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import Property, User, Report, Renovation, CommunityUpdate
from utils.auth import get_current_user
from utils.permissions import require_role
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# Pydantic models for request/response
class PropertyResponse(BaseModel):
    id: int
    address: str
    city: str
    state: str
    zip_code: str
    latitude: Optional[float]
    longitude: Optional[float]
    property_type: str
    year_built: Optional[int]
    square_feet: Optional[int]
    bedrooms: Optional[int]
    bathrooms: Optional[float]
    lot_size: Optional[float]
    is_verified: bool
    verification_date: Optional[datetime]
    
    class Config:
        from_attributes = True

class PropertyCreate(BaseModel):
    address: str
    city: str
    state: str
    zip_code: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    property_type: str
    year_built: Optional[int] = None
    square_feet: Optional[int] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[float] = None
    lot_size: Optional[float] = None

class PropertyUpdate(BaseModel):
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    property_type: Optional[str] = None
    year_built: Optional[int] = None
    square_feet: Optional[int] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[float] = None
    lot_size: Optional[float] = None

# Mock data for development
MOCK_PROPERTIES = [
    {
        "id": 1,
        "address": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "zip_code": "94102",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "property_type": "single_family",
        "year_built": 1950,
        "square_feet": 2500,
        "bedrooms": 3,
        "bathrooms": 2.5,
        "lot_size": 0.25,
        "is_verified": True,
        "verification_date": "2024-01-15T00:00:00"
    },
    {
        "id": 2,
        "address": "456 Oak Ave",
        "city": "San Francisco",
        "state": "CA",
        "zip_code": "94103",
        "latitude": 37.7849,
        "longitude": -122.4094,
        "property_type": "condo",
        "year_built": 1985,
        "square_feet": 1200,
        "bedrooms": 2,
        "bathrooms": 2.0,
        "lot_size": 0.1,
        "is_verified": False,
        "verification_date": None
    },
    {
        "id": 3,
        "address": "789 Pine St",
        "city": "San Francisco",
        "state": "CA",
        "zip_code": "94104",
        "latitude": 37.7949,
        "longitude": -122.3994,
        "property_type": "townhouse",
        "year_built": 1995,
        "square_feet": 1800,
        "bedrooms": 3,
        "bathrooms": 2.0,
        "lot_size": 0.15,
        "is_verified": True,
        "verification_date": "2024-02-01T00:00:00"
    }
]

@router.get("/", response_model=List[PropertyResponse])
async def get_properties(
    skip: int = 0,
    limit: int = 100,
    city: Optional[str] = None,
    property_type: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all properties with optional filtering"""
    # For now, return mock data
    properties = MOCK_PROPERTIES[skip:skip+limit]
    
    # Apply filters
    if city:
        properties = [p for p in properties if p["city"].lower() == city.lower()]
    if property_type:
        properties = [p for p in properties if p["property_type"] == property_type]
    
    return properties

@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property(
    property_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific property by ID"""
    # For now, return mock data
    property_data = next((p for p in MOCK_PROPERTIES if p["id"] == property_id), None)
    if not property_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    return property_data

@router.post("/", response_model=PropertyResponse)
async def create_property(
    property_data: PropertyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "homeowner"]))
):
    """Create a new property (admin or homeowner only)"""
    # Mock implementation
    new_property = {
        "id": len(MOCK_PROPERTIES) + 1,
        **property_data.dict(),
        "is_verified": False,
        "verification_date": None
    }
    MOCK_PROPERTIES.append(new_property)
    return new_property

@router.put("/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: int,
    property_data: PropertyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "homeowner"]))
):
    """Update a property (admin or homeowner only)"""
    # Mock implementation
    property_index = next((i for i, p in enumerate(MOCK_PROPERTIES) if p["id"] == property_id), None)
    if property_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    # Update the property
    update_data = property_data.dict(exclude_unset=True)
    MOCK_PROPERTIES[property_index].update(update_data)
    
    return MOCK_PROPERTIES[property_index]

@router.delete("/{property_id}")
async def delete_property(
    property_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """Delete a property (admin only)"""
    # Mock implementation
    property_index = next((i for i, p in enumerate(MOCK_PROPERTIES) if p["id"] == property_id), None)
    if property_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    MOCK_PROPERTIES.pop(property_index)
    return {"message": "Property deleted successfully"}

@router.post("/{property_id}/claim")
async def claim_property(
    property_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["homeowner"]))
):
    """Claim ownership of a property (homeowner only)"""
    # Mock implementation
    property_data = next((p for p in MOCK_PROPERTIES if p["id"] == property_id), None)
    if not property_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    # In real implementation, this would update the database
    return {"message": f"Property {property_id} claimed successfully by {current_user.email}"}
