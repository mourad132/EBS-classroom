const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');
const { isDev } = require('../config/auth');


// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => {
	res.render("register")
})

// Register
router.post('/register', (req, res) => {
	  const { name, email, bio, password, password2, username, number, pass } = req.body;
  let errors = [];

  if (!name || !username || !email || !password || !password2 || !pass || !number ) {
    errors.push({ msg: 'Please enter all fields' });
  }	

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if(pass != "ebs-mourad14"){
	  errors.push({msg: "Registeration Password Is Not Valid, Please Contact The Developer To Get It"})
  }
  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }
  if (errors.length > 0) {
    res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
	  bio,
	  number,
	  username,
	  pass,
    type
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
	  username,
	  pass,
	  number,
    type
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
		  username,
		  number,
		photo: "974b774b2288748fb57c2668708493eb.jpg",
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
                console.log(`====> ${user.username} Just Registered`)
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }  
  });

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
  console.log(`====> ${req.user} Logged In`)
});

// Logout
router.get('/logout', (req, res) => {
  			req.logout();
  			res.redirect('/');
});

module.exports = router;
