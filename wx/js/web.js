/**
* Configuration for web
*/
var webObj = {
  shost: "123.207.165.179",
  sport: 80,
  host: "localhost",
  port: 8080,
  part: "daka"
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
  getUserSession: "http://" + webObj.shost + ":" + webObj.sport + "/wxauth/daka/session"
}

/*
* Rest 函数命名：method+Class+method
*/
var webconnect = {
  // Session开启
  postUserSession: function(obj){
    $.ajax({
      url : weblink.postUserSession,
      type: "POST",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(obj),
      error: function(XMLHttpRequest, textStatus, errorThrown){
      },
      success: function(msg){
      }
    })
  },
  // 保存用户信息
  postUserSave : function(obj){
    $.ajax({
      url : weblink.postUserSave,
      type: "POST",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(obj),
      error: function(XMLHttpRequest, textStatus, errorThrown){
      },
      success: function(msg){
      }
    })
  },
  // 修改用户打卡总次数
  postSumIncre: function(obj){
    $.ajax({
      url : weblink.postSumIncre,
      type: "POST",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(obj),
      error: function(XMLHttpRequest,textStatus,errorThrown){
      },
      success: function(msg){
      }
    })
  },
  // 修改日历
  postCalBetter: function(obj){
    $.ajax({
      url : weblink.postCalBetter,
      type: "POST",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(obj),
      error: function(XMLHttpRequest,textStatus,errorThrown){
      },
      success: function(msg){
        if(msg.length != 0)
          TBCalendar.setPrintedCalendars(msg.calendar,msg.trainCalendar,"banner" + msg.month);
      }
    })
  },
  // 保存用户打卡detailed
  postDetailedSave: function(obj){
    console.log(obj)
    $.ajax({
      url : weblink.postDetailedSave,
      type: "POST",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(obj),
      error: function(XMLHttpRequest, textStatus, errorThrown){
      },
      success: function(msg){
      }
    })
  },
  // 获取page-1 总次数
  getUserSigned: function(userId){
    $.ajax({
      url : weblink.getUserSigned + "?userId=" + userId,
      type: "GET",
      async: false,
      contentType: "application/json; charset=utf-8",
      error: function(XMLHttpRequest,textStatus,errorThrown){
      },
      success: function(result){
        dakaObj.setSumDate(result);
      }
    })
  },
  // 获取page-1 用户打卡detailed
  getDetailed: function(obj){
    var url = weblink.getDetailed + "?userId=" + obj.userId + "&year=" + obj.year
               + "&month=" + obj.month + "&date=" + obj.date;
    $.ajax({
      url : url,
      type: "GET",
      async: false,
      contentType: "application/json; charset=utf-8",
      error: function(XMLHttpRequest, textStatus, errorThrown){
      },
      success: function(msg){
        if(msg.length != 0){
          dakaObj.setContent(msg.practise);
          dakaObj.setSigned(true);
        }
      }
    })
  },
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
        if(msg.length != 0)
          TBCalendar.setPrintedCalendars(msg.calendar,msg.trainCalendar,"banner" + msg.month);
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
