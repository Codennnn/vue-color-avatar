# Use node:alpine3.17 image as the base image
FROM docker.io/node:alpine3.17

# Maintainer information
MAINTAINER tanwenyang@aliyun.com

# Copy the vue-color-avatar file from the local directory to the /app directory inside the container
COPY . /app

# Expose port 5173 of the container and allow external access to this port
EXPOSE 5173

# Change the working directory to /app
WORKDIR /app

# Set the Yarn registry to Taobao mirror and install dependencies using yarn install
RUN yarn config set registry 'https://registry.npm.taobao.org' && yarn install && yarn cache clean

# Run the command to start the container, which will run the project in development mode and listen on port 5173 of address 0.0.0.0
CMD yarn dev --host 0.0.0.0
