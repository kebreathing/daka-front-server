/**
* Connect to wx server
*/
var express = require('express');
var reqest = require('request');
var http = require('http');
var app = express();

// 微信配置
var wxconf = require('./conf/wx');

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
  console.log(req);
  // Exchange accesstoken with code
  var code = req;

  // code -> Accesstoken
  request.get({
    url: wxconf.URL_AccessToken(code),
  },function(error,response,body){
    if(!error && response.statusCode == 200){
      console.log(body);
      var json = JSON.parse(body);
      // Accesstoken -> UserInfo
      request.get({
        url : wxconf.URL_UserInfo(json.access_token,json.openid)
      },function(error,response,body){
        if(!error && response.statusCode == 200){
          var userinfo = JSON.parse(body);
          console.log(userinfo);
        }
      });
    }
  });
  res.send("hello");
})

// Test: WEB-ROOT_DIR, 渲染HTML带Paramaters
app.get('/',function(req,res){
  res.render('index',{code : '12312'});
})


// 0. 服务器启动
var server = app.listen(3000,function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log("Front-Server is start at http://%s:%s",host,port);
});
