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

@app.route("/users/<username>",methods=["DELETE"])
def delete(username):
    users.delete_one({"username": username})
    return jsonify({"message": f"Deleted {username}"}), 200

# create new user route
@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()

    users.insert_one({
        "username": data.get("username"),
        "age": data.get("age")
    })

    return jsonify({"username": data.get("username")}), 201

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


if __name__ == "__main__":
    app.run(debug=True)

