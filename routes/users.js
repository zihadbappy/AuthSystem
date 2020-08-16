var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/signup/', function(req, res, next) {
  res.render('signup',{title:'EZget | signup'});
});

router.get('/login/', function(req, res, next) {
  res.render('login',{title:'EZget | login'});
});

module.exports = router;