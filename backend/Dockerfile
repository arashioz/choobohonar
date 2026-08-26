FROM node:20-alpine

WORKDIR /app

ARG NPM_REGISTRY=https://mirror-npm.runflare.com
RUN npm config set registry "$NPM_REGISTRY"

COPY package*.json ./

RUN npm install --no-audit --no-fund || (npm config set registry https://registry.npmjs.org && npm install --no-audit --no-fund)

COPY . .

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/main"]
