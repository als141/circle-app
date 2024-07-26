# Use Node 20 alpine as base image
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the app
RUN npm run build

# Start a new stage for a smaller final image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install serve to run the application
RUN npm install -g serve

# Copy the build from the previous stage
# Note: Changed from /app/build to /app/dist
COPY --from=build /app/dist ./dist

# Expose the port the app runs on
EXPOSE 5173

# Serve the app
CMD ["serve", "-s", "dist", "-l", "5173"]