/**
* Connect to wx server
*/
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var request = require('request');
var http = require('http');
var app = express();

// 微信配置
var wxconf = require('./conf/wx.js');
var webconf= require('./conf/web.js');

/**************设置POST*************************/
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

var ejs = require("ejs");
app.set("views",__dirname + "/views");
app.set("view engine", "html");
app.engine("html",ejs.__express);

app.use(express.static(__dirname + "/"));
app.use(cookieParser());
app.use(session({
  secret: 'jydaka20170101',
  name: 'jydaka',
  cookie: {maxAge : 300000 }, // 1000=1s, 60000=60s, 5mins
  resave: false,
  saveUninitialized: true,
}))

// A. WX server
app.get('/wxauth/daka',function(req,res){
  // Exchange accesstoken with code
  var code = req.query.code;
  console.log("[用户登录] " + req.query.code + " at:" + (new Date()));
  console.log("缓存信息：" + req.session)
  if(req.session.openid == null){
    // code -> Accesstoken
    if(code != null && code.length != 0)
    {
      request.get({url: wxconf.URL_AccessToken(code)},function(error,response,body){
        if(!error && response.statusCode == 200){
          var json = JSON.parse(body);
          // Accesstoken -> UserInfo
          request.get({
              url : wxconf.URL_UserInfo(json.access_token,json.openid)
            },function(error,response,body){
              if(!error && response.statusCode == 200){
                var info = JSON.parse(body);
                // 获得用户信息，将信息存在session
                req.session.openid = info.openid;
                req.session.nickname = info.nickname;
                req.session.headimgurl = info.headimgurl;
                console.log("先渲染 再存储")
                res.render('daka',{openid : info.openid,nickname : info.nickname,headimgurl: info.headimgurl});
                // 存用户信息至服务器 : 查看用户是否存在
                request.get({ url: webconf.sql.URL_USERGET(info.openid) },function(error,response,body){
                  if(body==null || body.length ==0){
                    if(info == null || info.length == 0) return;
                      request.post({
                        url: webconf.sql.URL_USERSAVE(),
                        json: {
                          userId : info.openid,
                          nickname: info.nickname,
                          sex : info.sex,
                          city: info.city,
                          country: info.country,
                          headimgurl: info.headimgurl
                        }
                      },function(error,response,body){
                        if(!error && response.statusCode == 200) { console.log("用户信息已存."); }
                        else { console.log("用户信息存储失败"); }
                      }); // END: request post user save
                    } else {
                      console.log("用户已存在");
                      return;
                    }
                }); // END: request get User
              }
            }); // End Request(2)
          }   // End If error
        }); // End Request(1)
    }     // End If Code == null
  }     // End Id req.session == null
  else {
    console.log("[用户信息] Req.session in");
    res.render('daka',{openid: req.session.openid, nickname:req.session.nickname,headimgurl: req.sessin.headimgurl});
  }
})

// 获得用户信息
app.get("/wxauth/daka/session",function(req,res){
  if(req.session.openid != null ){
    res.send({
      openid : req.session.openid,
      nickname: req.session.nickname,
      headimgurl: req.session.headimgurl
    });
  } else {
    res.send({
      openid: 1,
      nickname: "王董小秘书",
      headimgurl: "./../img/daka1/user-head.png"
    });
  } // END: get session
})

app.get("/sample",function(req,res){
  res.render('daka');
});

// 0. 服务器启动
var server = app.listen(webconf.test_port,function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log("Front-Server is start at http://%s:%s",host,port);
});
