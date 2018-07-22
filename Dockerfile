# specify the node base image with your desired version node:<version>
FROM node:8.9

# Copy source code
ADD . /app

# Change work directoy
WORKDIR /app

# install  dependencies
RUN npm install

# Launch application
CMD ["npm","start"]
