from flask import Flask
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient("mongodb://localhost:27018/")
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

if __name__ == "__main__":
    app.run(debug=True)