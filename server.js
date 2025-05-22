/*
  פרויקט: שרת AbeTube
  תיאור: שרת API פשוט שמחזיר קישור ישיר לוידאו מיוטיוב בעזרת yt-dlp.
*/

import express from 'express';
import { YtDlpWrap } from 'yt-dlp-wrap';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const ytDlpWrap = new YtDlpWrap();

app.get('/', (req, res) => {
  res.send('ברוך הבא לשרת AbeTube!');
});

// קבלת URL של סרטון והחזרת הקישור הישיר
app.get('/api/get', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({ error: 'חסר פרמטר url' });
  }

  try {
    const output = await ytDlpWrap.execPromise([
      videoUrl,
      '-f', 'best[ext=mp4]',
      '-g'
    ]);
    res.json({ url: output.trim() });
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בעיבוד הוידאו', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`השרת רץ על http://localhost:${port}`);
});
