# Use Node.js 18 (LTS)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose Next.js port
EXPOSE 3000

# Run Next.js in development mode
CMD ["npm", "run", "dev"]