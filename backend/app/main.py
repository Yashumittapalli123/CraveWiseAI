from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.init_db import init_db
from app.api.endpoints import auth, cravings, vision, analytics, coach, grocery, gamification, admin

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="CraveSwap AI API - Intelligent Nutrition Assistant for Healthy Junk Food Twin Swaps"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev/docker
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs"
    }

# Include Router Endpoints
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(cravings.router, prefix=f"{settings.API_V1_STR}/cravings", tags=["Cravings & Twins"])
app.include_router(vision.router, prefix=f"{settings.API_V1_STR}/vision", tags=["Computer Vision"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["Analytics & PDF Report"])
app.include_router(coach.router, prefix=f"{settings.API_V1_STR}/coach", tags=["AI Coach & Reminders"])
app.include_router(grocery.router, prefix=f"{settings.API_V1_STR}/grocery", tags=["Grocery Checklist"])
app.include_router(gamification.router, prefix=f"{settings.API_V1_STR}/gamification", tags=["Gamification & XP"])
app.include_router(admin.router, prefix=f"{settings.API_V1_STR}/admin", tags=["Admin Operations"])
