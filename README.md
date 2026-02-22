FROM node:20-alpine

WORKDIR /app

# Install dependencies for better-sqlite3 and canvas
RUN apk add --no-cache python3 make g++ sqlite-dev

COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled JS (or compile here)
COPY . .
RUN npm run build 2>/dev/null || true

# Create data and temp directories
RUN mkdir -p data temp

EXPOSE 3000

CMD ["node", "dist/index.js"]
