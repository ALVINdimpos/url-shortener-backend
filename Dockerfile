FROM node:14

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx tsc

EXPOSE 3000
CMD ["node", "dist/server.js"]
