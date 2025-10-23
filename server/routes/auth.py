from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from models import User, UserRole
from utils.auth import get_current_user
from pydantic import BaseModel
from datetime import datetime
import firebase_admin
from firebase_admin import auth as firebase_auth
import os

router = APIRouter()
security = HTTPBearer()

# Pydantic models
class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    first_name: str
    last_name: str
    phone: Optional[str]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: str
    firebase_uid: str
    role: str
    first_name: str
    last_name: str
    phone: Optional[str] = None

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None

class LoginRequest(BaseModel):
    id_token: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Mock users for development
MOCK_USERS = [
    {
        "id": 1,
        "email": "homeowner@example.com",
        "firebase_uid": "firebase_uid_1",
        "role": "homeowner",
        "first_name": "John",
        "last_name": "Doe",
        "phone": "+1234567890",
        "is_active": True,
        "created_at": "2024-01-01T00:00:00"
    },
    {
        "id": 2,
        "email": "contractor@example.com",
        "firebase_uid": "firebase_uid_2",
        "role": "contractor",
        "first_name": "Jane",
        "last_name": "Smith",
        "phone": "+1234567891",
        "is_active": True,
        "created_at": "2024-01-02T00:00:00"
    },
    {
        "id": 3,
        "email": "buyer@example.com",
        "firebase_uid": "firebase_uid_3",
        "role": "buyer",
        "first_name": "Bob",
        "last_name": "Johnson",
        "phone": "+1234567892",
        "is_active": True,
        "created_at": "2024-01-03T00:00:00"
    },
    {
        "id": 4,
        "email": "admin@example.com",
        "firebase_uid": "firebase_uid_4",
        "role": "admin",
        "first_name": "Alice",
        "last_name": "Admin",
        "phone": "+1234567893",
        "is_active": True,
        "created_at": "2024-01-04T00:00:00"
    }
]

@router.post("/login", response_model=LoginResponse)
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """Login with Firebase ID token"""
    try:
        # In production, verify the Firebase ID token
        # decoded_token = firebase_auth.verify_id_token(login_data.id_token)
        # firebase_uid = decoded_token['uid']
        
        # For development, use mock verification
        firebase_uid = "firebase_uid_1"  # Mock UID
        
        # Find user by Firebase UID
        user = next((u for u in MOCK_USERS if u["firebase_uid"] == firebase_uid), None)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Generate mock JWT token (in production, use proper JWT)
        access_token = f"mock_jwt_token_{user['id']}"
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

@router.post("/register", response_model=UserResponse)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """Register a new user"""
    # Check if user already exists
    existing_user = next((u for u in MOCK_USERS if u["email"] == user_data.email), None)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Create new user
    new_user = {
        "id": len(MOCK_USERS) + 1,
        **user_data.dict(),
        "is_active": True,
        "created_at": datetime.utcnow().isoformat()
    }
    MOCK_USERS.append(new_user)
    
    return new_user

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Get current user information"""
    user_data = next((u for u in MOCK_USERS if u["id"] == current_user.id), None)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user_data

@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update current user information"""
    user_index = next((i for i, u in enumerate(MOCK_USERS) if u["id"] == current_user.id), None)
    if user_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update user data
    update_data = user_data.dict(exclude_unset=True)
    MOCK_USERS[user_index].update(update_data)
    
    return MOCK_USERS[user_index]

@router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_user)
):
    """Logout user"""
    # In production, you might want to blacklist the token
    return {"message": "Successfully logged out"}

@router.get("/users", response_model=list[UserResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    role: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all users (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view all users"
        )
    
    users = MOCK_USERS[skip:skip+limit]
    
    # Apply role filter
    if role:
        users = [u for u in users if u["role"] == role]
    
    return users
