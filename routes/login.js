const { Router } = require('express');
const passport = require('passport');
const pool = require('../db');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const parseurl = require('parseurl');
const LocalStrategy = require('passport-local').Strategy;

//var baseUser = { id: 1, username: 'test', password: 'test'};
var baseUser;

const router = Router();

passport.use(new LocalStrategy(
  function(username, password, done) {
      baseUser = checkUser(username, password);
      console.log("hi " + baseUser);
      if (!baseUser) {return done(null, false); }
      //if (password != baseUser.password) {return done(null, false); }
      return done(null, baseUser);
    }
  )
);

function checkUser(username, password){
    pool.query('SELECT * FROM users WHERE username = $1', [username], (err, response) => {
      if (err) return next(err);
      if (!response.rows[0]) return false;
      if (response.rows[0].password != password) return false;
      console.log(response.rows[0]);
      return response.rows[0];
  });
}

router.use(session({
  secret: "test",
  resave: "false",
  saveUninitialized: "false"
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(cookieParser());

passport.serializeUser(function(user, done) {
  done(null, baseUser.id);
});

passport.deserializeUser(function(id, done) {
    if (id != baseUser.id) { return done(null, false); }
    done(null, baseUser);
});


router.use(function (req, res, next) {
  if (!req.session.views) {
    req.session.views = {};
  }

  var pathname = parseurl(req).pathname;

  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;
  console.log();
  console.log(req.session);
  next();
})

router.get('/foo', function (req, res, next) {
  res.send('Login failed, you viewed this page ' + req.session.views['/foo'] + ' times')
})


router.get('/bar', function (req, res, next) {
  //console.log(req.user);
  res.send('Login succeeded, you viewed this page ' + req.session.views['/bar'] + ' times')
})

router.post('/user', function (req, res, next) {
  const { username } = req.body; 
  console.log(req.body);

  //console.log(checkUser(username, "Password"));

  pool.query('SELECT * FROM users WHERE username = $1', [username], (err, response) => {
    if (err) return next(err);
    res.json(response.rows);
  });
})

router.post('/login', 
  passport.authenticate('local', { 
    failureRedirect: '/login/foo'}),
    function(err, req, res, next) {
      //console.log(err);
      res.redirect('/login/bar');
    }
);

module.exports = router;
