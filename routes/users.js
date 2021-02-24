var express = require('express');
var axios = require('axios');

var router = express.Router();

const {
  signup,
  login,
} = require("./controller/userController")

const { checkSignupInputIsEmpty } = require("./lib/checkSignup");
const { checkSignupDataType} = require("./lib/checkSignupDataType")
const { checkLoginEmptyMiddleware, checkEmailFormat } = require("./lib/checkLogin")

router.get('/create-user', function (req, res, next) {
  // res.render('sign-up');
  if(req.session.user) {
    res.redirect('home');
  } else {
    res.render('sign-up');
  }
});

router.get('/login', function (req, res, next) {
  // res.render('login');
  if(req.session.user) {
    res.redirect('home');
  } else {
    res.render('login');
  }
});

router.get('/home', async function (req, res, next) {
  if(req.session.user) {
    res.render("home", {user: req.session.user.email})
  } else {
    res.render('message', {error:true});
  }
});

router.post("/home", async function (req, res) {
  if(req.session.user) {
    try {
      let result = await axios.get(
        
        `http://api.openweathermap.org/data/2.5/weather?q=${req.body.search}&appid=${WEATHER_API_KEY}`
        
      );
      console.log(result.data);
      res.render("home", { data: result.data, user: req.session.user.email, city: req.body.search});
    } catch (e) {
      console.log(e)
      res.status(500).json({
        message: "failure",
        data: e.message,
      });
    }
  } else {
    res.render("message", {error:true})
  }
});

//sign-up post 
router.post("/create-user", checkSignupInputIsEmpty, checkSignupDataType, signup);

//login post 
router.post("/login", checkLoginEmptyMiddleware, checkEmailFormat, login);

router.get("/logout", function (req, res) {
  req.session.destroy();
  res.clearCookie("connect.sid", {
    path: "/",
    httpOnly: true,
    secure: false,
    maxAge: null,
  })
  res.redirect("login");
});

module.exports = router;