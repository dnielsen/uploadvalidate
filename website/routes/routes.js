const fs = require('fs');
const path = require('path');
const request = require('request'); //importing Request - Simplified HTTP client package from npm to use it for sending POST request to API Server/Business Layer

const express = require('express');
var router = express.Router();

const http = require('http'); //importing core http module to use it to send web layer requests to API server/Business Layer
const endpointURL = `http://${process.env.API_IP}:${process.env.API_PORT}`; //API Server/Business Layer endpoint URL
const localImageDir = 'public/images/uploads/'; //Directory on web server where uploaded images will be stored temporarily

//Using Multer middle-ware to upload image files from the form temporarliy on the web server before sending them to the API server/Business Layer
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


/* GET home page */
router.get('/', function(req, res, next) {
  var responseData = '';
  //Using core http module to send request to and receive response from the API server/Business Layer
  http.get(endpointURL.concat('/'), (response) => {
    response.on('data', chunk => {
      responseData += chunk;
    });
    response.on('end', () => {
      try {
        responseData = JSON.parse(responseData);
        res.render('index', responseData);
      }
      catch (error) {
          console.error('Got error in parsing data:',error.message);
          throw error;
      }
    });
    response.on('error', (error) => {
      console.log('Got error in response:',error.message);
      throw error;
    });
  }).on('error', (error) => {
      console.log('Got error in http/https.get():',error.message);
      throw error;
  });
});


/* GET image upload page */
router.get('/upload', function(req, res, next) {
  var responseData = '';
  //Using core http module to send request to and receive response from the API server/Business Layer
  http.get(endpointURL.concat('/upload'), (response) => {
    response.on('data', chunk => {
      responseData += chunk;
    });
    response.on('end', () => {
      try {
        responseData = JSON.parse(responseData);
        res.render('upload', responseData);
      }
      catch (error) {
          console.error('Got error in parsing data:',error.message);
          throw error;
      }
    });
    response.on('error', (error) => {
      console.log('Got error in response:',error.message);
      throw error;
    });
  }).on('error', (error) => {
      console.log('Got error in http/https.get():',error.message);
      throw error;
  });
});


/* POST upload image and save its category  */
router.post('/uploadImage', upload.single("image"), function(req, res, next) {
  if (req.file != null && req.body != null) {
    var formData = {
      file: fs.createReadStream(req.file.path), //req.file.path contains the web server's directory path where the file is uploaded temporarily
      category: req.body.category
    };
    console.log(formData);
    //Using Request - Simplified HTTP client package from npm for making HTTP/HTTPS requests
    request.post({url: endpointURL.concat('/uploadImage'), formData: formData}, function(err, httpResponse, body) {
      var finalResponseData = '';
      if (err) {
        fs.unlink(req.file.path, (err) => { //delete the uploaded file from web server
          if(err)
            throw err;
        });
        return console.error('Upload failed:', err);
      }
      else {
        fs.unlink(req.file.path, (err) => { //delete the uploaded file from web server
          if(err)
            throw err;
        });
        finalResponseData = JSON.parse(body);
        res.render('upload', finalResponseData);
      }
    });
  }
});


/* GET image validation page */
router.get('/validate', function(req, res, next) {
  var responseData = '';
  //Using core http module to send request to and receive response from the API server/Business Layer
  http.get(endpointURL.concat('/validate'), (response) => {
    response.on('data', chunk => {
      responseData += chunk;
    });
    response.on('end', () => {
      try {
        responseData = JSON.parse(responseData);
        res.render('validate', responseData);
      }
      catch (error) {
          console.error('Got error in parsing data:',error.message);
          throw error;
      }
    });
    response.on('error', (error) => {
      console.log('Got error in response:',error.message);
      throw error;
    });
  }).on('error', (error) => {
      console.log('Got error in http/https.get():',error.message);
      throw error;
  });
});


/* POST validate existing image  */
router.post('/validate', function(req, res, next) {
  const options = {
    hostname: process.env.API_IP,
    port: process.env.API_PORT,
    path: '/validate',
    method: 'POST',
    json: true,
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }
  }
  //Using core http module to send request to and receive response from the API server/Business Layer
  const postRequest = http.request(options, (response) => {
    response.on('data', chunk => {
      //do nothing
    });
    response.on('end', () => {
      try {
        if(response.statusCode === 200) {
          res.redirect('/validate');
        }
        else {
          throw new error(res.body);
        }
      }
      catch (error) {
          console.error('Got error while receiving response:',error.message);
          throw error;
      }
    });
    response.on('error', (error) => {
      console.log('Got error in response:',error.message);
      throw error;
    });
  });
  postRequest.on('error', (error) => {
    console.error('Problem with the request:',error.message);
    throw error;
  });
  postRequest.write(JSON.stringify(req.body)); //sending a POST request to API server with the req data received via form on web server
  postRequest.end();
});


/* GET list of uploaded images */
router.get('/uploadedImages', function(req, res, next) {
  var responseData = '';
  //Using core http module to send request to and receive response from the API server/Business Layer
  http.get(endpointURL.concat('/uploadedImages'), (response) => {
    response.on('data', chunk => {
      responseData += chunk;
    });
    response.on('end', () => {
      try {
        responseData = JSON.parse(responseData);
        res.render('uploadedImages', responseData);
      }
      catch (error) {
          console.error('Got error in parsing data:',error.message);
          throw error;
      }
    });
    response.on('error', (error) => {
      console.log('Got error in response:',error.message);
      throw error;
    });
  }).on('error', (error) => {
      console.log('Got error in http/https.get():',error.message);
      throw error;
  });
});


/* GET list of validated images */
router.get('/validatedImages', function(req, res, next) {
  var responseData = '';
  //Using core http module to send request to and receive response from the API server/Business Layer
  http.get(endpointURL.concat('/validatedImages'), (response) => {
    response.on('data', chunk => {
      responseData += chunk;
    });
    response.on('end', () => {
      try {
        responseData = JSON.parse(responseData);
        res.render('validatedImages', responseData);
      }
      catch (error) {
          console.error('Got error in parsing data:',error.message);
          throw error;
      }
    });
    response.on('error', (error) => {
      console.log('Got error in response:',error.message);
      throw error;
    });
  }).on('error', (error) => {
      console.log('Got error in http/https.get():',error.message);
      throw error;
  });
});


module.exports = router;
