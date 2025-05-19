from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/search')
def search():
    q = request.args.get('q')
    if not q:
        return jsonify({'error': 'No query provided'}), 400
    return jsonify({'query': q, 'results': ['example1', 'example2']})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
