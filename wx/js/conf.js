/**
* Configuration for daka
*/
// 默认Style
var defaultStyle = {
  radius: { inner: 90, normal: 103, outter: 116},
  alpha:  { inner: 0.6, normal: 0.4, outter: 0.2},
  speed:  { inner: 0.005, normal: 0.005, outter: 0.005},
  range:  { inner: 0.8, norml: 0.6, outter: 0.4},
  strokeStyle: "#93f9b9",
  lineWidth: 10
}

// Page 1 : Canvas
var canvaser= {
  outter : {},
  normal : {},
  inner : {}
}

// Page: 2
var DakaCalendar = function(){
  this.year = 2017;
  this.month= 1;
  this.banner = 1;
  var rightBool = false;
  var rightmax = 12;
  var leftBool = false;
  var leftmin = 1;

  this.getRightMax = function() { return rightmax; }
  this.getLeftMin = function() { return leftmin; }
  this.getTitle = function() { return this.year + " 年 " + this.month + " 月"; }
}

// Page: 1
var DakaObj = function(){
  var userId = 1;
  var current = new Date();
  var sumDate = 0;       // 签到总天数
  var content = "";
  var signed = false;    // 是否已经签到
  var friends = 0;        // 打卡好友数量
  this.contented = false; // 是否已经选了训练项目

  this.year = function() { return current.getYear() + 1900; }
  this.month= function() { return current.getMonth() + 1;   }
  this.date = function() { return current.getDate();        }
  this.strDate = function() { return this.year() + "-" + this.month() + "-" + this.date(); }

  this.getUserId = function() { return userId; }
  this.setUserId = function(id) { userId = id; }

  this.getContent = function() { return content; }
  this.setContent = function(ctt){ content = ctt; };
  this.isContentEmpty = function(){ return content.length == 0; };

  this.getSumDate = function() { return sumDate; }
  this.setSumDate = function(sum) { sumDate = sum;  $("#dakanums").html(sum); }
  this.addSum = function(){ return ++sumDate; }

  this.getSigned = function() { return signed; }
  this.setSigned = function(obj) { signed = obj; }

  this.getFriends = function() { return friends; }
  this.setFriends = function(f){ friends = f;    }
}
