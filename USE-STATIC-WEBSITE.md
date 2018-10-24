# Upload Validate
A Node.js app which lets users submit comments with images and then lets administrators validate image categories

### App Dependencies
```
Node - v8+ LTS (https://nodejs.org)
Redis - (http://redis.io/)
aws-sdk (uses S3 for Object Store) - (https://www.npmjs.com/package/aws-sdk)
```

App requires [Node.js](https://nodejs.org/) v8+ LTS to run.
```
$ brew install node // tested with v8.11.3
```
App requires Redis (http://redis.io/)
```
$ brew install redis // tested with v=4.9.105
```

#### Create Cloud Account

This project uses an object store to store files. Currently supported by AWS S3)

##### Use AWS S3 for Object Store

1. Create an AWS Account - https://aws.amazon.com/
2. Add IAM User - https://console.aws.amazon.com/iam/home#/users
```AWS access type = Programmatic access - with an access key
Permissions boundary = Permissions boundary is not set
Save User name (ex: ‘uvuser1’)
Save Access key ID (ex:AKIAIDS5VN36LDSQHYSQ1)
Save Secret access key (ex: 1L6xgbHVGbl0gVAHzC+DJkuDWxcaAlr1sUrKLXegN)
```
3. Add “AmazonS3FullAccess" permissions to your user.
```
Click “Users”, Your user name, the “Permissions” tab, then the “Add Permissions” button.
Then click “Attach Existing Policies Direction” and then add “AmazonS3FullAccess”
```
4. Create S3 bucket called ‘uploadvalidate’ - https://s3.console.aws.amazon.com/s3/
```
Accept all of the defaults
Click on ‘Permissions’ tab, then ‘Bucket Policy’ sub-tab. Click “Policy generator” link.
Add a new policy. Replace arn & Resource. Example:

{
    "Version": "2012-10-17",
    "Id": "Policy1532195484598",
    "Statement": [
        {
            "Sid": "Stmt1532195473162",
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "arn:aws:iam::1694891348995:user/uvuser1"
                ]
            },
            "Action": "s3:*",
            "Resource": "arn:aws:s3:::uploadvalidate"
        }
    ]
}

```

### Run Redis Server
Run Redis server in separate terminal window
```
$ redis-server
```

### App Installation

#### Clone the repository.

```
$ git clone https://github.com/dnielsen/uploadvalidate.git
$ cd uploadvalidate
```

#### API Installation

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
Make sure that `PORT` is 3000, because static HTML pages in website is using port 3000.

##### continue installation

Install the dependencies and start the server.
```
$ npm install // downloads/installs the latest packages for the dependencies in package.json
$ npm start // Runs node server.js.
```

#### Website Installation
(In separate terminal window open 'uploadvalidate' directory)
```
$ cd website
$ npm install serve
$ serve . 8080 // Serve Website
```

### View in web browser
```
[http://<YOUR_HOST>:<YOUR_PORT>/index.html] (ex: http://35.225.139.31:8080/index.html)
```
