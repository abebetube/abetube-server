import express from 'express';
import cors from 'cors';
import YtDlpWrap from 'yt-dlp-wrap';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;
const ytDlpWrap = new YtDlpWrap();

// כדי לטפל בנתיבים כשמשתמשים ב-ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// דוגמה: שליפת פרטי וידאו
app.get('/info', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ error: 'Missing URL' });

  try {
    const info = await ytDlpWrap.getVideoInfo(videoUrl);
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// דוגמה: הורדת וידאו
app.get('/download', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ error: 'Missing URL' });

  const outputPath = path.join(__dirname, 'video.mp4');
  const downloadProcess = ytDlpWrap.exec([
    videoUrl,
    '-f',
    'best',
    '-o',
    outputPath
  ]);

  downloadProcess.on('close', () => {
    res.download(outputPath, 'video.mp4', (err) => {
      if (!err) {
        fs.unlinkSync(outputPath); // מחיקת הקובץ אחרי השליחה
      }
    });
  });

  downloadProcess.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
