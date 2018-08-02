# Upload Validate
A Node.js app which uploads comments with images and lets user's validate image categories 

### App Dependencies

| Plugin | README |
| ------ | ------ |
| Node - v8+ LTS | [https://nodejs.org/] |
| Redis | [https://redis.io/] |
| aws-sdk | [https://www.npmjs.com/package/aws-sdk] |

### App Installation

App requires [Node.js](https://nodejs.org/) v8+ LTS to run.

#### Create AWS S3 User

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

Clone the repository.

```
$ git clone https://github.com/dnielsen/uploadvalidate.git
$ cd uploadvalidate
$ mkdir -p public/images/uploads
$ cp .env.default .env 
$ nano .env //add following values to the .env file 
```

#### Add these values to the .env file

```
# SERVER SETTINGS
PORT=8080

# REDIS SETTINGS
REDIS_IP=localhost
REDIS_PORT=6379

# AWS S3 CREDENTIALS
IAM_USER_KEY=YOUR_ACCESS_KEY_ID // ex: AKIAIDS5VN36LDSQHYSQ1
IAM_USER_SECRET=YOUR_SECRET_ACCESS_KEY // ex: 1L6xgbHVGbl0gVAHzC+DJkuDWxcaAlr1sUrKLXegN
BUCKET_NAME=YOUR_BUCKET_NAME // ex: uploadvalidate
```

#### Install the dependencies and start the server.
```
$ redis-server
$ npm install
$ npm start
```

#### View in web browser 
```
[http://<YOUR_HOST>:<YOUR_PORT>] (ex: http://35.225.139.31:8080)
```


#### To deploy this app into a cluster/Kubernetes:

- Documentation for [Docker Swarm](/DOCKER-SWARM.md)
- Documentation for [Docker Kubernetes](/DOCKER-KUBERNETES.md)
- Documentation for [Google Cloud Kubernetes](/GOOGLE-CLOUD-KUBERNETES.md)

#### Clean-up
```
TBD
```
