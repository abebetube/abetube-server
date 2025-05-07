const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// הגדרת התיקייה "public" לשירות קבצים סטטיים
app.use(express.static(path.join(__dirname, 'public')));

// הפניית ברירת מחדל לקובץ abetube.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'abetube.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
