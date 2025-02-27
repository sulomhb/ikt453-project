# Use a lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start Vite development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
