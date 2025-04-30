import json
from flask import Flask, request, jsonify, Response
from pymongo import MongoClient
from flask_cors import CORS     #pip install flask-cors
from google import genai        #pip install google-genai
from dotenv import load_dotenv  # pip install python-dotenv
import os
from formatHelper import TripItineraryModel
import json
from google.genai.types import GenerateContentConfig, HttpOptions
from mongoengine import connect
from datetime import datetime
from models.itineraries import User, ItineraryStop, Trip




app = Flask(__name__)
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

#variable name is "sensitive" DO NOT CHANGE (need _ ?)
gemini_client = genai.Client(api_key=GEMINI_API_KEY)    #UPDATE API KEY FOR OTHER USERS
CORS(app)


client = MongoClient("mongodb://localhost:27017/")
db = client["packup"]
users = db["users"]


# Example route
@app.route("/members")
def members():
    return {"members": ["Member1", "Member2", "Member3, Member4, Member5, Member6, Member7"]}

@app.route("/users/<username>",methods=["DELETE"])
def delete(username):
    users.delete_one({"username": username})
    return jsonify({"message": f"Deleted {username}"}), 200

# API route
@app.route("/gemini", methods = ['POST'])
def gemini():
    data = request.get_json()
    # print("Received data:", data)  
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
                print(chunk.text)
    return Response(generate(), mimetype='text/event-stream')


@app.route('/gemini/makeTrip', methods=['POST'])
def make_trip():
    try:
        # Step 1: Get chat history
        history = request.get_json().get("history", [])
        print("Chat history:", history)

        # Step 2: Build prompt
        base_prompt = f"Generate json of the trips activities off this chat: {history}. Every visit must have a placeName, latitude, longitude, address, city, country, date, timeOfVisit, openingHours, duration, and notes"
        optimized_prompt = base_prompt + ''' Use this JSON schema:
        status = {
            "userName": "Name of the user going on the trip" (str),
            "tripDestination": "Main destination of the trip" (str),
            "visits": [
                {
                    "placeName": "Name of attraction to visit on the trip" (str),
                    "latitude": 31.2333 (float), 
                    "longitude": 31.2333 (float), 
                    "address": "Address of the attraction" (str), 
                    "city": "City where the attraction is located" (str),
                    "country": "Country where the attraction is located" (str),  
                    "date": "Date of visit in ISO format" (dateTime), 
                    "timeOfVisit": "Time to visit the attraction" (str),
                    "openingHours": "Opening hours of the attraction" (str),
                    "duration": "Duration of visit at the attraction" (str),
                    "notes": "Additional notes about the attraction" (str)
                }
            ]
        }
        Return: status'''

        # Step 3: Generate content from Gemini
        g_response = gemini_client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[optimized_prompt],
            config={
                'response_mime_type': 'application/json',
                'response_schema': list[TripItineraryModel],
            },
        )
        itinerary = json.loads(g_response.text) 

        print(g_response.text)
        print(itinerary[0]['userName'])

        # Step 4: Parse response JSON
        itinerary_data = json.loads(g_response.text)
        if isinstance(itinerary_data, list):
            itinerary_data = itinerary_data[0]  # Handle list format

        print("Parsed itinerary:", itinerary_data)

        # Step 5: Validate and store
        user_name = itinerary_data.get("userName")
        trip_destination = itinerary_data.get("tripDestination")
        visits = itinerary_data.get("visits", [])

        if not user_name or not trip_destination or not visits:
            return jsonify({"error": "Missing required fields"}), 400

        # Check or create user
        user = User.objects(name=user_name).first()
        if not user:
            user = User(name=user_name)
            user.save()
            print(f"Created new user: {user_name}")

        # Save each itinerary stop
        itinerary_stops = []
        for visit in visits:
            stop = ItineraryStop(
                placeName=visit["placeName"],
                latitude=visit["latitude"],
                longitude=visit["longitude"],
                address=visit["address"],
                city=visit["city"],
                country=visit["country"],
                date=datetime.strptime(visit["date"], "%Y-%m-%dT%H:%M:%SZ"), 
                timeOfVisit=visit["timeOfVisit"],
                openingHours=visit["openingHours"],
                duration=visit["duration"],
                notes=visit["notes"]
            )
            stop.save()
            itinerary_stops.append(stop)
        print("WE MADE IT")
        # Save trip
        trip = Trip(
            itineraryStop=itinerary_stops,
            name=trip_destination,
            user=[user]
        )
        trip.save()
        print(f"Message: Itinerary created and stored successfully!\n"
            f"Trip ID: {str(trip.id)}\n"
            f"User: {user_name}\n"
            f"Destination: {trip_destination}\n"
            f"Number of Visits: {len(itinerary_stops)}")

        return jsonify({
            "message": "Itinerary created and stored successfully!",
            "trip_id": str(trip.id),
            "user": user_name,
            "destination": trip_destination,
            "num_visits": len(itinerary_stops)
        }), 201

    except Exception as e:
        print("Error:", e)
        print(traceback.format_exc())
        return jsonify({"error": f"Failed to generate and store itinerary: {str(e)}"}), 500


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

import traceback

@app.route("/itineraries", methods=["POST"])
def create_itinerary():
    print("HELLO!!!!!!!!")
    # try:
        # # Get the data from the request
        # data = request.get_json()
        # print("TEST", data)

        # # Check if the data is a list and access the first item
        # if isinstance(data, list):
        #     data = data[0]  # Access the first item in the list
    try:
        # Step 1: Parse the JSON from the request
        data1 = request.get_json()
        print("RAW DATA:", data1)

        # Step 2: Handle Gemini-style response wrapping
        if isinstance(data1, dict) and "response" in data1 and isinstance(data1["response"], str):
            data = json.loads(data1["response"])
        else:
            data = data1
        print("OOOOOOOOO ", data)
        # Step 3: If the data is a list, take the first item
        if isinstance(data, list):
            data = data[0]
        # Parse the data from the first item
        user_name = data.get("userName")
        trip_destination = data.get("tripDestination")
        visits = data.get("visits", [])

        # Validate the input
        if not user_name or not trip_destination or not visits:
            return jsonify({"error": "Missing required fields"}), 400

        # Check if the user exists, if not create the user
        user = User.objects(name=user_name).first()
        if not user:
            # Create the user if not found
            user = User(name=user_name)
            user.save()  # Save the new user to MongoDB
            print(f"Created new user: {user_name}")

        # Create a list of ItineraryStop instances
        itinerary_stops = []
        for visit in visits:
            # Create a new ItineraryStop instance
            stop = ItineraryStop(
                placeName=visit["placeName"],
                latitude=visit["latitude"],
                longitude=visit["longitude"],
                address=visit["address"],
                city=visit["city"],
                country=visit["country"],
                date=datetime.strptime(visit["date"], "%Y-%m-%dT%H:%M:%SZ"),  # Correct usage of datetime
                timeOfVisit=visit["timeOfVisit"],
                openingHours=visit["openingHours"],
                duration=visit["duration"],
                notes=visit["notes"]
            )
            stop.save()  # Save the stop to MongoDB
            itinerary_stops.append(stop)  # Add the stop to the list of stops

        # Create a new Trip instance with the reference to ItineraryStop and User
        trip = Trip(
            itineraryStop=itinerary_stops,  # List of ItineraryStop references
            name=trip_destination,
            user=[user]  # List of User references
        )
        trip.save()  # Save the trip to MongoDB

        # Return the newly created itinerary with its unique MongoDB ID
        return jsonify({
            "message": "Itinerary created successfully",
            "trip_id": str(trip.id),  # Return the MongoDB ID of the trip
            "itinerary": {
                "userName": user_name,
                "tripDestination": trip_destination,
                "visits": [{"placeName": stop.placeName, "date": stop.date, "openingHours": stop.openingHours} for stop in itinerary_stops]  # List of stops with place names and dates
            }
        }), 201


    except Exception as e:
        # Log detailed error information
        print("Error occurred:", e)
        print("Traceback:", traceback.format_exc())  # Print full traceback for better debugging
        return jsonify({"error": f"An error occurred while creating the itinerary: {str(e)}"}), 500





if __name__ == "__main__":
    app.run(debug=True)

