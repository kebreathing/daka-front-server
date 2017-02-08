/**
* Configuration for web
*/
var webObj = {
  shost: "localhost", // 改域名
  sport: 8222,
  host: "localhost",
  port: 8080,
  part: "daka-starter/daka",
  appId: 'wx3e190bdc565a5c36',
  webhost: "www.jyufit.cc"
}
var url = "http://" + webObj.host + ":" + webObj.port + "/" + webObj.part;

var weblink = {
  postUserSession: url +"/user/log",
  postUserSave : url + "/user/save",
  getUserSigned: url + "/sum/getSigned",
  postDetailedSave: url + "/detailed/save",
  getDetailedFriends: url + "/detailed/friends",
  getDetailed:   url + "/detailed/get",
  postSumIncre:  url + "/sum/incre",
  postCalBetter: url + "/calendar/better",
  getCalendar:   url + "/calendar/get",
  getInitDaka: url + "/init",
  postActDaka: url + "/act",
  getUserSession: "http://" + webObj.shost + ":" + webObj.sport + "/wxauth/daka/session"
}

/*
* Rest 函数命名：method+Class+method
*/
var webconnect = {
  // 获得日历打卡信息
  getCalendar: function(obj){
    var url = weblink.getCalendar + "?userId=" + obj.userId + "&year=" + obj.year
                 + "&month=" + obj.month;
    $.ajax({
      url : url,
      type: "GET",
      contentType: "application/json; charset=utf-8",
      error: function(XMLHttpRequest, textStatus, errorThrown){
      },
      success: function(msg){
        if(msg.length != 0){
          TBCalendar.setPrintedCalendars(msg.calendar,msg.trainCalendar,"banner" + msg.month);
          if(obj.month == obj.tmonth){
            TBCalendar.setTodayCalendar(obj.tmonth,obj.tdate)
          }
        }
      }
    })
  },
  // 点击打卡按钮，完成所有信息
  webClickBtnDaka(obj){
    var strNowDate = obj.year+"-"+obj.month+"-"+obj.date;
    this.postDetailedSave(obj);
    this.postSumIncre({userId: obj.userId,nowDate : strNowDate});
    this.postCalBetter({userId: obj.userId,year: obj.year, month: obj.month,date: obj.date, content: obj.practise})
  }
}
