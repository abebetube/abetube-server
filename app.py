from flask import Flask, request, jsonify
from flask_cors import CORS
import os


const express = require('express')
const app = express()
const port = process.env.PORT || 4000 

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Hello from Flask on Render!"

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q')
    if not query:
        return jsonify({"error": "No query provided"}), 400
    return jsonify({"result": f"You searched for {query}"})

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    if not data or 'value' not in data:
        return jsonify({"error": "No value provided"}), 400
    value = data['value']
    try:
        result = value * 2
    except TypeError:
        return jsonify({"error": "Value must be a number"}), 400
    return jsonify({"result": result})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
