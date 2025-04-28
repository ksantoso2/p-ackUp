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
    
# Usage example with multiple itinerary stops
try:
    user = User.objects(name="John").first()
    if not user:
        user = User(name="John", age=20)
        user.save()

    if not Trip.objects(name="Paris Trip", user=user).first():
        stop1 = ItineraryStop(
            placeName="Louvre Museum",
            latitude=48.8606,
            longitude=2.3376,
            address="Rue de Rivoli, 75001 Paris, France",
            media=["Mona Lisa", "Da Vinci"],
            openingHours="9:00 AM - 6:00 PM",
            city="Paris",
            country="France",
            date=datetime.datetime(2025, 4, 4),
            timeOfVisit="10:00 AM",
            duration="2 hours",
            notes="Start the day with art"
        )
        stop1.save()

        stop2 = ItineraryStop(
            placeName="Eiffel Tower",
            latitude=48.8584,
            longitude=2.2945,
            address="Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
            media=["Photos"],
            openingHours="9:30 AM - 11:45 PM",
            city="Paris",
            country="France",
            date=datetime.datetime(2025, 4, 4),
            timeOfVisit="1:00 PM",
            duration="1.5 hours",
            notes="Walk up the tower!"
        )
        stop2.save()

        stop3 = ItineraryStop(
            placeName="Seine River Cruise",
            latitude=48.8575,
            longitude=2.3429,
            address="Port de la Bourdonnais, 75007 Paris, France",
            media=["Night cruise"],
            openingHours="10:00 AM - 10:00 PM",
            city="Paris",
            country="France",
            date=datetime.datetime(2025, 4, 4),
            timeOfVisit="7:30 PM",
            duration="1 hour",
            notes="Enjoy the ride!"
        )
        stop3.save()

        paris_trip = Trip(
            itineraryStop=[stop1, stop2, stop3],
            name="Paris Trip",
            user=[user]
        )
        paris_trip.save()

    if not Trip.objects(name="NYC Trip", user=user).first():
        nyc_stop1 = ItineraryStop(
            placeName="The Metropolitan Museum of Art",
            latitude=40.7795041,
            longitude=-73.9631904,
            address="100 5th Ave, New York, NY 10028",
            media=["Temple of Dendur", "Egyptian Art"],
            openingHours="10:00 AM - 9:00 PM",
            city="New York",
            country="USA",
            date=datetime.datetime(2025, 4, 10),
            timeOfVisit="10:00 AM",
            duration="2 hours",
            notes="Be sure to stop by the Temple of Dendur"
        )
        nyc_stop1.save()

        nyc_stop2 = ItineraryStop(
            placeName="American Museum of Natural History",
            latitude=40.7813,
            longitude=-73.9735,
            address="200 Central Park W, New York, NY 10024",
            media=["Dinosaur fossils", "Planetarium"],
            openingHours="10:00 AM - 5:30 PM",
            city="New York",
            country="USA",
            date=datetime.datetime(2025, 4, 10),
            timeOfVisit="2:00 PM",
            duration="2 hours",
            notes="Definitely visit the dinosaur exhibit"
        )
        nyc_stop2.save()

        nyc_trip = Trip(
            itineraryStop=[nyc_stop1, nyc_stop2],
            name="NYC Trip",
            user=[user]
        )
        nyc_trip.save()

except Exception as e:
    print(f"Error: {e}")  # ValidationError: "age" cannot be negative