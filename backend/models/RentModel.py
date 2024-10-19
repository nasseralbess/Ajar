# models.py
from pydantic import BaseModel
from typing import Optional

class RentalItem(BaseModel):
    id: int
    host_id: int
    property_type: str
    name: Optional[str] = None
    price: Optional[str] = None
    picture_url: Optional[str] = None
    review_scores_value: Optional[float] = None
    room_type: Optional[str] = None
    accommodates: Optional[int] = None

    class Config:
        orm_mode = True
