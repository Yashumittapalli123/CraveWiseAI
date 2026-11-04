from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.services.vision_service import analyze_food_image
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/recognize")
async def recognize_food(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File uploaded is not a valid image")
    
    contents = await file.read()
    result = analyze_food_image(contents)
    return result
