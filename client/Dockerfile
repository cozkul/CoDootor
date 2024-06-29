# Dockerfile
# preferred node version chosen here
FROM node:20-alpine

# Create the directory on the node image
# where our Next.js app will live
RUN mkdir -p /client

# Set /client as the working directory in container
WORKDIR /client

# Copy package.json and package-lock.json
# to the /app working directory
COPY package*.json ./

# Install dependencies in /app
RUN npm install

# Copy the rest of our Next.js folder into /app
COPY . .

# Ensure port 8080 is accessible to our system
EXPOSE 8080

# Run dev, as we would via the command line
CMD npm run dev