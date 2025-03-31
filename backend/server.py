from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS     #pip install flask-cors
from google import genai        #pip install google-genai
from dotenv import load_dotenv  # pip install python-dotenv
import os




app = Flask(__name__)


load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


#variable name is "sensitive"? DO NOT CHANGE
gemini_client = genai.Client(api_key=GEMINI_API_KEY)    #UPDATE API KEY FOR OTHER USERS


CORS(app)


client = MongoClient("mongodb://localhost:27017/")
db = client["packup"]
users = db["users"]


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
        return jsonify({"error": "No input provided"}), 400


   
    response = gemini_client.models.generate_content(
    model="gemini-2.0-flash",
    contents = user_input,
    )
    print("Response from Gemini:", response.text)
    return jsonify({"response": response.text}), 200


   


if __name__ == "__main__":
    app.run(debug=True)