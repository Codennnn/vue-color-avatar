# Use node as the builder image
FROM docker.io/node:alpine3.17 as builder

# Copy the vue-color-avatar file from the local directory to the /app directory inside the container
COPY . /app

# Change the working directory to /app
WORKDIR /app

# Set the Yarn registry to Taobao mirror and install dependencies using yarn install
RUN yarn config set registry 'https://registry.npmmirror.com' && yarn install && yarn cache clean

# Building the html code
RUN yarn build

# Using nginx for production
FROM docker.io/nginxinc/nginx-unprivileged:1.25.1-alpine

# Showing that port 8080 can be published
EXPOSE 8080

# Maintainer information
MAINTAINER tanwenyang@aliyun.com

# Copy html from previous stage
COPY --from=builder /app/dist /usr/share/nginx/html
