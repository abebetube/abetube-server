# בסיס מ־Node
FROM node:18

# התקן yt-dlp
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install yt-dlp

# צור תיקייה לאפליקציה
WORKDIR /app

# העתק קבצים
COPY package*.json ./
RUN npm install
COPY . .

# הגדר פורט
EXPOSE 3000

# פקודת הרצה
CMD ["npm", "start"]
