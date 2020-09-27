var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
const passport = require('passport');
const randomstring = require('randomstring');
//  User Model
const User = require('../models/user');
const mailer = require('../misc/mailer');

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

        //genenrate secret token
        const secretToken = randomstring.generate({
          length: 8,
          charset: 'numeric'
        });
        newUser.secretToken= secretToken;

        //flag the accounts as inactive
        newUser.active=false;

        // Save user
        newUser.save()
        .then(user => {
          // compose an email
          const html = `Hello ${username},
          <br/>
          Thanks for registering! <br/><br/>
          Please verify your email by typing the following token:
          <br/>
          Token: <b>${secretToken}</b>
      
          <br/>
          on the following page:
          <a href="http://localhost:3000/users/verify"><b>Verify Email<b/></a>
          <br/>
          `;

        //Send email
        mailer.sendEmail('zihadbappy@hotmail.com',useremail, "Email Verification for EZGET", html)


          req.flash('success_msg', 'Account has been successfully created! Please cheack your email to verify');
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

//Verify email
router.get('/verify', (req, res, next)=> {
  res.render('verify');
});

router.post('/verify',async(req, res, next)=> {
  
  try{

    const {secretToken}= req.body;
    //find account that matches secret token
    const user= await User.findOne({'secretToken':secretToken});
    if(!user){
      req.flash('error', 'No user found');
      res.redirect('/users/verify');
      return;
    }
    user.active= true;
    user.secretToken='';
    await user.save();
  
    req.flash('success_msg', 'Email is verified. Now, you may login!'); 
    res.redirect('/users/login');
  }
  catch(error){
    next(error);
  }
});

// Logout Handle
router.get('/logout', (req, res)=>{
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});



module.exports = router;