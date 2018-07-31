const _config = require('../config');

const express = require('express');
const redis = require('redis');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const localImageDir = 'public/images/uploads/';

//Using Multer middle-ware to upload image files from the form
const multer = require('multer');
const storage = multer.diskStorage({
    //destination is used to determine within which folder the uploaded files should be stored
    destination: (req, file, cb) => {
      cb(null, localImageDir)
    },
    //filename is used to determine what the file should be named inside the folder
    filename: (req, file, cb) => {
      let tempName = file.originalname;
      tempName = tempName.replace(/\s+/g, '-').toLowerCase();
      //checking if the file with the same name already exists or not
      fs.access(localImageDir + tempName, fs.constants.F_OK, function(error) {
        if (error) {
          if(error.code === 'ENOENT') { //file does not exist
            let finalFileName = tempName;
            cb(null, finalFileName);
          }
          else {
            console.error("Error checking existence of file in default directory:",error);
          }
        }
        else { //file exists, rename file
          let tempFileName = path.basename(localImageDir + tempName, path.extname(tempName)); //Stripping the file's extension
          let finalFileName = tempFileName.concat("-" + Date.now() + path.extname(tempName));
          cb(null, finalFileName);
        }
      })
    }
});
const upload = multer({storage: storage});


/**
 * Redis setup
 */

const redisClient = redis.createClient({host : process.env.REDIS_IP, port : process.env.REDIS_PORT}); //default port : 6379
//redis connection
redisClient.on('connect', () => {
  console.log('Redis client connected');
  redisClient.get('lastImage', (error, imageName) => {
    if(error)
      throw error;

    if(imageName != null)
      lastImage = imageName; // last uploaded image
  });
  redisClient.get('lastVerifiedImage', (error, imageName) => {
    if(error)
      throw error;

    if(imageName != null)
      lastVerifiedImage = imageName; // last verified image
  });
});
redisClient.on('error', error => console.log('Redis client error: ' + error));


/**
* Upload file to AWS S3
*/
function uploadToS3(req, res, next) {
  let file = req.file;
  fs.readFile(file.path, function (err, data) {
    if (err) throw err; // Something went wrong!


    let s3bucket = new AWS.S3({
      accessKeyId: _config.aws.IAM_USER_KEY,
      secretAccessKey: _config.aws.IAM_USER_SECRET,
      Bucket: _config.aws.BUCKET_NAME,
    });

    s3bucket.createBucket(function () {
      var params = {
       Bucket: _config.aws.BUCKET_NAME,
       Key: file.filename,
       Body: data,
       ContentType: file.mimetype,
       ACL: "public-read"
      };
      s3bucket.upload(params, function (err, data) {
       if (err) {
        throw err;
       }
       req.file.s3 = data.Location; //s3
       next();
      });
    });
  });
 }

//previously uploaded image
let lastImage = null;
let lastVerifiedImage = null;

var router = express.Router();

/* GET home page */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to Upload Validate'});
});

/* GET image upload page */
router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Upload Image & Category', categories: [1,2,3,4,5,6,7,8,9,10] });
});

/* POST upload image and save its category */
router.post('/uploadImage', upload.single('image'), uploadToS3, function(req, res, next) {
  redisClient.hset(`image:${req.file.filename}`, 'categoryID', `${req.body.category}`, redis.print);
  if(req.file.s3){
    redisClient.hset(`image:${req.file.filename}`, 's3', `${req.file.s3}`, redis.print);
  }
  redisClient.sadd('uploaded', `image:${req.file.filename}`); //add the uploaded image in a list of images uploaded so far
  redisClient.hmget(`image:${req.file.filename}`, 'previous', 'next', (error, reference) => {
    if(error)
      throw error;

    let nodeType = 'new';
    let lastImageCopy = lastImage;

    if(reference[0] === null && reference[1] !== null)
      nodeType = 'first';
    else if(reference[0] !== null && reference[1] === null)
      nodeType = 'last';
    else if(reference[0] !== null && reference[1] !== null)
      nodeType = 'middle';

    switch(nodeType){
      case 'new':
        //all good here
      break;
      case 'first':
        //all good here
      break;
      case 'middle':
        // previous[next -> ref(update)] <- [previous]current node
        redisClient.hset(`image:${reference[0]}`, 'next', reference[1], redis.print);
        // current node[next] -> next[previous -> ref(update)]
        redisClient.hset(`image:${reference[1]}`, 'previous', reference[0], redis.print);
      break;
      case 'last':
        // previous[next -> ref(update)] <- [previous]current node
        redisClient.hdel(`image:${reference[0]}`, 'next', redis.print);
      break;
    }

    if(lastImageCopy != null && lastImageCopy !== req.file.filename){
      //update previous node's previous ref
      redisClient.hset(`image:${lastImageCopy}`, 'previous', `${req.file.filename}`, redis.print);
      //update the current node
      redisClient.hmset(`image:${req.file.filename}`, 'next', lastImageCopy, redis.print);
      // remove previous ref
      redisClient.hdel(`image:${req.file.filename}`, 'previous', redis.print);
    }
    if(lastVerifiedImage === null){
      lastVerifiedImage = req.file.filename; //update last verified image
    }
    else if(lastVerifiedImage === req.file.filename && reference[0] !== null){
      lastVerifiedImage = reference[0]; //update last verified image
    }
    redisClient.set('lastVerifiedImage', lastVerifiedImage, redis.print); //persist

    lastImage = req.file.filename; //update last uploaded image
    redisClient.set('lastImage', lastImage, redis.print); //persist
    res.render('upload', { title: 'Upload Successfull', categories: [1,2,3,4,5,6,7,8,9,10], imageName: req.file.filename, s3: req.file.s3, category: req.body.category });
  });
});

/** GET image validation page */
router.get('/validate', function(req, res, next) {
  redisClient.hmget(`image:${lastVerifiedImage}`, 'categoryID', 's3', (error, data) => {
    if(error)
      throw error;

    if(data[0] != null){
      res.render('validate', { title: 'Validate Image Category', categories: [1,2,3,4,5,6,7,8,9,10], imageName: lastVerifiedImage, s3: data[1], category: data[0] });
    }else{
      // no more images to validate
      res.render('validate', { title: 'Validate Image Category (no images)', categories: [1,2,3,4,5,6,7,8,9,10]});
    }
  });
});

router.post('/validate', function(req, res, next) {
  let imageName = req.body.image;
  let rating = req.body.rating;

  if(imageName !== lastVerifiedImage)
    throw new Error('Unrated Image mis-match, try again');

  // update image rating
  redisClient.hset(`image:${imageName}`, 'rating', rating, redis.print);
  redisClient.sadd('validated', `image:${imageName}`); //add the validated image in a list of images validated so far
  // update last verified image
  redisClient.hget(`image:${lastVerifiedImage}`, 'previous', (error, reference) => {
    if(error)
      throw error;

    if(reference !== null){
      // has next validated image
      lastVerifiedImage = reference; //update last verified image
      redisClient.set('lastVerifiedImage', lastVerifiedImage, redis.print); //persist
    }else{
      //no more images to validate
      redisClient.del('lastVerifiedImage', redis.print);
      lastVerifiedImage = null;
    }
    res.redirect('/validate');
  });
});

/* GET list of uploaded images */
router.get('/uploadedImages', function(req, res, next) {
  redisClient.smembers('uploaded', (error, data) => {
    if(error) {
      throw error;
    }

    if(data.length > 0) {
    var imageKeys = data;
    var images = [];
    var imageCategories = [];
    var imagePaths = [];
    var serialNo = [];
    for(i = 0; i < imageKeys.length; i++) {
      if(imageKeys[i] != null) {
        images.push((imageKeys[i].split(":"))[1]);
        serialNo.push(i);
      }
      else {
        images.push("-");
        serialNo.push(i);
      }
    }
    var i = 0, j = 0;
    for(; i < data.length; i++) {
      redisClient.hmget(`${data[i]}`, 'categoryID', 's3', (error, data) => {
        if(data.length > 1) {
          if(data[0] != null) {
            imageCategories.push(data[0]);
          }
          if(data[1] != null) {
            imagePaths.push(data[1]);
          }
        }
        if(j === (images.length - 1)) {
          res.render('uploadedImages', {title: 'List of Uploaded Images', listExists: "true", srNo: serialNo, imageNames: images, categories: imageCategories, paths: imagePaths});
        }
        j++;
      });
    }
  }
  else {
    res.render('uploadedImages', {title: 'List of Uploaded Images'});
  }
  });
});

/* GET list of validated images */
router.get('/validatedImages', function(req, res, next) {
  redisClient.smembers('validated', (error, data) => {
    if(error) {
      throw error;
    }

    if(data.length > 0) {
      var imageKeys = data;
      var images = [];
      var imageCategories = [];
      var imagePaths = [];
      var imageRatings = [];
      var serialNo = [];
      for(i = 0; i < imageKeys.length; i++) {
        if(imageKeys[i] != null) {
          images.push((imageKeys[i].split(":"))[1]);
          serialNo.push(i);
        }
        else {
          images.push("-");
          serialNo.push(i);
        }
      }
      var i = 0,  j = 0;
      for(; i<data.length; i++) {
        redisClient.hmget(`${data[i]}`, 'categoryID', 's3', 'rating', (error, data) => {
          if(data.length > 1) {
            if(data[0] != null) {
              imageCategories.push(data[0]);
            }
            if(data[1] != null) {
              imagePaths.push(data[1]);
            }
            if(data[2] != null) {
              imageRatings.push(data[2]);
            }
          }
          if(j === (images.length - 1)) {
            res.render('validatedImages', {title: 'List of Validated Images', listExists: "true", srNo: serialNo, imageNames: images, categories: imageCategories, paths: imagePaths, ratings: imageRatings});
          }
          j++;
        });
      }
    }
    else {
      res.render('validatedImages', {title: 'List of Validated Images'});
    }
  });
});

module.exports = router;
