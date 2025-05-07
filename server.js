const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// שליחת abetube.html כשמבקשים את דף הבית
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'abetube.html'));
});

app.listen(port, () => {
  console.log(`השרת פועל על פורט ${port}`);
});
