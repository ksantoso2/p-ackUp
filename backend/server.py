from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from google import genai        #pip install google-genai

app = Flask(__name__)
client = genai.Client(api_key="AIzaSyBCFrOAyjn4JHAdJkMylalPl58bSoPr890")    #UPDATE API KEY FOR OTHER USERS

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
    user_input = request.json.get('user_input')     #UPDATE TO CORRECT INPUT VARIABLE
    response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="user_input",
    )
    return jsonify({"response": response.text}), 200
    

if __name__ == "__main__":
    app.run(debug=True)