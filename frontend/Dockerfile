FROM node:20-bullseye-slim
WORKDIR /app
COPY package*.json next.config.mjs tsconfig.json ./
# Install build tools required by some native npm modules, then install dependencies
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ build-essential \
  && rm -rf /var/lib/apt/lists/* \
  && npm ci --omit=dev --silent
COPY . .
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm","start"]
