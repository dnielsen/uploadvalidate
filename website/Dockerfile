# specify the node base image with your desired version node:<version>
FROM node:8.9

# Copy source code
ADD . /website

# Change work directoy
WORKDIR /website

# install  dependencies
RUN npm install

# Launch application
CMD ["npm","start"]
