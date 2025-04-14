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
""" try:
        user_data = data.get("user")
        user = User.objects(name=user_data["name"]).first()
        if not user:
            user = User(name=user_data["name"], age=user_data["age"])
            user.save()

        stop_refs = []
        for stop_data in data.get("itineraryStops", []):
            stop = ItineraryStop(**stop_data)
            stop.save()
            stop_refs.append(stop)

        trip = Trip(
            name=data["name"],
            user=[user],
            itineraryStop=stop_refs
        )
        trip.save()

except Exception as e:
    print(f"Error: {e}")  # ValidationError: "age" cannot be negative """