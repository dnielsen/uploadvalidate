# Upload and Validate
App to upload and validate images

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
```

### API Installation

```
$ cd api
$ nano .env
```
##### .env File

Copy `.env.default` to `.env` and add following Environment variables and save the file.

```
# Server Credentials
PORT=3000
REDIS_IP=localhost
REDIS_PORT=6379
REDIS_PASSWORD=YOUR_REDIS_PASSWORD

#aws s3 credentials
IAM_USER_KEY=YOUR_ACCESS_KEY_ID
IAM_USER_SECRET=YOUR_SECRET_ACCESS_KEY
BUCKET_NAME=YOUR_BUCKET_NAME
```
##### continue installation

Install the dependencies and start the server.
```
$ npm install
$ npm start
```

### Website Installation

```
$ cd website
$ nano .env
```
##### .env File

Copy `.env.default` to `.env` and add following Environment variables and save the file.

```
# Server Credentials
PORT=8080
API_IP=localhost
API_PORT=3000
```
##### continue installation

Install the dependencies and start the server.
```
$ npm install
$ npm start
```

Now Open in browser - [http://<YOUR_HOST>:<YOUR_PORT>]
