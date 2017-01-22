/**
* Server configuration
*/

var conf = {
  dev_port: 80,
  test_port: 8222,
  sql:{
    host: "localhost",
    port: 8080,
    part: "daka",
    URL_USERSAVE: function(){
      return "http://"+this.host+":"+this.port+"/"+this.part+"/user/save";
    }
  }
}

module.exports = conf;
