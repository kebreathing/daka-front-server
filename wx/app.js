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
app.get('/wxauth',function(req,res){
  // Exchange accesstoken with code
  var code = req.query.code;
  console.log("[用户登录] " + req.query.code + " at:" + (new Date()));

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
                // 存用户信息至服务器 : 查看用户是否存在
                request.get({ url: webconf.sql.URL_USERGET(info.openid) },function(error,response,body){
                  if(body==null || body.length ==0){
                    request.post({
                      url: webconf.sql.URL_USERSAVE(),
                      json: {
                        userId : json.openid,
                        nickname: json.nickname,
                        sex : json.sex,
                        city: json.city,
                        country: json.country,
                        headimgurl: json.headimgurl
                      }
                    },function(error,response,body){
                      if(!error && response.statusCode == 200) { console.log("用户信息已存."); }
                      else { console.log(error); }
                    });
                  } else {
                    console.log(body)
                  }  // END: request post user save
                }); // END: request get User

                // 获得用户信息，将信息存在session
                req.session.openid = info.openid;
                req.session.nickname = info.nickname;
                req.session.headimgurl = info.headimgurl;
                res.render('daka',{openid : json.openid,nickname : json.nickname,headimgurl: json.headimgurl});
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

// Test: WEB-ROOT_DIR, 渲染HTML带Paramaters
app.get('/',function(req,res){
  req.session.id = "gggg";
  request.post({
    url: webconf.sql.URL_USERSAVE(),
    json: {
      userId : "json.openid",
      nickname: "json.nickname",
      sex : "json.sex",
      city: "json.city",
      country: "json.country",
      headimgurl: "json.headimgurl"
    }
  },function(error,response,body){
    if(!error && response.statusCode == 200) { console.log("用户信息已存."); }
    else { console.log(response); }
  });
  res.render('index',{code : '12312'});
})


app.get('/jquery',function(req,res){
  res.render('daka',{openid : '1231232'});
})



// 0. 服务器启动
var server = app.listen(webconf.test_port,function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log("Front-Server is start at http://%s:%s",host,port);
});
