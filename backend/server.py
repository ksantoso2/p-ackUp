from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS     #pip install flask-cors
from google import genai        #pip install google-genai
from dotenv import load_dotenv  # pip install python-dotenv
import os
from formatHelper import TitlesModel
import json

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


    response = gemini_client.models.generate_content(
        model="gemini-2.0-flash",
        contents = user_input,
        config=GenerateContentConfig(system_instruction=system_instructions)
    )
    
    print("Response from Gemini:", response.text) 
    return jsonify({"response": response.text}), 200

@app.route('/gemini/makeTrip', methods=['POST'])
def make_trip():
    try:
        # Get history from request
        history = request.get_json().get("history", [])
        print("Received history:", history)

        # Build Gemini prompt
        topic =  history
        base_prompt = f"Generate json of the trips activities off this chat: {topic}"
    #     optimized_prompt = base_prompt + (
    # '. Please provide a response in a structured JSON format that matches the following model: '
    # '{ "name": "Some Name", "city": "Some City"}')
        
        # optimized_prompt = base_prompt + (
        # '. Please provide a response in a structured JSON format that matches the following model: '
        # '{ "placeName": "Some Name", ["latitude": "31.2333", "longitude": "31.2333", "address": "address of place", "city": "city of place","country": "country of place",  "date": "date of visit" (type dateTime), "timeOfVisit": "time to visit the place","duration": "duration of visit at place","notes": "notes about place"]}')   #
        optimized_prompt = base_prompt + '''Use this JSON schema:
                        status = {
                        "placeName": "Name of attraction to visit on the trip" (str),
                        "latitude": "31.2333" (float), 
                        "longitude": "31.2333" (float), 
                        "address": "address of place" (str), 
                        "city": "city of place" (str),
                        "country": "country of place" (str),  
                        "date": "date of visit" (dateTime), 
                        "timeOfVisit": "time to visit the place" (str),
                        "duration": "duration of visit at place" (str)

                        Return: status'''
        # Generate content with Gemini
        # g_response = gemini_client.models.generate_content(
        # model='gemini-2.0-flash',
        # contents=optimized_prompt,
        # )

        g_response = gemini_client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[optimized_prompt],
        config = {
            'response_mime_type': 'application/json',
            'response_schema': TitlesModel,
        },
        )
        response = g_response.parsed

        print("response2:", json.dumps(response.dict(), indent=10, default=str))
        # Safely dump each stop if response is a list
        if isinstance(response, list):
            print("response3: [")
            for stop in response:
                print(json.dumps(stop.dict(), indent=4, default=str), end=",\n")
            print("]")
        else:
            # Just one stop returned
            print("response4:", json.dumps(response.dict(), indent=4, default=str))


    
        # response_raw = gemini_client.models.generate_content(

        # # Extract structured JSON (from string to dict)
        # json_objects = extract_json(g_response.text)

        # print("Gemini Response Text:", g_response.text)

        # if not json_objects:
        #     return jsonify({"error": "No valid JSON extracted from Gemini response"}), 500

        # print("Extracted JSON:", json_objects)

        # # Validate the extracted JSON
        # validated, errors = validate_json_with_model(TitlesModel, json_objects)

        # if errors:
        #     print("Validation errors occurred:", errors)

        # # If validated, extract titles
        # model_object = json_to_pydantic(TitlesModel, json_objects[0])

    
        # #play with json
        
        # # print(model_object.placeName)
       
        # # for placeName in model_object.placeName:
        # #     print(placeName)

        # model_objects = [TitlesModel(**entry) for entry in json_objects]

        # # Print out the values
        # for model in model_objects:
        #     print("Place Name:", model.placeName)
        #     print("Latitude:", model.latitude)
        #     print("Longitude:", model.longitude)
        #     print("Address:", model.address)
        #     print("City:", model.city)
        #     print("Country:", model.country)
        #     print("Date of Visit:", model.date)
        #     print("Time of Visit:", model.timeOfVisit)
        #     print("Duration:", model.duration)
        #     print("Notes:", model.notes)
        #     print("-" * 50)
            # stop = ItineraryStop(
            # placeName=model.placeName,
            # latitude=model.latitude,
            # longitude=model.longitude,
            # address=model.address,
            # city=model.city,
            # country=model.country,
            # date=datetime.datetime.now(datetime.timezone.utc),  # or use model.date if it exists
            # timeOfVisit=model.timeOfVisit,
            # duration=model.duration,
            # notes=model.notes,
            # )
            # stop.save()

        
        # # Return full response with titles and original trip
        return jsonify({"response": g_response.text}), 200

    except Exception as e:
        print("Error occurred:", e)
        return jsonify({"error": str(e)}), 500
    
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

       return jsonify({"message": "Trip created", "trip_id": str(trip.id)}), 201

   except ValidationError as ve:
       return jsonify({"error": str(ve)}), 400
   except Exception as e:
       return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

