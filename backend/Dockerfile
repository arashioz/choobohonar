FROM node:20-alpine

WORKDIR /app

ARG NPM_REGISTRY=https://mirror-npm.runflare.com
RUN npm config set registry "$NPM_REGISTRY" \
  && npm config set fetch-retries 2 \
  && npm config set fetch-retry-mintimeout 1000 \
  && npm config set fetch-retry-maxtimeout 5000 \
  && npm config set fetch-timeout 120000

COPY package*.json ./

RUN npm install --no-audit --no-fund

COPY . .

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/main"]
