
var conf = {
  host: "localhost",
  port: 8080,
  part: "daka-starter/daka",
  URL_GET: function(userId,year,month){
    var url = "http://" + this.host + ":" + this.port + "/" + this.part + "/share/giveme?" +
              "userId="  + userId + "&year=" + year + "&month=" + month;
    return url;
  }
}

$(document).ready(function(){
  var openId = $("#openid").text();
  var year = $("#year").text();
  var month = $("#month").text();
  $.ajax({
    url : conf.URL_GET(openId,year,month),
    type: "GET",
    async: false,
    contentType: "application/json; charset=utf-8",
    error: function(XMLHttpRequest,textStatus,errorThrown){
      console.log("0. Exception")
    },
    success: function(result) {
      if(result == null || result.length == 0) return;
      $("#nickname").html(result.user.nickname);
      $("#imgUser").attr("src",result.user.headimgurl);
      $("#dakanums").text(result.signed);
      var nums_cal = result.calendar.calendar;
      var content_cal = result.calendar.trainCalendar;
      TBCalendar.setCalendars(result.calendar.year,result.calendar.month,"share-calendar");
      TBCalendar.setPrintedCalendars(nums_cal,content_cal,"share-calendar");
      TBCalendar.setTodayCalendar(result.calendar.month,result.calendar.date);
    }
  });
})
