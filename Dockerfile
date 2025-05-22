FROM node:18

# התקנת תוכנות נדרשות כולל yt-dlp
RUN apt-get update && \
    apt-get install -y curl python3 && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

# יצירת תיקיית עבודה
WORKDIR /app

# העתקת קבצי פרויקט
COPY package*.json ./
RUN npm install
COPY . .

# פתיחת פורט
EXPOSE 3000

# פקודת הפעלה
CMD ["npm", "start"]
