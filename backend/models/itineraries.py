from mongoengine import Document, StringField, IntField, DateTimeField, FloatField, ListField, ReferenceField, connect
import datetime

connect("packup")

class User(Document):
    name = StringField(required=True, max_length=100)  # Required and max length
    age = IntField(min_value=0)  # Age cannot be negative
    created_at = DateTimeField(default=datetime.datetime.now(datetime.timezone.utc))

class ItineraryStop(Document):
    placeName = StringField(required=True, max_length=100)
    latitude = FloatField(required=True, min_value = -91, max_value=91)
    longitude = FloatField(required=True, min_value = -181, max_value = 181)
    address = StringField(required=True)
    media = ListField(StringField())
    openingHours = StringField()
    city = StringField(required=True)
    country = StringField(required=True)
    date = DateTimeField(required=True)
    timeOfVisit = StringField(required=True)
    duration = StringField(required=True)
    notes = StringField(required=True)
    
class Trip(Document):
    itineraryStop = ListField(ReferenceField(ItineraryStop))
    name = StringField(required=True, max_length=100)
    user = ListField(ReferenceField(User))
    
# Usage example
try:
    user = User(name = "John Doe", age = 5)
    user.save()
    
    stop = ItineraryStop(placeName = "Museum", latitude = 0.0, longitude = 0.0, address = "17792 Maxine Lane", media = ["Lord of the rings", "Severance"],
                         openingHours = "8:30 -10:30", city = "Paris", country = "France" , date = datetime.datetime(2025, 4,4), timeOfVisit = "10:00 AM" , duration = "4 hours", notes = "Super cool place")
    
    stop.save()

    trip = Trip(itineraryStop = [stop], name = "Paris Trip", user = [user])
    trip.save()

except Exception as e:
    print(f"Error: {e}")  # ValidationError: "age" cannot be negative
