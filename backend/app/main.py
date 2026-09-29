import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS
from app.database.session import engine, Base
# Import all models so metadata creates them
import app.models # noqa: F401
from app.routes import (
    auth_router,
    profile_router,
    contacts_router,
    emergency_router,
    location_router,
    nearby_router,
    health_router,
)

# Ensure all tables exist
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables are initialized on startup
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="SAHAYAK API",
    description="Emergency assistance when every second matters. Production backend API.",
    version="1.0.0",
    lifespan=lifespan
)

# Parse CORS origins
origins = [origin.strip() for origin in CORS_ORIGINS.split(",") if origin.strip()]
if not origins or "*" in origins:
    allow_origins = ["*"]
else:
    allow_origins = origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(contacts_router)
app.include_router(emergency_router)
app.include_router(location_router)
app.include_router(nearby_router)

@app.get("/")
def root():
    return {
        "app": "SAHAYAK",
        "tagline": "Emergency assistance when every second matters.",
        "status": "online",
        "docs_url": "/docs",
        "health_url": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    from app.config import PORT
    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)
