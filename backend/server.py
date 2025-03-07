from flask import Flask, request, jsonify
from pymongo import MongoClient

app = Flask(__name__)

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

if __name__ == "__main__":
    app.run(debug=True)