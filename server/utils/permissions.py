from fastapi import Depends, HTTPException, status
from typing import List
from models import User, UserRole
from utils.auth import get_current_user

def require_role(allowed_roles: List[str]):
    """Decorator to require specific roles for access"""
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker

def require_homeowner(current_user: User = Depends(get_current_user)):
    """Require homeowner role"""
    if current_user.role != UserRole.HOMEOWNER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Homeowner role required."
        )
    return current_user

def require_contractor(current_user: User = Depends(get_current_user)):
    """Require contractor role"""
    if current_user.role != UserRole.CONTRACTOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Contractor role required."
        )
    return current_user

def require_buyer(current_user: User = Depends(get_current_user)):
    """Require buyer role"""
    if current_user.role != UserRole.BUYER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Buyer role required."
        )
    return current_user

def require_admin(current_user: User = Depends(get_current_user)):
    """Require admin role"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin role required."
        )
    return current_user

def require_owner_or_admin(resource_owner_id: int, current_user: User = Depends(get_current_user)):
    """Require user to be the resource owner or admin"""
    if current_user.id != resource_owner_id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. You must be the resource owner or admin."
        )
    return current_user
