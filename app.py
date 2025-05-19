from flask import Flask, request, jsonify
import requests

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
        return jsonify(res.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/video")
def video():
    video_id = request.args.get("id", "")
    if not video_id:
        return jsonify({"error": "Missing video ID"}), 400
    try:
        res = requests.get(f"{PIPED_API}/streams/{video_id}")
        return jsonify(res.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/suggestions")
def suggestions():
    video_id = request.args.get("id", "")
    if not video_id:
        return jsonify({"error": "Missing video ID"}), 400
    try:
        res = requests.get(f"{PIPED_API}/related/{video_id}")
        return jsonify(res.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
