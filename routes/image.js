var express = require('express');
var route = express.Router();
var mongoose = require('mongoose');
var { ensureAuthenticated } = require('../config/auth');

// IMAGE Route @GET
// @desc Display Image
route.get('/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
  
      // Check if image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
          readstream.pipe(res)
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });

module.exports = route
