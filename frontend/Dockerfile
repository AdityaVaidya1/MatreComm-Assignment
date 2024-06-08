# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install cross-env globally
#RUN npm install -g cross-env

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

Expose 3000
# Specify the command to run the application
CMD ["npm", "start"]

