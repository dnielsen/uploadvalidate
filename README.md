# Upload and Validate
App to upload and validate images

### Dependencies

| Plugin | README |
| ------ | ------ |
| Node - v8+ LTS | [https://nodejs.org/][PlDb] |
| Redis | [https://redis.io/][PlGh] |
| aws-sdk | [https://www.npmjs.com/package/aws-sdk][PlGd] |

### Installation

App requires [Node.js](https://nodejs.org/) v8+ LTS to run.

Clone the repository.

```sh
$ git clone https://github.com/dnielsen/uploadvalidate.git
$ cd uploadvalidate
$ mkdir -p public/images/uploads
$ nano .env
```
##### .env File
Add following Environment variables and save the file.

```sh
PORT=(e.g 8080 - default:3000)
#aws s3 credentials
IAM_USER_KEY=YOUR_ACCESS_KEY_ID
IAM_USER_SECRET=YOUR_SECRET_ACCESS_KEY
BUCKET_NAME=YOUR_BUCKET_NAME
```
###### continue installation
Install the dependencies and start the server.
```sh
$ npm install
$ npm start
```
Now
Open in browser - [http://<YOUR_HOST>:<YOUR_PORT>][PlDb]