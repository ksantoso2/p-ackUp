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


if __name__ == "__main__":
    app.run(debug=True)