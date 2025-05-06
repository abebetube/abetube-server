const express = require('express');
const fetch = require('node-fetch');
const axios = require('axios');
const cors = require("cors");

const app = express();
app.use(cors());

// מסלול החיפוש
app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).send({ error: "Missing query" });

  try {
    const response = await axios.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
    const html = response.data;
    const jsonMatch = html.match(/var ytInitialData = (.*?);<\/script>/);

    if (!jsonMatch || jsonMatch.length < 2) {
      return res.status(500).send({ error: "ytInitialData not found" });
    }

    const json = JSON.parse(jsonMatch[1]);
    const videos = [];
    const contents = json.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents;
    const items = contents[0].itemSectionRenderer.contents;

    for (const item of items) {
      const video = item.videoRenderer;
      if (video) {
        videos.push({
          videoId: video.videoId,
          title: video.title.runs[0].text,
          thumbnail: video.thumbnail.thumbnails.pop().url
        });
      }
    }

    res.send({ videos });
  } catch (error) {
    console.error("Scraping error:", error.message);
    res.status(500).send({ error: "Failed to fetch or parse YouTube data" });
  }
});

// האזנה על כל הכתובת והמחשב
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Scraper server running on http://0.0.0.0:${PORT}`);
});
