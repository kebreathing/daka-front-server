/**
* Connect to wx server
*/
var express = require('express');
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

// A. WX server
app.get('/wxauth',function(req,res){
  // Exchange accesstoken with code
  var code = req.query.code;
  console.log("User is coming! " + req.query.code + " at:" + (new Date()));

  // code -> Accesstoken
  if(code != null && code.length != 0)
  {
    request.get({
      url: wxconf.URL_AccessToken(code),
    },function(error,response,body){
      if(!error && response.statusCode == 200){
        var json = JSON.parse(body);
        console.log("User" + openid + "'s token: " + json.access_token);
        // Accesstoken -> UserInfo
        request.get({
          url : wxconf.URL_UserInfo(json.access_token,json.openid)
        },function(error,response,body){
          if(!error && response.statusCode == 200){
            var userinfo = JSON.parse(body);
            console.log(userinfo);
            res.render('view',userinfo);
          }
        });
      }
    });
  }
})

// Test: WEB-ROOT_DIR, 渲染HTML带Paramaters
app.get('/',function(req,res){
  res.render('index',{code : '12312'});
})


// 0. 服务器启动
var server = app.listen(webconf.port,function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log("Front-Server is start at http://%s:%s",host,port);
});
