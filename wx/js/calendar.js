/*
* For jiyu 日历
*/
var monthdays = [31,28,31,30,31,30,31,31,30,31,30,31];


var calendar = {
  isleap : function(year){
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
  },
  modifyMonthDays: function(year){
    if(this.isleap(year)){
      monthdays[1] = 29;
    } else {
      monthdays[1] = 28;
    }
  },
  getMonthCalendar: function(year,month){
    this.modifyMonthDays(year);               // 修改日历大小
    var dates = new Array();
    var start = new Date(year,month-1,1);     // 开始时间
    var startDay = start.getDay();            // 每月开始第一天星期几，周日 = 1
    for(var i = 0; i < startDay;i++) dates.push(0);
    for(var i = 1; i <= monthdays[month-1]; i++) dates.push(i);
    return dates;
  }
};

var TBCalendar = {
  setFlipDiv: function(date,content,tableDivId){
    var fd = "<div id=\"card-" + tableDivId + "-" + date + "\"><div class=\"front\"><label class=\"banner-label-front\">" + date + "</label></div>";
    fd += "<div class=\"back\">" + "<label class=\"banner-label-back\">" + content + "</label>" + "</div></div>";
    return fd;
  },
  setCalendars: function(year,month,tableDivId){
    // 清空原有子元素
    $("#" + tableDivId).empty();
    // 获得月历信息
    var tdCalendars = calendar.getMonthCalendar(year,month);
    // 获取table div ID
    var index = 0;
    var rows  = "";
    while(index < tdCalendars.length){
      var str = "<tr>"
      for(var i=0;i<7 && index < tdCalendars.length;i++){
        if(tdCalendars[index] == 0) str += "<td></td>";
        else                        str += "<td id=\"" + tableDivId + "-" + tdCalendars[index] +"\">" + tdCalendars[index] + "</td>";
        index++;
      }
      str += "</tr>";
      rows += str;
    }
    $("#" + tableDivId).append("<table><tbody>" + rows + "</tbody></table>")
  },
  /*
  * 注意参数格式 以"-"连接的日期和内容
  */
  setPrintedCalendars: function(strDate,strContent,tableDivId){
    if(strDate == null || strDate.length == 0) return;
    var arrDaka = strDate.split("_");
    var arrCont = strContent.split("_");
    for(var i=0;i<arrDaka.length;i++){
      var id = "#" + tableDivId + "-" + arrDaka[i];
      $(id).empty();
      $(id).append(this.setFlipDiv(arrDaka[i],arrCont[i],tableDivId));
      var cardId = "#card-" +tableDivId + "-" + arrDaka[i];
      $(cardId).flip({trigger: 'click', reverse: true});
    }
  }
}
