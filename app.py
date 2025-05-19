from flask import Flask, request, jsonify
import requests
import json

app = Flask(__name__)
PIPED_API = "https://pipedapi.kavin.rocks"

@app.route("/")
def home():
    return jsonify({"message": "AbeTube backend is running ✅"}), 200

@app.route("/search")
def search():
    query = request.args.get("q", "")
    if not query:
        return jsonify({"error": "Missing query parameter"}), 400
    try:
        res = requests.get(f"{PIPED_API}/search", params={"query": query, "filter": "videos"})
        print("Search status:", res.status_code)
        if res.status_code != 200:
            return jsonify({"error": "Failed to fetch from Piped"}), res.status_code
        return res.json()
    except Exception as e:
        print("Search Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/video")
def video():
    video_id = request.args.get("id", "")
    if not video_id:
        return jsonify({"error": "Missing video ID"}), 400
    try:
        res = requests.get(f"{PIPED_API}/streams/{video_id}")
        print("Video status:", res.status_code)
        if res.status_code != 200:
            return jsonify({"error": "Failed to fetch video stream"}), res.status_code
        return res.json()
    except Exception as e:
        print("Video Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/suggestions")
def suggestions():
    video_id = request.args.get("id", "")
    if not video_id:
        return jsonify({"error": "Missing video ID"}), 400
    try:
        res = requests.get(f"{PIPED_API}/related/{video_id}")
        print("Suggestions status:", res.status_code)
        if res.status_code != 200:
            return jsonify({"error": "Failed to fetch suggestions"}), res.status_code
        return res.json()
    except Exception as e:
        print("Suggestions Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
