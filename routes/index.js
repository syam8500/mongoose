var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Myworld',err:req.query.invalid});
});
router.get("/login",function(req,res,next){
  res.render('login',{err:req.query.invalid });
})

module.exports = router;
