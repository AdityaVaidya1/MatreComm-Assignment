# Use the official Node.js image with your specified version as a base
FROM node:16.20.2

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port your app runs on
EXPOSE 2000

# Command to run your app
CMD ["npm", "start"]
