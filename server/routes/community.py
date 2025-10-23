from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import CommunityUpdate, User
from utils.auth import get_current_user
from utils.permissions import require_role
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# Pydantic models
class CommunityUpdateResponse(BaseModel):
    id: int
    property_id: Optional[int]
    neighborhood_id: Optional[str]
    update_type: str
    title: str
    description: Optional[str]
    impact_level: str
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    location: Optional[dict]
    is_verified: bool
    created_by: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class CommunityUpdateCreate(BaseModel):
    property_id: Optional[int] = None
    neighborhood_id: Optional[str] = None
    update_type: str
    title: str
    description: Optional[str] = None
    impact_level: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    location: Optional[dict] = None

# Mock data
MOCK_COMMUNITY_UPDATES = [
    {
        "id": 1,
        "property_id": None,
        "neighborhood_id": "sf_downtown",
        "update_type": "construction",
        "title": "New Office Building Construction",
        "description": "Large office building construction project starting next month",
        "impact_level": "high",
        "start_date": "2024-03-01T00:00:00",
        "end_date": "2024-12-31T00:00:00",
        "location": {
            "type": "Point",
            "coordinates": [-122.4194, 37.7749]
        },
        "is_verified": True,
        "created_by": 4,
        "created_at": "2024-01-15T00:00:00"
    },
    {
        "id": 2,
        "property_id": None,
        "neighborhood_id": "sf_downtown",
        "update_type": "traffic",
        "title": "Road Closure on Main Street",
        "description": "Main Street will be closed for utility work",
        "impact_level": "medium",
        "start_date": "2024-02-15T00:00:00",
        "end_date": "2024-02-20T00:00:00",
        "location": {
            "type": "LineString",
            "coordinates": [[-122.4194, 37.7749], [-122.4184, 37.7759]]
        },
        "is_verified": True,
        "created_by": 4,
        "created_at": "2024-01-20T00:00:00"
    },
    {
        "id": 3,
        "property_id": None,
        "neighborhood_id": "sf_downtown",
        "update_type": "school",
        "title": "New Elementary School Opening",
        "description": "New elementary school opening in the neighborhood",
        "impact_level": "low",
        "start_date": "2024-09-01T00:00:00",
        "end_date": None,
        "location": {
            "type": "Point",
            "coordinates": [-122.4094, 37.7849]
        },
        "is_verified": False,
        "created_by": 1,
        "created_at": "2024-02-01T00:00:00"
    }
]

@router.get("/", response_model=List[CommunityUpdateResponse])
async def get_community_updates(
    skip: int = 0,
    limit: int = 100,
    neighborhood_id: Optional[str] = None,
    update_type: Optional[str] = None,
    impact_level: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get community updates with optional filtering"""
    updates = MOCK_COMMUNITY_UPDATES[skip:skip+limit]
    
    # Apply filters
    if neighborhood_id:
        updates = [u for u in updates if u["neighborhood_id"] == neighborhood_id]
    if update_type:
        updates = [u for u in updates if u["update_type"] == update_type]
    if impact_level:
        updates = [u for u in updates if u["impact_level"] == impact_level]
    
    return updates

@router.get("/{update_id}", response_model=CommunityUpdateResponse)
async def get_community_update(
    update_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific community update by ID"""
    update = next((u for u in MOCK_COMMUNITY_UPDATES if u["id"] == update_id), None)
    if not update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Community update not found"
        )
    return update

@router.post("/", response_model=CommunityUpdateResponse)
async def create_community_update(
    update_data: CommunityUpdateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new community update"""
    new_update = {
        "id": len(MOCK_COMMUNITY_UPDATES) + 1,
        "created_by": current_user.id,
        **update_data.dict(),
        "is_verified": current_user.role == "admin",
        "created_at": datetime.utcnow().isoformat()
    }
    MOCK_COMMUNITY_UPDATES.append(new_update)
    return new_update

@router.put("/{update_id}", response_model=CommunityUpdateResponse)
async def update_community_update(
    update_id: int,
    update_data: CommunityUpdateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a community update"""
    update_index = next((i for i, u in enumerate(MOCK_COMMUNITY_UPDATES) if u["id"] == update_id), None)
    if update_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Community update not found"
        )
    
    # Check permissions
    update = MOCK_COMMUNITY_UPDATES[update_index]
    if current_user.role != "admin" and update["created_by"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this community update"
        )
    
    # Update the community update
    update_dict = update_data.dict(exclude_unset=True)
    MOCK_COMMUNITY_UPDATES[update_index].update(update_dict)
    
    return MOCK_COMMUNITY_UPDATES[update_index]

@router.delete("/{update_id}")
async def delete_community_update(
    update_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """Delete a community update (admin only)"""
    update_index = next((i for i, u in enumerate(MOCK_COMMUNITY_UPDATES) if u["id"] == update_id), None)
    if update_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Community update not found"
        )
    
    MOCK_COMMUNITY_UPDATES.pop(update_index)
    return {"message": "Community update deleted successfully"}
