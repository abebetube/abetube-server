const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/search', async (req, res) => {
  const query = req.query.q;
  
  if (!query) {
    return res.status(400).json({ error: "Missing search query" });
  }

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(youtubeSearchUrl);

    // מגרדים את ה-HTML
    const $ = cheerio.load(response.data);
    const videoList = [];

    // בודקים את כל הסרטונים בעמוד
    $('ytd-video-renderer').each((index, element) => {
      const title = $(element).find('#video-title').text();
      const videoId = $(element).find('#video-title').attr('href').split('=')[1];
      const thumbnail = $(element).find('#img').attr('src');
      
      videoList.push({
        id: videoId,
        title: title,
        thumbnail: thumbnail
      });
    });

    res.json(videoList);
  } catch (error) {
    console.error("Error scraping YouTube:", error);
    res.status(500).json({ error: "Error scraping YouTube" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
