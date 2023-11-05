# Use an official Node.js runtime as a parent image
FROM node:18.14.0-alpine3.17

# Set the working directory in the container
WORKDIR /elgoog/frontend

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Build your Next.js application
RUN npm run build

# Expose the port that your Next.js application runs on
EXPOSE 3000

# Define the command to start your application
CMD ["npm", "start"]
