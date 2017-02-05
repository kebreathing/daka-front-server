/**
* Server configuration
*/

var conf = {
  dev_port: 80,
  test_port: 8222,
  url: "www.jyufit.cc",
  sql:{
    host: "localhost",
    port: 8080,
    part: "daka-starter/daka",
    URL_USERSAVE: function(){
      return "http://"+this.host+":"+this.port+"/"+this.part+"/user/save";
    },
    URL_USERGET: function(openid){
      return "http://"+this.host+":"+this.port+"/"+this.part+"/user/get?userId=" + openid;
    }
  }
}

module.exports = conf;
