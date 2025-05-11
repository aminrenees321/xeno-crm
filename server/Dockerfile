# Stage 1: Build
FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env.production ./

# Install wait-for-it
RUN apk add --no-cache bash
ADD https://github.com/vishnubob/wait-for-it/raw/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

EXPOSE 5000
CMD ["sh", "-c", "./wait-for-it.sh mysql:3306 --timeout=30 --strict -- npm start"]