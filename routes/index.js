var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.render('sign-up', { title: 'Express' });
    res.send("This is default page")
});

module.exports = router;