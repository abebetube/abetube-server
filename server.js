// server.js
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/getVideo', (req, res) => {
  const videoId = req.query.id;
  if (!videoId) return res.status(400).json({ error: 'Missing video ID' });

  const cmd = `yt-dlp -g -f 'best[ext=mp4]' https://www.youtube.com/watch?v=${videoId}`;

  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
      return res.status(500).json({ error: 'Failed to fetch video URL' });
    }

    const url = stdout.trim();
    res.json({ url });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
