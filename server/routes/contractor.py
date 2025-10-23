from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import User, ContractorAssignment, Renovation
from utils.auth import get_current_user
from utils.permissions import require_role
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# Pydantic models
class ProjectSubmissionResponse(BaseModel):
    id: int
    property_id: int
    contractor_id: int
    title: str
    description: Optional[str]
    renovation_type: str
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    cost: Optional[float]
    materials: Optional[dict]
    blueprints: Optional[dict]
    photos: Optional[dict]
    status: str
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ProjectSubmissionCreate(BaseModel):
    property_id: int
    title: str
    description: Optional[str] = None
    renovation_type: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    cost: Optional[float] = None
    materials: Optional[dict] = None
    blueprints: Optional[dict] = None
    photos: Optional[dict] = None

class AssignmentResponse(BaseModel):
    id: int
    contractor_id: int
    property_id: int
    assignment_type: str
    status: str
    assigned_date: datetime
    completed_date: Optional[datetime]
    notes: Optional[str]
    
    class Config:
        from_attributes = True

# Mock data
MOCK_PROJECT_SUBMISSIONS = [
    {
        "id": 1,
        "property_id": 1,
        "contractor_id": 2,
        "title": "Kitchen Renovation",
        "description": "Complete kitchen remodel with new appliances",
        "renovation_type": "kitchen",
        "start_date": "2024-01-15T00:00:00",
        "end_date": "2024-02-28T00:00:00",
        "cost": 25000.0,
        "materials": {
            "cabinets": "Custom oak cabinets",
            "countertops": "Quartz countertops",
            "appliances": "Stainless steel appliances"
        },
        "blueprints": ["kitchen_layout.pdf", "electrical_plan.pdf"],
        "photos": ["before_photos.zip", "progress_photos.zip", "after_photos.zip"],
        "status": "completed",
        "is_verified": True,
        "created_at": "2024-01-10T00:00:00"
    },
    {
        "id": 2,
        "property_id": 2,
        "contractor_id": 2,
        "title": "Bathroom Remodel",
        "description": "Master bathroom renovation",
        "renovation_type": "bathroom",
        "start_date": "2024-02-01T00:00:00",
        "end_date": None,
        "cost": 15000.0,
        "materials": {
            "tile": "Ceramic tile",
            "fixtures": "Modern fixtures",
            "vanity": "Custom vanity"
        },
        "blueprints": ["bathroom_layout.pdf"],
        "photos": ["before_photos.zip"],
        "status": "in_progress",
        "is_verified": False,
        "created_at": "2024-01-25T00:00:00"
    }
]

MOCK_ASSIGNMENTS = [
    {
        "id": 1,
        "contractor_id": 2,
        "property_id": 1,
        "assignment_type": "renovation",
        "status": "completed",
        "assigned_date": "2024-01-01T00:00:00",
        "completed_date": "2024-02-28T00:00:00",
        "notes": "Kitchen renovation completed successfully"
    },
    {
        "id": 2,
        "contractor_id": 2,
        "property_id": 2,
        "assignment_type": "renovation",
        "status": "in_progress",
        "assigned_date": "2024-01-15T00:00:00",
        "completed_date": None,
        "notes": "Bathroom renovation in progress"
    }
]

@router.get("/assignments", response_model=List[AssignmentResponse])
async def get_contractor_assignments(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["contractor"]))
):
    """Get assignments for the current contractor"""
    assignments = MOCK_ASSIGNMENTS[skip:skip+limit]
    
    # Filter by contractor
    assignments = [a for a in assignments if a["contractor_id"] == current_user.id]
    
    # Apply status filter
    if status:
        assignments = [a for a in assignments if a["status"] == status]
    
    return assignments

@router.get("/projects", response_model=List[ProjectSubmissionResponse])
async def get_contractor_projects(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["contractor"]))
):
    """Get project submissions for the current contractor"""
    projects = MOCK_PROJECT_SUBMISSIONS[skip:skip+limit]
    
    # Filter by contractor
    projects = [p for p in projects if p["contractor_id"] == current_user.id]
    
    # Apply status filter
    if status:
        projects = [p for p in projects if p["status"] == status]
    
    return projects

@router.post("/project-submission", response_model=ProjectSubmissionResponse)
async def submit_project(
    project_data: ProjectSubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["contractor"]))
):
    """Submit a new project"""
    new_project = {
        "id": len(MOCK_PROJECT_SUBMISSIONS) + 1,
        "contractor_id": current_user.id,
        **project_data.dict(),
        "status": "in_progress",
        "is_verified": False,
        "created_at": datetime.utcnow().isoformat()
    }
    MOCK_PROJECT_SUBMISSIONS.append(new_project)
    return new_project

@router.put("/project-submission/{project_id}", response_model=ProjectSubmissionResponse)
async def update_project(
    project_id: int,
    project_data: ProjectSubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["contractor"]))
):
    """Update a project submission"""
    project_index = next((i for i, p in enumerate(MOCK_PROJECT_SUBMISSIONS) if p["id"] == project_id), None)
    if project_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check permissions
    project = MOCK_PROJECT_SUBMISSIONS[project_index]
    if project["contractor_id"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this project"
        )
    
    # Update the project
    update_data = project_data.dict(exclude_unset=True)
    MOCK_PROJECT_SUBMISSIONS[project_index].update(update_data)
    
    return MOCK_PROJECT_SUBMISSIONS[project_index]

@router.patch("/project-submission/{project_id}/complete")
async def complete_project(
    project_id: int,
    completion_notes: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["contractor"]))
):
    """Mark a project as completed"""
    project_index = next((i for i, p in enumerate(MOCK_PROJECT_SUBMISSIONS) if p["id"] == project_id), None)
    if project_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check permissions
    project = MOCK_PROJECT_SUBMISSIONS[project_index]
    if project["contractor_id"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to complete this project"
        )
    
    MOCK_PROJECT_SUBMISSIONS[project_index].update({
        "status": "completed",
        "end_date": datetime.utcnow().isoformat()
    })
    
    return {"message": f"Project {project_id} marked as completed"}

@router.get("/notifications")
async def get_contractor_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["contractor"]))
):
    """Get notifications for the contractor"""
    # Mock notifications
    notifications = [
        {
            "id": 1,
            "type": "project_approved",
            "title": "Project Approved",
            "message": "Your kitchen renovation project has been approved",
            "created_at": "2024-02-01T00:00:00",
            "read": False
        },
        {
            "id": 2,
            "type": "new_assignment",
            "title": "New Assignment",
            "message": "You have been assigned to a new bathroom renovation project",
            "created_at": "2024-01-25T00:00:00",
            "read": True
        }
    ]
    
    return notifications
