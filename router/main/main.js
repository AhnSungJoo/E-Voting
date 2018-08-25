// main 역할 모듈화 
var express = require('express')
var app = express();
var router = express.Router()
var path = require('path') //상대경로를 쓸려구 

//main page는 login이 될 때만(세션정보가 있을 때만) 접근 가능
router.get('/',function(req,res){
    console.log('main js loaded',req.user)
    var id = req.user
    if(!id) res.render('login.ejs');
    res.render('main.ejs',{'id':id})
});

module.exports = router; //다른 곳으로 exports 해줌 