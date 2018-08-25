var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var router = require('./router/index')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var session = require('express-session')
var flash = require('connect-flash')

//app.js 가 가벼워지고 있다. 
app.listen(3000, function() { //서버 띄우기
    console.log("server start ");
});

app.use(express.static('public')) //public이라는 디렉토리를 다 static으로 인식해라
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use(bodyParser.json()) //json으로 넘어올때
app.use(bodyParser.urlencoded({extende:true})) //json이외의 것으로 넘어올때 
app.set('view engine','ejs') //view engine을 ejs로 하겠다. 
app.use(session({//세션활성화
    secret : 'keyboard cat',
    resave : false,//세션저장여부
    saveUninitialized : true//세션이 저장되기 전에 uninitialize 상태로 만들어 저장
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(router) //path 없이 router만 사용 