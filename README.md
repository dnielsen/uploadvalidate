# Upload Validate
Node.js app which uploads comments with images and lets user's validate image categories 

### App Dependencies

| Plugin | README |
| ------ | ------ |
| Node - v8+ LTS | [https://nodejs.org/] |
| Redis | [https://redis.io/] |
| aws-sdk | [https://www.npmjs.com/package/aws-sdk] |

### App Installation

App requires [Node.js](https://nodejs.org/) v8+ LTS to run.

Clone the repository.

```
$ git clone https://github.com/dnielsen/uploadvalidate.git
$ cd uploadvalidate
$ mkdir -p public/images/uploads
$ cp .env.default .env
$ nano .env
```
#### Create AWS S3 User
```
Create AWS Account. Create S3 User
Assign Priviledges to user
Add user to Bucket Policy

##### .env File
Copy `.env.default` to `.env` and add following Environment variables and save the file.

```
#### Create .env File

```
# SERVER SETTINGS
PORT=8080

# REDIS SETTINGS
REDIS_IP=localhost
REDIS_PORT=6379

# AWS S3 CREDENTIALS
IAM_USER_KEY=YOUR_ACCESS_KEY_ID
IAM_USER_SECRET=YOUR_SECRET_ACCESS_KEY
BUCKET_NAME=YOUR_BUCKET_NAME
```

#### Install the dependencies and start the server.
```
$ npm install
$ npm start
```

#### View in web browser 
```
[http://<YOUR_HOST>:<YOUR_PORT>]
```

#### To deploy this app in Kubernetes

Documentation for [Docker Swarm](/DOCKER-SWARM.md)

Documentation for [Docker Kubernetes](/DOCKER-KUBERNETES.md)

Documentation for [Google Cloud Kubernetes](/GOOGLE-CLOUD-KUBERNETES.md)
