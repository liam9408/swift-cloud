# Use the official image as a parent image.
FROM node:16-alpine

RUN npm install --location=global npm:latest
RUN npm install --location=global nodemon

# Set the working directory.
WORKDIR /usr/src/app

# Copy the file from your host to your current location.
COPY package.json .

# Run the command inside your image filesystem.
RUN npm install

RUN npm install -g concurrently

# Add metadata to the image to describe which port the container is listening on at runtime.
EXPOSE 3000

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . ./

RUN npm run build

# Run Redis server and then start the specified command within the container.
CMD npm start
