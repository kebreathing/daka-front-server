/**
* 加密函数
* 加密部分包含： 随机字符串 + 当前url + 时间戳 + ticket
*/
var crypto = require('crypto');

var crypt = function(url,ticket){

  var str = "1234567890poiuytrewqzxcvbnmlkjhgfdsQAZWERTYUIOJNKMLBGVFCDXS";

  /*
  * 获取随机字符串
  */
  this.getNonceStr = function(){
    var length = str.length;
    var randomLen = 0;
    var noncestr = "";

    while(randomLen < 20) randomLen = Math.random() * 56;
    for(var i=0;i<randomLen;i++){
      noncestr += str.charAt(Math.floor(Math.random() * length + 0.5));
    }
    return noncestr;
  }

  /*
  * 获取时间戳
  */
  this.getTimeStamp = function(){
    return Date.parse(new Date());
  }

  /*
  * 获取ticket
  */
  this.getTicket = function(){
    return ticket;
  }

  /**
  * 获取当前的url
  */
  this.getUrl = function(){
    return url;
  }
}

crypt.prototype.sortAndCrypt = function(){
  var url = this.getUrl();
  var ticket = this.getTicket();
  var noncestr = this.getNonceStr();
  var timestamp = this.getTimeStamp();

  var append = "jsapi_ticket=" + ticket;
  append += "&noncestr=" + noncestr;
  append += "&timestamp=" + timestamp;
  append += "&url=" + url;

  var shasum = crypto.createHash('sha1');
  shasum.update(append);
  var signature = shasum.digest('base64');

  var ans = {
    nonceStr : noncestr,
    timestamp : timestamp,
    signature : signature
  };

  console.log(ans);
  return ans;
}

module.exports = crypt;
