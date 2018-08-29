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
	res.render('login.ejs', { 'message': msg });
})

//passport.serialize
passport.serializeUser(function (id, done) {
	console.log('passport session save : ', id)
	done(null, id)
});

passport.deserializeUser(function (id, done) {
	console.log('passport session get id: ', id)
	done(null, id);
})

passport.use('local-login', new LocalStrategy({
	usernameField: 'id',
	passwordField: 'password',
	passReqToCallback: true//세션에 저장여부..?
}, function (req, id, password, done) {
	console.log("Hello")
	var query = connection.query('select * from user where id=?', [id], function (err, rows) {
		if (err) return done(err);

		var crypto = require('crypto');
		var pwd = crypto.createHash('sha512').update(password).digest('base64');
		if (rows.length && pwd == rows[0].pw) {
			console.log("Hi")
			return done(null, { 'id': id })
		} else {
			console.log("no")
			return done(null, false, { 'message': 'Incorrect id or password' })
		}
	})
}
));

router.post('/', function (req, res, next) {
	passport.authenticate('local-login', function (err, user, info) {
		if (err) res.status(500).json(err);
		if (!user) return res.status(401).json(info.message);

		req.logIn(user, function (err) {
			if (err) { return next(err); }
			return res.json(user);
		});

	})(req, res, next);
})

module.exports = router; 
