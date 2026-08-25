FROM node:20-alpine

WORKDIR /app

RUN npm config set registry https://mirror-npm.runflare.com

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/main"]