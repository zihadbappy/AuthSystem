var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

//  User Model
const Newuser = require('../models/Newuser');


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

  const {newusername, newuseremail, newuserpass, confirmuserpass} = req.body;
  var errors = [];
  // Check Required Fields
  if(!newusername || !newuseremail || !newuserpass || !confirmuserpass)
  errors.push({msg:'Please fill in all fields!'});

  // Check if passwords match
  if(newuserpass !== confirmuserpass)
  errors.push({msg:'Passwords do not match!'});

  //Check Pass Length
  if(newuserpass.length<6)
  errors.push({msg:'Password should be at least 6 characters long!'});

  if(errors.length > 0){
    res.render('signup',{
      errors,
      newusername,
      newuseremail,
      newuserpass,
      confirmuserpass
    });
  }
  else{
   Newuser.findOne({ newuseremail: newuseremail})
   .then(user => {
      if(user){
        // User exists
        errors.push({msg:'Email is already registered!'});
        res.render('signup',{
          errors,
          newusername,
          newuseremail,
          newuserpass,
          confirmuserpass
      });
    }
    else{
      const User = new Newuser({
        newusername,
        newuseremail,
        newuserpass
      });

      //Hash Password
      bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(User.newuserpass, salt, (err, hash) =>{
       // if(err) throw err;
        
        //Set pass to hash
        User.newuserpass = hash;

        // Save user
        User.save()
        .then(user => {
          res.redirect('/users/login');
        })
        .catch(err => console.log(err));
      }))


    }

   });
   // res.send('pass');
  }
});
module.exports = router;