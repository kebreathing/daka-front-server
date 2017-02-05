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
var crypt = require('./conf/crypt.js');

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
  if(req.session.openid == null){
    // code -> Accesstoken
    if(code != null && code.length != 0)
    {
      // 获取Accesstoken
      request.get({url: wxconf.URL_AccessToken(code)},function(error,response,body){
        if(!error && response.statusCode == 200){
          var ask = JSON.parse(body);
          req.session.access_token = ask.access_token;
          // 验证用户信息： 分享功能 --> 获取ticket --> 缓存 --> 加密
          request.get({
            url: "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + wxconf.APPID + "&type=jsapi"
          },function(error,response,body){
            if(!error){
              // 查看ticket
              var tickets = JSON.parse(body)
              req.session.jsapi_ticket = tickets.ticket;
              // 获取用户信息
              request.get({
                url : wxconf.URL_UserInfo(json.access_token,json.openid)
              },
              function(error,response,body){
                if(!error && response.statusCode == 200){
                  var info = JSON.parse(body);
                  // 获得用户信息，将信息存在session
                  req.session.openid = info.openid;
                  req.session.nickname = info.nickname;
                  req.session.headimgurl = info.headimgurl;
                  res.render('daka',{
                    openid : info.openid,
                    nickname : info.nickname,
                    headimgurl: info.headimgurl
                  });

                  // 存用户信息至服务器 : 查看用户是否存在
                  request.get({
                    url: webconf.sql.URL_USERGET(info.openid)
                  },
                  function(error,response,body){
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
                          if(!error && response.statusCode == 200) {
                            console.log("用户信息已存.");
                          }
                          else {
                            console.log("用户信息存储失败");
                          }
                        }); // END: request post user save
                      } else {
                        return;
                      }
                  }); // END: request get User 保存用户信息
                }
              }); // End Request(2) 获取用户信息
            }
          }); // END: request get ticket
          }   // End If error
        }); // End Request(1)
    }     // End If Code == null
  }     // End Id req.session == null
  else {
    // 存在的话 还得重新获得加密
    // var cryptjson = crypt.sortAndCrypt(current_url,req.session.jsapi_ticket);
    res.render('daka',{
          openid: req.session.openid,
          nickname:req.session.nickname,
          headimgurl: req.sessin.headimgurl
        });
  }
})

/*
* Session 获取用户信息
*/
app.get("/wxauth/daka/session",function(req,res){
  var current_url = webconf.url + "/wxauth/daka";
  if(req.session.openid != null ){
    var cryptjson = crypt.sortAndCrypt(current_url,req.session.jsapi_ticket);
    res.send({
      openid : req.session.openid,
      nickname: req.session.nickname,
      headimgurl: req.session.headimgurl,
      timestamp: cryptjson.timestamp,
      nonceStr: cryptjson.nonceStr,
      signature: cryptjson.signature
    });
    
  } else {
    res.send({
      openid: 1,
      nickname: "王董小秘书",
      headimgurl: "./../img/daka1/user-head.png"
    });
  } // END: get session
})

/*
* 打卡样例查看
*/
app.get("/sample",function(req,res){
  res.render('daka');
});

/*
* 分享样例查看
*/
app.get("/share",function(req,res){
  // 如果参数不够 提示
  var params = req.query;
  if(params == null || params.length == 0) res.end("[参数有误]");
  if(params.openId == null || params.year == null || params.month == null)  res.end("[参数有误]");
  res.render('share',{openid: params.openId, year:params.year, month:params.month});
});

// 0. 服务器启动
var server = app.listen(webconf.test_port,function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log("Front-Server is start at http://%s:%s",host,port);
});
