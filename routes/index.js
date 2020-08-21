var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'EZget'});
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, function(req, res, next) {
  res.render('dashboard',{title:'EZget | dashboard', name: req.user.username});
});

module.exports = router;
