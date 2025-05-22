import express from 'express';
import pkg from 'yt-dlp-wrap';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const { YtdlpWrap } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const ytdlpWrap = new YtdlpWrap();

app.get('/download', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('Missing URL');
  }

  const outputFilePath = path.join(__dirname, 'output.mp4');
  try {
    const subprocess = ytdlpWrap.exec([
      url,
      '-f',
      'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4',
      '-o',
      outputFilePath
    ]);

    subprocess.once('close', (code) => {
      if (code === 0 && fs.existsSync(outputFilePath)) {
        res.download(outputFilePath, 'video.mp4', (err) => {
          fs.unlinkSync(outputFilePath);
        });
      } else {
        res.status(500).send('Download failed');
      }
    });
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
