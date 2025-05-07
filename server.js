const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;
const API_KEY = 'YOUR_YOUTUBE_API_KEY'; // תכניס את המפתח שלך

app.use(cors());

app.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).send('Missing query');

  try {
    const ytRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: API_KEY,
        part: 'snippet',
        type: 'video',
        q: query,
        maxResults: 5,
      }
    });

    const results = ytRes.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
    }));

    res.json(results);
  } catch (err) {
    res.status(500).send('YouTube API error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
