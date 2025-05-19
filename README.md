# AbeTube Backend

שרת Python מבוסס Flask לצפייה וניהול סרטוני YouTube באמצעות API של pipedapi – ללא פרסומות וללא מפתח גוגל.

## 🔗 API Routes

| כתובת | תיאור |
|-------|--------|
| `/search?q=QUERY` | חיפוש סרטונים |
| `/video?id=VIDEO_ID` | מידע מלא על סרטון |
| `/suggestions?id=VIDEO_ID` | הצעות נוספות לסרטון |

## 🚀 הפעלה ב־Render
1. העלה פרויקט זה ל־GitHub
2. כנס ל־[Render.com](https://render.com/)
3. לחץ “New Web Service”
4. בחר את הריפו הזה
5. הגדרות:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python app.py`
   - **Port:** `8080`

---

בהצלחה! 🧠🎥
