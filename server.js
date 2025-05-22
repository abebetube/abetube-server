import express from 'express';
import cors from 'cors';
import { YtDlpWrap } from 'yt-dlp-wrap';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// קביעת נתיב לתיקיית הפרויקט
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// CORS לאפליקציית ה-Frontend
app.use(cors());

const ytDlpWrap = new YtDlpWrap();
const downloadsFolder = path.join(__dirname, 'downloads');

// יצירת התיקייה אם לא קיימת
if (!fs.existsSync(downloadsFolder)) {
  fs.mkdirSync(downloadsFolder);
}

app.get('/', (req, res) => {
  res.send('AbeTube Server is running!');
});

app.get('/download', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({ error: 'Missing video URL' });
  }

  const outputFile = path.join(downloadsFolder, `video-${Date.now()}.mp4`);

  const ytdlpEventEmitter = ytDlpWrap
    .exec([
      videoUrl,
      '-f',
      'mp4',
      '-o',
      outputFile
    ])
    .on('progress', progress => {
      console.log('Download progress:', progress.percent);
    });

  ytdlpEventEmitter.on('close', () => {
    res.download(outputFile, err => {
      if (err) {
        console.error('Download failed:', err);
        res.status(500).send('Download error');
      }
      // מחיקת הקובץ לאחר שליחה
      fs.unlink(outputFile, () => {});
    });
  });

  ytdlpEventEmitter.on('error', err => {
    console.error('Error:', err);
    res.status(500).send('yt-dlp error');
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
