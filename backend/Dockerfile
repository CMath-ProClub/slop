# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Create directories for uploads and processed videos
RUN mkdir -p uploads processed

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
