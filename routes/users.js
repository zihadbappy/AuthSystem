var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
const passport = require('passport');
//  User Model
const User = require('../models/user');


/* GET users listing. */
router.get('/signup', function(req, res, next) {
  res.render('signup',{title:'EZget | signup'});
});

router.get('/login', function(req, res, next) {
  res.render('login',{title:'EZget | login'});
});

// Register Handle
router.post('/signup', function(req, res){
  console.log(req.body)

  const {username, useremail, userpass, confirmuserpass} = req.body;
  var errors = [];
  // Check Required Fields
  if(!username || !useremail || !userpass || !confirmuserpass)
  errors.push({msg:'Please fill in all fields!'});

  // Check if passwords match
  if(userpass !== confirmuserpass)
  errors.push({msg:'Passwords do not match!'});

  //Check Pass Length
  if(userpass.length<6)
  errors.push({msg:'Password should be at least 6 characters long!'});

  if(errors.length > 0){
    res.render('signup',{
      errors,
      username,
      useremail,
      userpass,
      confirmuserpass
    });
  }
  else{
   User.findOne({ useremail: useremail})
   .then(user => {
      if(user){
        // User exists
        errors.push({msg:'Email is already registered!'});
        res.render('signup',{
          errors,
          username,
          useremail,
          userpass,
          confirmuserpass
      });
    }
    else{
      const newUser = new User({
        username,
        useremail,
        userpass
      });

      
      //Hash Password
      bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(newUser.userpass, salt, (err, hash) =>{
       // if(err) throw err;
        
        //Set pass to hash
        newUser.userpass = hash;

        // Save user
        newUser.save()
        .then(user => {
          req.flash('success_msg', 'Account has been successfully created! Log In to continue');
          res.redirect('/users/login');
        })
        .catch(err => console.log(err));
      }))


    }

   });
  
  }
});



// Login Handle
router.post('/login',(req, res, next)=>{
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});


// Logout Handle
router.get('/logout', (req, res)=>{
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});



module.exports = router;