var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var main = require('./main/main')
var email = require('./email/index')
var join = require('./join/index')
var login = require('./login/index')
var logout = require('./logout/index')
var mysql = require('mysql')
var connection = mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: '****',
      password: '****',
      database: 'jsman'
})
var result
//url routing
router.get('/', function (req, res) {
      var id = req.user;
      if (!req.user) res.render('login.ejs');
      else res.render('main.ejs', { 'id': id });

});

router.post('/join/', function (req, res) {
      console.log(req.body.address, req.body.value)
      var value = req.body.value
      if (value == 0) {
            email(req.body.address, req.body.id)
      }
      else if (value == 1) {
            console.log("check gogo")
            var id = req.body.id
            var key = req.body.keyvalue
            var ret
            var sql = 'select keyValue from ram where id=' + id + ' order by time DESC;'
            connection.query(sql, function (err, rows, fields) {
                  if (err) { console.log(err) }
                  console.log("db start")
                  ret = rows[0].keyValue
                  console.log(ret)
                  console.log("keyvalue " + key + " result " + ret)
                  if (key == ret) {
                        ret = true
                  }
                  else {
                        ret = false
                  }
                  console.log(ret)
                  res.send(ret)
            })
      }
      else if (value == 2) {
            console.log("id gogo")
            var id = req.body.id
            var ans
            var sql = 'select count(*) as count from user where id=' + id + ';'
            connection.query(sql, function (err, rows, fields) {
                  if (err) { console.log(err) }
                  console.log("db start")
                  ans = rows[0].count
                  console.log(ans)
                  if (ans >= 1) {
                        ans = true
                  }
                  else {
                        ans = false
                  }
                  console.log(ans)
                  res.send(ans)
            })
      }
      else if (value == 3) {
            console.log("finish gogo")
            console.log(req.body.address, req.body.id, req.body.password2, req.body.name,
                  req.body.age, req.body.gender, req.body.major)
            var id = req.body.id
            var address = req.body.address
            var crypto = require('crypto');
            var pwd = crypto.createHash('sha512').update(req.body.password2).digest('base64');
            var name = req.body.name
            var age = req.body.age
            var gender = req.body.gender
            var major = req.body.major
            var sql = { id: id, name: name, major: major, gender: gender, age: age, mail: address, pw: pwd };
            var query = connection.query('insert into user set ?', sql, function (err, rows) {
                  if (err) throw err
            })
      }

});

router.use('/main', main)
//router.use('/email', email)
router.use('/join', join)
router.use('/login', login)
router.use('/logout', logout)

module.exports = router;
