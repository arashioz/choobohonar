# Use the Debian-based slim image to avoid potential registry/Alpine-specific
# resolver issues during CI/build and to provide a more widely cached image.
FROM node:20-bullseye-slim
WORKDIR /app
COPY package*.json tsconfig*.json ./
RUN npm ci || npm install --production --no-audit --no-fund
COPY . .
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/main"]
