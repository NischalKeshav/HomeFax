from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import Report, User, Property
from utils.auth import get_current_user
from utils.permissions import require_role
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# Pydantic models
class ReportResponse(BaseModel):
    id: int
    property_id: int
    submitter_id: int
    report_type: str
    title: str
    description: Optional[str]
    report_data: Optional[dict]
    attachments: Optional[dict]
    status: str
    reviewed_by: Optional[int]
    reviewed_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True

class ReportCreate(BaseModel):
    property_id: int
    report_type: str
    title: str
    description: Optional[str] = None
    report_data: Optional[dict] = None
    attachments: Optional[dict] = None

class ReportUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    report_data: Optional[dict] = None
    attachments: Optional[dict] = None
    status: Optional[str] = None

# Mock data
MOCK_REPORTS = [
    {
        "id": 1,
        "property_id": 1,
        "submitter_id": 1,
        "report_type": "inspection",
        "title": "Annual Home Inspection",
        "description": "Comprehensive inspection of all major systems",
        "report_data": {
            "electrical": "Good",
            "plumbing": "Good", 
            "hvac": "Needs maintenance",
            "roof": "Good"
        },
        "attachments": ["inspection_report.pdf", "photos.zip"],
        "status": "approved",
        "reviewed_by": 4,
        "reviewed_at": "2024-01-20T00:00:00",
        "created_at": "2024-01-15T00:00:00"
    },
    {
        "id": 2,
        "property_id": 1,
        "submitter_id": 2,
        "report_type": "repair",
        "title": "Kitchen Renovation",
        "description": "Complete kitchen remodel with new appliances",
        "report_data": {
            "cost": 25000,
            "duration": "6 weeks",
            "contractor": "ABC Construction"
        },
        "attachments": ["before_photos.zip", "after_photos.zip", "receipts.pdf"],
        "status": "pending",
        "reviewed_by": None,
        "reviewed_at": None,
        "created_at": "2024-02-01T00:00:00"
    }
]

@router.get("/", response_model=List[ReportResponse])
async def get_reports(
    skip: int = 0,
    limit: int = 100,
    property_id: Optional[int] = None,
    status: Optional[str] = None,
    report_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get reports with optional filtering"""
    reports = MOCK_REPORTS[skip:skip+limit]
    
    # Apply filters
    if property_id:
        reports = [r for r in reports if r["property_id"] == property_id]
    if status:
        reports = [r for r in reports if r["status"] == status]
    if report_type:
        reports = [r for r in reports if r["report_type"] == report_type]
    
    return reports

@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific report by ID"""
    report = next((r for r in MOCK_REPORTS if r["id"] == report_id), None)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    return report

@router.post("/", response_model=ReportResponse)
async def create_report(
    report_data: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new report"""
    new_report = {
        "id": len(MOCK_REPORTS) + 1,
        "submitter_id": current_user.id,
        **report_data.dict(),
        "status": "pending",
        "reviewed_by": None,
        "reviewed_at": None,
        "created_at": datetime.utcnow().isoformat()
    }
    MOCK_REPORTS.append(new_report)
    return new_report

@router.put("/{report_id}", response_model=ReportResponse)
async def update_report(
    report_id: int,
    report_data: ReportUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a report"""
    report_index = next((i for i, r in enumerate(MOCK_REPORTS) if r["id"] == report_id), None)
    if report_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Check permissions
    report = MOCK_REPORTS[report_index]
    if current_user.role != "admin" and report["submitter_id"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this report"
        )
    
    # Update the report
    update_data = report_data.dict(exclude_unset=True)
    MOCK_REPORTS[report_index].update(update_data)
    
    return MOCK_REPORTS[report_index]

@router.patch("/{report_id}/approve")
async def approve_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """Approve a report (admin only)"""
    report_index = next((i for i, r in enumerate(MOCK_REPORTS) if r["id"] == report_id), None)
    if report_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    MOCK_REPORTS[report_index].update({
        "status": "approved",
        "reviewed_by": current_user.id,
        "reviewed_at": datetime.utcnow().isoformat()
    })
    
    return {"message": "Report approved successfully"}

@router.patch("/{report_id}/reject")
async def reject_report(
    report_id: int,
    reason: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """Reject a report (admin only)"""
    report_index = next((i for i, r in enumerate(MOCK_REPORTS) if r["id"] == report_id), None)
    if report_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    MOCK_REPORTS[report_index].update({
        "status": "rejected",
        "reviewed_by": current_user.id,
        "reviewed_at": datetime.utcnow().isoformat(),
        "description": f"{MOCK_REPORTS[report_index]['description']}\n\nRejection reason: {reason}"
    })
    
    return {"message": "Report rejected successfully"}
