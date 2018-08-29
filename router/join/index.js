var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var mysql = require('mysql')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

// DATABASE SETTING
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: '****',
  password: '****',
  database: 'jsman'
})
connection.connect()

router.get('/', function (req, res) {
  var msg;
  var errMsg = req.flash('error')
  if (errMsg) msg = errMsg;
  res.render('join.ejs', { 'message': msg });
})


//passport.serialize
passport.serializeUser(function (user, done) {
  console.log('passport session save : ', user.id)
  done(null, user.id)
});

passport.deserializeUser(function (id, done) {
  console.log('passport session get id: ', id)
  done(null, id);
})

passport.use('local-join', new LocalStrategy({
  usernameField: 'id',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, done) {
  var query = connection.query('select * from user where id=?', [req.body.id], function (err, rows) {
    if (err) return done(err);
    if (rows.length) {
      console.log('existed user')
      return done(null, false, { message: 'your email is already used' })
    } else {
      var crypto = require('crypto');
      var pwd = crypto.createHash('sha512').update(password).digest('base64');
      var body = req.body;
      var email = body.email;
      var gender = body.gender;
      var age = body.age;
      var name = body.name;
      var major = body.major;
      console.log(name, major, gender)
      var sql = { id: id, name: name, major: major, gender: gender, age: age, mail: email, pw: pwd };
      var query = connection.query('insert into user set ?', sql, function (err, rows) {
        if (err) throw err
        return done(null, { 'id': name });
      })
    }
  })
}
));

router.post('/', passport.authenticate('local-join', {
  successRedirect: '/main',
  failureRedirect: '/join',
  failureFlash: true
})
)

module.exports = router;
