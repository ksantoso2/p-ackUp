import json
from flask import Flask, request, jsonify, Response
from pymongo import MongoClient
from flask_cors import CORS     #pip install flask-cors
from google import genai        #pip install google-genai
from dotenv import load_dotenv  # pip install python-dotenv
import os
from google.genai.types import GenerateContentConfig, HttpOptions
from models.itineraries import User, ItineraryStop, Trip

app = Flask(__name__)
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

#variable name is "sensitive"? DO NOT CHANGE
gemini_client = genai.Client(api_key=GEMINI_API_KEY)    #UPDATE API KEY FOR OTHER USERS


CORS(app)


client = MongoClient("mongodb://localhost:27017/")
db = client["packup"]
users = db["users"]

@app.route("/users/<username>",methods=["DELETE"])
def delete(username):
    users.delete_one({"username": username})
    return jsonify({"message": f"Deleted {username}"}), 200

# API route
@app.route("/gemini", methods = ['POST'])
def gemini():
    data = request.get_json()
    print("Received data:", data)  

    user_input = data.get("user_input", "").strip()
    if not user_input:
        return jsonify({"error": "No input provided"}), 400 

    system_instructions = [
        """
        You are a travel planning assistant chat bot for people who want itineraries based on movies engaging in the format of a 
        friendly, helpful conversation. You begin with an friendly introduction of yourself and your role. Then, ask the user where 
        they are going. If the initial response is not a location on Earth, the response should be "Please provide a valid location".
        If they don't include information like the duration, budget, party size, and occasion, please ask follow-up questions until you
        feel that you have enough basic information to start planning for the trip. 
        Once you have a good understanding of where they want to go and when, you will figure out movies and or TV shows with famous 
        scenes that took place/ were set in the city. Provide the user with these movies/TV shows and ask if they find them interesting. Prompt
        the user and see if they have more movies in mind, and if so give more similar movie options. 
        Following the movies, generate various must-see sights or must try foods at the location. Give the user a list of each. 
        When giving the list, provide how close it is to another must try food or a movie/TV show location that they chose. 
        Provide when the attraction opens. 

        Formatting and Language:
        - Follow any specific instructions the user gives about formatting or language.

        Warnings:
        - Make sure to use appropriate languange at all times
        - Follow the Motion Picture Association film rating system age guidelines to give age-appropriate movie and show based 
        suggestions to the user.
        - When possible, highlight small/family owned businesses instead of focusing all on popular touristy spots. 
        """
    ]


    def generate():
        stream = gemini_client.models.generate_content_stream(
            model = "gemini-2.0-flash",
            contents = user_input,
        )
        for chunk in stream:
            if chunk.text:
                yield f"data: {json.dumps({'text': chunk.text})}\n\n"
    
    return Response(generate(), mimetype='text/event-stream')

@app.route("/users", methods=["GET"])
def get_users():
    get_users = users.find({}, {"_id": 0, "username": 1, "age": 1})  
    return jsonify(list(get_users)), 200


#GET request to get one user
@app.route("/users/<username>", methods=["GET"])
def get_user(username):
    user = users.find_one({"username": username})

    if user:
        return jsonify({
            "username": user.get("username"),
            "age": user.get("age")
        }), 200
    else:
        return jsonify({"error": "User not found"}), 404

  
@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    username = data["username"]
    age = data["age"]

    users.insert_one({"username": username, "age": age})

    return jsonify({"message": "User created!", "username": username, "age": age})

# GET request for all trips (for trip list)
@app.route("/<username>/get-itineraries", methods=["GET"])
def get_user_itineraries(username):
    user = User.objects(name=username).first()
    if user is None:
        return jsonify({"error": "User not found"}), 404
    trips = Trip.objects(user=user)
    response = []
    for trip in trips:
        trip_data = {
            "id": str(trip.id),
            "name": trip.name,
            "user_ids": [str(u.id) for u in trip.user],
            "itineraryStops": []
        }
        for stop in trip.itineraryStop:
            stop_data = {
                "id": str(stop.id),
                "placeName": stop.placeName,
                "latitude": stop.latitude,
                "longitude": stop.longitude,
                "address": stop.address,
                "media": stop.media,
                "openingHours": stop.openingHours,
                "city": stop.city,
                "country": stop.country,
                "date": stop.date.isoformat(),
                "timeOfVisit": stop.timeOfVisit,
                "duration": stop.duration,
                "notes": stop.notes
            }
            trip_data["itineraryStops"].append(stop_data)
        response.append(trip_data)
    return jsonify(response), 200

#GET request for a specific trip (for each trip page)
@app.route("/get-itineraries/<username>/<trip_id>", methods=["GET"])
def get_specific_itinerary(username, trip_id):
    user = User.objects(name=username).first()
    if user is None:
        return jsonify({"error": "User not found"}), 404
    trip = Trip.objects(id=trip_id, user=user).first()
    if trip is None:
        return jsonify({'error': 'Trip not found'}), 404
    stops = []
    for stop in trip.itineraryStop:
        stops.append({
            'id': str(stop.id),
            'placeName': stop.placeName,
            'latitude': stop.latitude,
            'longitude': stop.longitude,
            'address': stop.address,
            'media': stop.media,
            'openingHours': stop.openingHours,
            'city': stop.city,
            'country': stop.country,
            'date': stop.date.isoformat(),
            'timeOfVisit': stop.timeOfVisit,
            'duration': stop.duration,
            'notes': stop.notes
        })
    return jsonify({
        'id': str(trip.id),
        'name': trip.name,
        'stops': stops
    }), 200

if __name__ == "__main__":
    app.run(debug=True)
