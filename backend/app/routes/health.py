from datetime import datetime, timezone
from fastapi import APIRouter
from sqlalchemy import text
from app.database.session import engine

router = APIRouter(tags=["Health"])

@router.get("/api/health")
def health_check():
    db_status = "healthy"
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "ok" if db_status == "healthy" else "degraded",
        "service": "SAHAYAK Emergency Assistance API",
        "database": db_status,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
