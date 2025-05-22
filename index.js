const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// הגדרת תיקיית הקבצים הסטטיים
app.use(express.static(path.join(__dirname, 'public')));

// הפניית כל הבקשות לקובץ ה-HTML הראשי
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'AbeTube Player.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
