from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS     #pip install flask-cors
from google import genai        #pip install google-genai
from google.genai.types import GenerateContentConfig, HttpOptions
from dotenv import load_dotenv  # pip install python-dotenv
from models.itineraries import User, ItineraryStop, Trip
import os

app = Flask(__name__)
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

#variable name is "sensitive" DO NOT CHANGE (need _ ?)
gemini_client = genai.Client(api_key=GEMINI_API_KEY)    #UPDATE API KEY FOR OTHER USERS


CORS(app)


client = MongoClient("mongodb://localhost:27017/")
db = client["packup"]
users = db["users"]
itineraries = db["itineraries"]
response = ""


# Example route
@app.route("/members")
def members():
    return {"members": ["Member1", "Member2", "Member3"]}

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
        return jsonify({"error": "No input provided"}), 400 # change to 200 or 400 if no CORS error

    response=gemini_client.models.generate_content(
    model="gemini-2.0-flash",
    contents = user_input,
    config=GenerateContentConfig(
        system_instruction=[
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
        - Make sure to give appropriate location suggestions based on the user's age (e.g. no bars for those who aren't drinking age in 
        the location)
        - When possible, highlight small/family owned businesses instead of focusing all on popular touristy spots. 
        """
        ]
    )
    )
    
    print("Response from Gemini:", response.text) 
    return jsonify({"response": response.text}), 200


@app.route("/users", methods=["GET"])
def get_users():
    get_users = users.find({}, {"_id": 0, "username": 1, "age": 1})  
    return jsonify(list(get_users)), 200

  
@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    username = data["username"]
    age = data["age"]

    users.insert_one({"username": username, "age": age})

    return jsonify({"message": "User created!", "username": username, "age": age})


@app.route("/itineraries", methods=["POST"])
def create_itinerary():
    data = request.get_json()

    try:

        user_data = data.get("user")
        user = User.objects(name=user_data["name"]).first()
        if not user:
            user = User(name=user_data["name"], age=user_data["age"])
            user.save()

        stop_refs = []
        for stop_data in data.get("itineraryStop", []):
            stop = ItineraryStop(**stop_data)
            stop.save()
            stop_refs.append(stop)

        trip = Trip(
            name=data["name"],
            user=[user],
            itineraryStop=stop_refs
        )
        trip.save()

        return jsonify({"message": "Trip created", "trip_id": str(trip.id)}), 201

    except ValidationError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)