from pydantic import BaseModel, Field
from typing import Optional, List

class HostInfo(BaseModel):
    host_id: int
    host_name: str
    host_location: Optional[str] = None
    host_thumbnail_url: Optional[str] = None
    # Input automatically on backend
    host_since: Optional[str] = None