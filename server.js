const express = require('express');
const cors = require('cors');
const { YtDlpWrap } = require('yt-dlp-wrap');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());

const ytDlpWrap = new YtDlpWrap();

// הורדה לקובץ מקומי (או סטרימינג)
app.get('/download', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    // יוצרים שם זמני
    const fileName = `video_${Date.now()}.mp4`;
    const filePath = path.join(__dirname, fileName);
    const writeStream = fs.createWriteStream(filePath);

    ytDlpWrap.execStream([
      videoUrl,
      '-f', 'best[ext=mp4]/best',
      '-o', filePath
    ]).stdout.pipe(writeStream);

    writeStream.on('finish', () => {
      res.download(filePath, 'video.mp4', (err) => {
        fs.unlink(filePath, () => {}); // מוחק את הקובץ אחרי השליחה
      });
    });
  } catch (err) {
    res.status(500).json({ error: 'Download failed', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`AbeTube server running at http://localhost:${port}`);
});
