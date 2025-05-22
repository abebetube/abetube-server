const express = require('express');
const cors = require('cors');
const YTDlpWrap = require('yt-dlp-wrap');

const app = express();
const port = process.env.PORT || 3000;

const ytDlpWrap = new YTDlpWrap();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('AbeTube Server is running');
});

app.post('/get-video-url', async (req, res) => {
  const videoUrl = req.body.url;

  if (!videoUrl) {
    return res.status(400).json({ error: 'Missing video URL' });
  }

  try {
    let jsonOutput = '';

    const process = ytDlpWrap.exec([
      '-j',
      videoUrl
    ]);

    process.stdout.on('data', (data) => {
      jsonOutput += data.toString();
    });

    process.stderr.on('data', (data) => {
      console.error('stderr:', data.toString());
    });

    process.on('close', () => {
      try {
        const videoInfo = JSON.parse(jsonOutput);
        const bestFormat = videoInfo.formats?.find(f => f.ext === 'mp4' && f.acodec !== 'none' && f.vcodec !== 'none');

        if (bestFormat?.url) {
          res.json({ url: bestFormat.url });
        } else {
          res.status(500).json({ error: 'Failed to extract video URL' });
        }
      } catch (err) {
        console.error('JSON parse error:', err);
        res.status(500).json({ error: 'Failed to parse video info' });
      }
    });

  } catch (error) {
    console.error('Error running yt-dlp:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
