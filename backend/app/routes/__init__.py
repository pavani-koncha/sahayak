from app.routes.auth import router as auth_router
from app.routes.profile import router as profile_router
from app.routes.contacts import router as contacts_router
from app.routes.emergency import router as emergency_router
from app.routes.location import router as location_router
from app.routes.nearby import router as nearby_router
from app.routes.health import router as health_router

__all__ = [
    "auth_router",
    "profile_router",
    "contacts_router",
    "emergency_router",
    "location_router",
    "nearby_router",
    "health_router",
]
