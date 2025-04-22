from google import genai
import json
from pydantic import BaseModel
from typing import List, get_type_hints
import re
from pydantic import BaseModel
from typing import Optional, List
from pydantic import ValidationError
import os
from datetime import datetime
from datetime import date
class VisitModel(BaseModel):
    # Define your fields here, for example:
    # name: str
    # city: str
    # Define your fields here, for example:
    placeName: str
    latitude:  float
    longitude:  float
    address: str
    media: List[str]
    openingHours: str
    city:  str
    country:  str
    date: datetime              #Optional[datetime]  = None
    timeOfVisit:  str
    duration:  str
    notes: str

class TripItineraryModel(BaseModel):
    userName: str                  # User's name
    tripDestination: str          # Main destination of the trip
    visits: List[VisitModel]     # List of visit details
    