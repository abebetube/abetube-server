from flask import Flask, request, jsonify, render_template_string
import subprocess

app = Flask(__name__)

HTML_PAGE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Video Search</title>
</head>
<body>
    <h1>Video Search</h1>
    <form id="searchForm">
        <input type="text" id="query" placeholder="Enter search term" />
        <button type="submit">Search</button>
    </form>
    <div id="result"></div>
<script>
document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var q = document.getElementById('query').value;
    fetch('/search?q=' + encodeURIComponent(q))
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                document.getElementById('result').innerText = 'Error: ' + data.error;
            } else {
                // צור אלמנט וידאו להצגת הסטרים
                var video = document.createElement('video');
                video.src = data.url;
                video.controls = true;
                video.width = 320;
                video.height = 240;
                document.getElementById('result').innerHTML = '';
                document.getElementById('result').appendChild(video);
            }
        });
});
</script>
</body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(HTML_PAGE)

@app.route('/search')
def search():
    query = request.args.get('q', '')
    if not query:
        return jsonify({"error": "No search query provided"}), 400

    try:
        # הפעלת yt-dlp לקבלת כתובת סטרים מהתוצאה הראשונה לחיפוש
        command = ["yt-dlp", "--get-url", f"ytsearch1:{query}"]
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=15)
        if result.returncode != 0:
            return jsonify({"error": "Error running yt-dlp: " + result.stderr}), 500
        video_url = result.stdout.strip().split('\n')[0]
        return jsonify({"url": video_url})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # הפעלת השרת על כל הכתובות המקומיות ב-port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
