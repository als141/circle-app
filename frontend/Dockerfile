# Build stage
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

RUN npm install -g vite

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json .
COPY --from=build /app/vite.config.js .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]