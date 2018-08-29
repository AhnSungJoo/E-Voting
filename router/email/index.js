function sendTo(address, id) {
    var nodemailer = require('nodemailer');
    var smtpPool = require('nodemailer-smtp-pool'); //smtp 서버를 사용하기 위한 모듈이다.
    var result = Math.floor(Math.random() * 10000000000) + 1;

    //nodemailer 의 createTransport는 transporter 객체를 만드는 메소드인데 
    //nodemailer-smtp-pool 객체 인스턴스가 이 메소드의 인자로 쓴다.

    var express = require('express')
    var router = express.Router()
    var mysql = require('mysql')
    console.log(address)
    //console.log("start")
    //var address = address;    

    // DATABASE SETTING
    var connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: '****',
        password: '****',
        database: 'jsman'
    })
    connection.connect()
    //console.log("db start")
    var smtpTransport = nodemailer.createTransport(smtpPool({
        service: 'Gmail',
        host: 'localhost',
        port: '3000',
        tls: {
            rejectUnauthorize: false
        },

        //이메일 전송을 위해 필요한 인증정보

        //gmail 계정과 암호 
        auth: {
            user: '****@gmail.com',
            pass: '****'
        },
        maxConnections: 500,
        maxMessages: 500
    }));

    var mailOpt = {
        from: '****@gmail.com',
        to: address,
        subject: '가톨릭대학교 전자투표 시스템 회원가입 인증번호 ',
        html: "인증번호: " + result + " 를 입력하세요<br>"
    }
    smtpTransport.sendMail(mailOpt, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log('Message send :' + mailOpt.to)
            //var sql = {id:mailOpt.to,keyValue:result};
            var sql = { id: id, keyValue: result };
            var query = connection.query('insert into ram set ?', sql, function (err, rows) {
                if (err) throw err
            })
        }
        console.log("mail start")
        smtpTransport.close();
    })
}
module.exports = sendTo;
