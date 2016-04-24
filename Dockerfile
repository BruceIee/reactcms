# Dockerfile for creating docker image
FROM node
MAINTAINER leapon

# Add files to the image
RUN mkdir -p /opt/nodejs
ADD . /opt/nodejs
WORKDIR /opt/nodejs

# Install the dependencies modules
RUN npm install

# Expose environment variables
ENV REACTCMS_PORT=8005

# Expose the container port
EXPOSE 8005

ENTRYPOINT ["npm", "start"]

