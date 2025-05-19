from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q')  # מקבל פרמטר בשם q מכתובת URL
    # תוכל לעבד את הנתון query כאן
    return jsonify({"result": f"You searched for {query}"})
@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json  # מקבל JSON מהבקשה
    # עיבוד הנתונים
    value = data.get('value', 0)
    result = value * 2  # לדוגמה
    return jsonify({"result": result})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
