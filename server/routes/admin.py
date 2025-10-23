from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import User, Report, CommunityUpdate
from utils.auth import get_current_user
from utils.permissions import require_role
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# Pydantic models
class PendingReportResponse(BaseModel):
    id: int
    property_id: int
    submitter_id: int
    report_type: str
    title: str
    description: Optional[str]
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class PendingUpdateResponse(BaseModel):
    id: int
    property_id: Optional[int]
    neighborhood_id: Optional[str]
    update_type: str
    title: str
    description: Optional[str]
    impact_level: str
    is_verified: bool
    created_by: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class AdminStatsResponse(BaseModel):
    total_properties: int
    total_reports: int
    pending_reports: int
    total_users: int
    verified_properties: int
    community_updates: int

# Mock data
MOCK_PENDING_REPORTS = [
    {
        "id": 2,
        "property_id": 1,
        "submitter_id": 2,
        "report_type": "repair",
        "title": "Kitchen Renovation",
        "description": "Complete kitchen remodel with new appliances",
        "status": "pending",
        "created_at": "2024-02-01T00:00:00"
    },
    {
        "id": 4,
        "property_id": 2,
        "submitter_id": 3,
        "report_type": "inspection",
        "title": "Pre-purchase Inspection",
        "description": "Comprehensive inspection before purchase",
        "status": "pending",
        "created_at": "2024-02-05T00:00:00"
    }
]

MOCK_PENDING_UPDATES = [
    {
        "id": 3,
        "property_id": None,
        "neighborhood_id": "sf_downtown",
        "update_type": "school",
        "title": "New Elementary School Opening",
        "description": "New elementary school opening in the neighborhood",
        "impact_level": "low",
        "is_verified": False,
        "created_by": 1,
        "created_at": "2024-02-01T00:00:00"
    }
]

@router.get("/pending-reports", response_model=List[PendingReportResponse])
async def get_pending_reports(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """Get all pending reports for admin review"""
    return MOCK_PENDING_REPORTS[skip:skip+limit]

@router.get("/pending-updates", response_model=List[PendingUpdateResponse])
async def get_pending_updates(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """Get all pending community updates for admin review"""
    return MOCK_PENDING_UPDATES[skip:skip+limit]

@router.get("/stats", response_model=AdminStatsResponse)
async def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """Get admin dashboard statistics"""
    return {
        "total_properties": 3,
        "total_reports": 2,
        "pending_reports": 2,
        "total_users": 4,
        "verified_properties": 2,
        "community_updates": 3
    }

@router.patch("/approve-report/{report_id}")
async def approve_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """Approve a pending report"""
    report_index = next((i for i, r in enumerate(MOCK_PENDING_REPORTS) if r["id"] == report_id), None)
    if report_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Remove from pending and mark as approved
    MOCK_PENDING_REPORTS.pop(report_index)
    
    return {"message": f"Report {report_id} approved successfully"}

@router.patch("/reject-report/{report_id}")
async def reject_report(
    report_id: int,
    reason: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """Reject a pending report"""
    report_index = next((i for i, r in enumerate(MOCK_PENDING_REPORTS) if r["id"] == report_id), None)
    if report_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Remove from pending
    MOCK_PENDING_REPORTS.pop(report_index)
    
    return {"message": f"Report {report_id} rejected successfully"}

@router.patch("/approve-update/{update_id}")
async def approve_update(
    update_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """Approve a pending community update"""
    update_index = next((i for i, u in enumerate(MOCK_PENDING_UPDATES) if u["id"] == update_id), None)
    if update_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Community update not found"
        )
    
    # Remove from pending and mark as verified
    MOCK_PENDING_UPDATES.pop(update_index)
    
    return {"message": f"Community update {update_id} approved successfully"}

@router.patch("/reject-update/{update_id}")
async def reject_update(
    update_id: int,
    reason: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """Reject a pending community update"""
    update_index = next((i for i, u in enumerate(MOCK_PENDING_UPDATES) if u["id"] == update_id), None)
    if update_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Community update not found"
        )
    
    # Remove from pending
    MOCK_PENDING_UPDATES.pop(update_index)
    
    return {"message": f"Community update {update_id} rejected successfully"}

@router.post("/notify-neighborhood/{neighborhood_id}")
async def notify_neighborhood(
    neighborhood_id: str,
    message: str,
    notification_type: str = "general",
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """Send notification to a neighborhood"""
    # Mock implementation
    return {
        "message": f"Notification sent to neighborhood {neighborhood_id}",
        "notification_type": notification_type,
        "content": message
    }
