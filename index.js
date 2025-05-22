const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// הגדרת תיקיית הקבצים הסטטיים
app.use(express.static(path.join(__dirname, 'public')));

// הפניית כל הבקשות לקובץ ה-HTML הראשי
app.get('*', (req, res) => {
res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


const express = require('express');
const { YouTubeSearchApi } = require('youtube-search-api');
const app = express();

app.use(express.static('public'));

app.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  try {
    const results = await YouTubeSearchApi.GetListByKeyword(query, false, 10);
    // results.items הוא מערך של סרטונים, פלייליסטים וכו׳
    // נשלח רק סרטונים
    const videos = results.items
      .filter(item => item.type === 'video')
      .map(video => ({
        videoId: video.id,
        title: video.title,
        thumbnail: video.bestThumbnail.url
      }));
    res.json(videos);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Search failed' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
