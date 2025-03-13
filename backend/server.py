from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client["packup"]
users = db["users"]

# Example route
@app.route("/members")
def members():
    return {"members": ["Member1", "Member2", "Member3"]}


@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    username = data["username"]
    age = data["age"]

    users.insert_one({"username": username, "age": age})

    return jsonify({"message": "User created!", "username": username, "age": age})
  
@app.route("/users/<username>",methods=["DELETE"])
def delete(username):
    users.delete_one({"username": username})
    return jsonify({"message": f"Deleted {username}"}), 200

if __name__ == "__main__":
    app.run(debug=True)