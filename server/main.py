from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
import uvicorn
from contextlib import asynccontextmanager

from database import engine
from models import Base
from routes import properties, reports, community, admin, contractor, auth

# Create database tables
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown
    pass

app = FastAPI(
    title="HomeFax API",
    description="CarFax for Homes - Property history and verification API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(properties.router, prefix="/api/properties", tags=["properties"])
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])
app.include_router(community.router, prefix="/api/community", tags=["community"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(contractor.router, prefix="/api/contractor", tags=["contractor"])

@app.get("/")
async def root():
    return {"message": "HomeFax API - CarFax for Homes", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
