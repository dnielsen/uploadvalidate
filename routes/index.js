const express = require('express');
const redis = require('redis');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
});
const upload = multer({storage: storage});

var router = express.Router();

const redisClient = redis.createClient(); //default port : 6379

//previous uploaded image
let lastImage = null;
let lastVerifiedImage = null;

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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Upload Image', categories: [1,2,3,4,5,6,7,8,9,10] });
});

router.post('/',upload.single('image'), function(req, res, next) {
  
  redisClient.hset(`image:${req.file.originalname}`, 'categoryID', `${req.body.category}`, redis.print);
  redisClient.hdel(`image:${req.file.originalname}`, 'rating', redis.print); // delete rating
  
  redisClient.hmget(`image:${req.file.originalname}`, 'previous', 'next', (error, reference) => {
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

    if(lastImageCopy != null && lastImageCopy !== req.file.originalname){
      //update previous node's previous ref
      redisClient.hset(`image:${lastImageCopy}`, 'previous', `${req.file.originalname}`, redis.print);
      //update the current node
      redisClient.hmset(`image:${req.file.originalname}`, 'next', lastImageCopy, redis.print);
      // remove previous ref 
      redisClient.hdel(`image:${req.file.originalname}`, 'previous', redis.print);
    }
    if(lastVerifiedImage === null){
      lastVerifiedImage = req.file.originalname; //update last verified image
    }
    else if(lastVerifiedImage === req.file.originalname && reference[0] !== null){
      lastVerifiedImage = reference[0]; //update last verified image
    }
    redisClient.set('lastVerifiedImage', lastVerifiedImage, redis.print); //persist
    
    lastImage = req.file.originalname; //update last uploaded image
    redisClient.set('lastImage', lastImage, redis.print); //persist

    res.render('index', { title: 'Upload Successfull', categories: [1,2,3,4,5,6,7,8,9,10], imageName: req.file.originalname, category: req.body.category });
  });
});

/** GET validation page */
router.get('/validate', function(req, res, next) {
  redisClient.hget(`image:${lastVerifiedImage}`, 'categoryID', (error, category) => {
    if(error)
      throw error;

    if(category != null){
      res.render('validate', { title: 'Rate Image', categories: [1,2,3,4,5,6,7,8,9,10], imageName: lastVerifiedImage, category: category });
    }else{
      // no more images to validate
      res.render('validate', { title: 'Rate Image', categories: [1,2,3,4,5,6,7,8,9,10]});
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

module.exports = router;
