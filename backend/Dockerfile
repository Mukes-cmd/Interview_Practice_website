
FROM node:22-bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y chromium \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
