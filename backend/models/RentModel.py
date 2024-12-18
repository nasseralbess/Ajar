from pydantic import BaseModel, Field
from typing import Optional, List

class RentalItem(BaseModel):
    id: int
    host_id: int  # Refers to the Host model
    property_type: str
    name: Optional[str] = Field(default="Unknown Property", description="Name of the property")
    price: Optional[str] = Field(default="Price not available", description="Price of the rental")
    picture_url: Optional[str] = Field(default="https://example.com/default_image.jpg", description="URL for the rental image")
    favorites: bool = Field(default=False, description="Whether item is added to user's favorites or not")
    review_scores_value: Optional[float] = Field(default=0.0, description="Overall review score value")
    room_type: Optional[str] = Field(default="Unknown", description="Type of room")
    accommodates: Optional[int] = Field(default=1, description="Number of people the property accommodates")
    bedrooms: Optional[int] = Field(default=1, description="Number of bedrooms")
    beds: Optional[int] = Field(default=1, description="Number of beds")
    bathrooms: Optional[int] = Field(default=1, description="Number of bathrooms")
    number_of_reviews: Optional[int] = Field(default=0, description="Number of reviews")
    host_location: Optional[str] = Field(default="Location not available", description="Location of the property")
    listing_url: Optional[str] = Field(default="https://example.com/listing", description="URL to the listing")
    description: Optional[str] = Field(default="Description not available", description="Detailed description of the property")

    class Config:
        orm_mode = True