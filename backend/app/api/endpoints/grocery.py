from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.achievement import GroceryItem

router = APIRouter()

class GroceryCreate(BaseModel):
    ingredient_name: str
    category: Optional[str] = "Pantry"
    from_recipe: Optional[str] = None

class GroceryBulkCreate(BaseModel):
    items: List[str]
    from_recipe: Optional[str] = None

@router.get("/")
def get_grocery_list(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    items = db.query(GroceryItem).filter(GroceryItem.user_id == current_user.id).all()
    if not items:
        # Seed default sample items for fresh user
        defaults = [
            GroceryItem(user_id=current_user.id, ingredient_name="Almond Flour", category="Baking", from_recipe="Air-Fried Pizza Twin", checked=False),
            GroceryItem(user_id=current_user.id, ingredient_name="Cauliflower Rice", category="Produce", from_recipe="Air-Fried Pizza Twin", checked=True),
            GroceryItem(user_id=current_user.id, ingredient_name="Turkey Pepperoni", category="Deli", from_recipe="Air-Fried Pizza Twin", checked=False),
            GroceryItem(user_id=current_user.id, ingredient_name="Non-Fat Greek Yogurt", category="Dairy", from_recipe="Smokey Turkey Burger", checked=False),
            GroceryItem(user_id=current_user.id, ingredient_name="Sweet Potatoes", category="Produce", from_recipe="Air-Fried Sweet Potato Fries", checked=True),
        ]
        db.add_all(defaults)
        db.commit()
        items = db.query(GroceryItem).filter(GroceryItem.user_id == current_user.id).all()
    return items

@router.post("/")
def add_grocery_item(
    item_in: GroceryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = GroceryItem(
        user_id=current_user.id,
        ingredient_name=item_in.ingredient_name,
        category=item_in.category or "Pantry",
        from_recipe=item_in.from_recipe
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.post("/bulk-add")
def bulk_add_grocery(
    bulk_in: GroceryBulkCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_items = []
    for ingredient in bulk_in.items:
        item = GroceryItem(
            user_id=current_user.id,
            ingredient_name=ingredient,
            category="Recipe Swaps",
            from_recipe=bulk_in.from_recipe
        )
        new_items.append(item)
    db.add_all(new_items)
    db.commit()
    return {"message": f"Added {len(new_items)} items to your grocery list!"}

@router.put("/{item_id}/toggle")
def toggle_grocery_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(GroceryItem).filter(GroceryItem.id == item_id, GroceryItem.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Grocery item not found")
    item.checked = not item.checked
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def delete_grocery_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(GroceryItem).filter(GroceryItem.id == item_id, GroceryItem.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Grocery item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item deleted"}
