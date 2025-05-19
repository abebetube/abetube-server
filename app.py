from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q')  # מקבל פרמטר בשם q מכתובת URL
    # תוכל לעבד את הנתון query כאן
    return jsonify({"result": f"You searched for {query}"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
