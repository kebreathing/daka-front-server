/**
* wx configuration
*/

var wxlink = {
  APPID : "wx3e190bdc565a5c36",
  SECRET: "f77ec3c2baa52f2b725bca817341ddee",
  URL_AccessToken: function(CODE){
    return "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + this.APPID +
           "&secret=" + this.SECRET +
           "&code=" + CODE + "&grant_type=authorization_code";
  },
  URL_UserInfo: function(ACCESS_TOKEN,OPEN_ID){
    return "https://api.weixin.qq.com/sns/userinfo?access_token=" + ACCESS_TOKEN +
           "&openid=" + OPEN_ID + "&lang=zh_CN";
  },
  URL_JSTIKECT: function(ACCESS_TOKEN){
    return "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + ACCESS_TOKEN
          + "&type=jsapi";
  }
}

module.exports=wxlink;
