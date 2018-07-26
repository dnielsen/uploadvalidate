# Upload and Validate
Node.js app to upload and validate images using Express.js

Documentation for [Docker Swarm](/DOCKER-SWARM.md)

Documentation for [Docker Kubernetes](/DOCKER-KUBERNETES.md)

### Dependencies

| Plugin | README |
| ------ | ------ |
| Node - v8+ LTS | [https://nodejs.org/] |
| Redis | [https://redis.io/] |
| aws-sdk | [https://www.npmjs.com/package/aws-sdk] |

### Installation

App requires [Node.js](https://nodejs.org/) v8+ LTS to run.

Clone the repository.

```
$ git clone https://github.com/dnielsen/uploadvalidate.git
$ cd uploadvalidate
$ mkdir -p public/images/uploads
$ nano .env
```
##### AWS S3 User
```
Create AWS S3 User
Assign Priviledges to user
Add user to Bucket Policy

##### .env File
Copy `.env.default` to `.env` and add following Environment variables and save the file.

```
# Server Credentials
PORT=8080
REDIS_IP=localhost
REDIS_PORT=6379

#aws s3 credentials
IAM_USER_KEY=YOUR_ACCESS_KEY_ID
IAM_USER_SECRET=YOUR_SECRET_ACCESS_KEY
BUCKET_NAME=YOUR_BUCKET_NAME
```
###### continue installation
Install the dependencies and start the server.
```
$ npm install
$ npm start
```
Now Open in browser - [http://<YOUR_HOST>:<YOUR_PORT>]
