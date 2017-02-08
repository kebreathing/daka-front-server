/*
* JS for jydaka
*/
var dakaObj = new DakaObj();
var dakaCalendar = new DakaCalendar();

// 默认：滑动日历
var defaultPageCal = function(){
  for(var i=1;i<=12;i++){
      TBCalendar.setCalendars(dakaObj.year(),i,"banner" + i);
  }
}

// 默认：按钮点击事件绑定
var defaultBtnBind = function(){
  // 训练按钮点击
  $("#btnDaka").bind("click",function(){
      if(dakaObj.isContentEmpty() == true){ console.log("D. 还没勾选训练内容"); return; }
      $.ajax({
        url : weblink.postActDaka,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
          userId:dakaObj.getUserId(),
          year: dakaObj.year(),
          month: dakaObj.month(),
          date: dakaObj.date(),
          content: dakaObj.getContent(),
          strDate: dakaObj.strDate(),
          signTime:new Date(),
          signAddress: "",
        }),
        error: function(XMLHttpRequest, textStatus, errorThrown){
          console.log("[Act Daka] Error!")
        },
        success: function(response){
          dakaObj.setSigned(true);
          setContentChangable(false);
          $("#dakanums").html(dakaObj.addSum());
          $("#btnDaka").text("今日已打卡");
          $("#" + transformContent(dakaObj.getContent())).children().css("color","#000000");
          $("#" + transformContent(dakaObj.getContent())).children().css("background-color","#9b9b9b");

          // 打卡人数
          dakaObj.setFriends(response.friends)
          $("#spanSum").text(dakaObj.getFriends())

          // 日历修改
          if(response.calendar.length != 0){
            TBCalendar.setPrintedCalendars(response.calendar,response.trainCalendar,"banner" + dakaObj.month());
            if(dakaObj.getSigned())
              TBCalendar.setTodayCalendar(dakaObj.month(),dakaObj.date());
          }

          // 初始化：画布过程
          setCanvasRange();
          canvaser.outter.modifyCircle(defaultStyle.range.outter,0.0005)
          if(defaultStyle.range.outter == 0 && (dakaObj.getSumDate() > 10))
            setTimeout(function(){ canvaser.normal.modifyCircle(defaultStyle.range.normal,0.0005); },1000)
          if(defaultStyle.range.normal == 0 && (dakaObj.getSumDate() > 100))
            setTimeout(function(){ canvaser.inner.modifyCircle(defaultStyle.range.inner,0.0005);  },2000);
        }
      });
  })
};

// 设置画布终点
var setCanvasRange = function() {
  var sum = dakaObj.getSumDate();
  var unit = sum % 10 / 10; sum = Math.floor(sum/10);
  var decade = sum % 10 / 10; sum = Math.floor(sum/10);
  var hundreds = sum % 10 / 10; sum = Math.floor(sum/10);
  defaultStyle.range = { inner : hundreds, normal : decade, outter : unit };
}

// 点击训练按钮
var clickSingleContent = function(partialId,content){
  var id = "#" + partialId;
  // console.log(dakaObj.isContentEmpty())
  if(dakaObj.isContentEmpty() == true){
    $(id).children().css("color", "#000000");
    $(id).children().css("border-color", "#93f9b9");
    $(id).children().css("background-color", "#93f9b9");
    dakaObj.setContent(content);
  }
  else if (dakaObj.getContent() == content) {
    $(id).children().css("color", "#1d976c");
    $(id).children().css("border-color", "#1d976c");
    $(id).children().css("background-color", "inherit");
    dakaObj.setContent("");
  }
  else {
    $("#" + transformContent(dakaObj.getContent())).children().css("color","#1d976c");
    $("#" + transformContent(dakaObj.getContent())).children().css("border-color", "#1d976c");
    $("#" + transformContent(dakaObj.getContent())).children().css("background-color","inherit");

    $(id).children().css("color", "#000000");
    $(id).children().css("border-color", "#93f9b9");
    $(id).children().css("background-color", "#93f9b9");
    dakaObj.setContent(content);
  }
};

/*
* 点击按钮之后，训练内容颜色变化
*/
var setContentChangable = function(bool){
  if(bool){
    $(".contents").each(function(){
      var id = this.id;
      $("#"+id).bind("click",function(){
        clickSingleContent(id,$("#" + id).text());
      })
    });
  } else {
    // 按钮不可按
    $(".tdgroup table label").css("color","#9b9b9b");
    $(".tdgroup table label").css("border-color","#9b9b9b");
    $("#btnDaka").css("border-color","#9b9b9b");
    $("#btnDaka").css("color","#9b9b9b");
    $(".contents").each(function(){
      $("#"+this.id).unbind("click");
    });
  }
}

// Init: 训练计划打卡按钮
var initTraining = function(){
  // 训练内容点击
  if(dakaObj.getSigned() == true){
    // 不可选
    setContentChangable(false);
    $("#btnDaka").html("今日已打卡");
    $("#" + transformContent(dakaObj.getContent())).children().css("color","#000000");
    $("#" + transformContent(dakaObj.getContent())).children().css("background-color","#9b9b9b");
    return;
  } else {
    // 可选
    setContentChangable(true);
  }
};

// Init: 滑动日历
var initSlideCal = function(){
  var unslider = $(".banner").unslider({
    arrows : false,
    index: dakaObj.month() - 1,
    nav: false,
  });

  $('.unslider-arrow').click(function() {
      var fn = this.className.split(' ')[1];
      if(fn == "prev"){
        if(dakaCalendar.month > dakaCalendar.getLeftMin()){
          dakaCalendar.month -= 1;
          dakaCalendar.banner -= 1;
          unslider.data('unslider').prev();
          $("#slideLabel").html(dakaCalendar.getTitle());
          webconnect.getCalendar({
            userId:dakaObj.getUserId(),
            year: dakaObj.year(),
            month: dakaCalendar.month,
            tmonth: dakaObj.month(),
            tdate : dakaObj.date()
          });
          if(dakaCalendar.month == 1){
            $("#imgLeft").attr("src","./../img/daka2/arrow-left%20ed.png");
          }
          $("#imgRight").attr("src","./../img/daka2/arrow-right.png");
        }
      } else {
        if(dakaCalendar.month < dakaCalendar.getRightMax()){
          dakaCalendar.month += 1;
          dakaCalendar.banner += 1;
          unslider.data('unslider').next();
          $("#slideLabel").html(dakaCalendar.getTitle());
          webconnect.getCalendar({
            userId:dakaObj.getUserId(),
            year: dakaObj.year(),
            month: dakaCalendar.month,
            tmonth: dakaObj.month(),
            tdate : dakaObj.date()
          });
          if(dakaCalendar.month == dakaCalendar.getRightMax())
            $("#imgRight").attr("src","./../img/daka2/arrow-right%20ed.png");
          $("#imgLeft").attr("src","./../img/daka2/arrow-left.png");
        }
      }
  });
}

// 画布初始化
var initCanvas = function(){
  setCanvasRange();
  var height = $(".agraph").height();
  var width = $(".agraph").width();

  // 累计打卡：环形图中间的label计算
  // 1. 设置div大小和画布一样，为了让控件居中
  // 2. 计算"累计打卡"距离div顶部的距离
  // 3. 计算公式为： 中心点height/2  - 最小半径 + 线的宽度 * 3
  var margin_top = height/2 - defaultStyle.radius.inner + defaultStyle.lineWidth * 3;
  $(".page-labels").css("height",height);
  $(".page-labels").css("width",width);
  $("#labelSum").css("margin-top", margin_top);
  document.getElementById("circle1").width = width;
  document.getElementById("circle1").height = height;
  document.getElementById("circle2").width = width;
  document.getElementById("circle2").height = height;
  document.getElementById("circle3").width = width;
  document.getElementById("circle3").height = height;

  canvaser.inner = new CanvasObj();
  canvaser.normal = new CanvasObj();
  canvaser.outter = new CanvasObj();

  canvaser.inner.setting({
    imgSize : {height: height + 50,width: width},
    midpoint: {x: width / 2,y: height / 2},
    canvasId : "circle1",
    strokeStyle: defaultStyle.strokeStyle,
    globalAlpha: defaultStyle.alpha.inner,
    radius : defaultStyle.radius.inner,
    speed: defaultStyle.speed.inner,
    end : defaultStyle.range.inner
  })

  canvaser.normal.setting({
    imgSize : {height: height,width: width + 50},
    midpoint: {x: width / 2,y: height / 2},
    canvasId : "circle2",
    strokeStyle: defaultStyle.strokeStyle,
    globalAlpha: defaultStyle.alpha.normal,
    radius : defaultStyle.radius.normal,
    speed: defaultStyle.speed.normal,
    end : defaultStyle.range.normal
  })

  canvaser.outter.setting({
    imgSize : {height: height,width: width + 50},
    midpoint: {x: width / 2,y: height / 2},
    canvasId : "circle3",
    strokeStyle: defaultStyle.strokeStyle,
    globalAlpha: defaultStyle.alpha.outter,
    radius : defaultStyle.radius.outter,
    speed: defaultStyle.speed.outter,
    end : defaultStyle.range.outter
  });

  canvaser.inner.createCircle();
  canvaser.normal.createCircle();
  canvaser.outter.createCircle();

  // 标签递增
  var timer = 0;
  var t = 0;
  var now = dakaObj.getSumDate();
  function runDakaNums(time){
    timer = setInterval(function(){
      if(t > now){
        clearInterval(timer);
      } else {
        $("#dakanums").html(t);
        t += 1;
      }
    },100)
  }
  runDakaNums(now);
  timer = null;
};

// 一步完成
function initOneStep(){
  $.ajax({
    url : weblink.getUserSession,
    type: "GET",
    async: false,
    contentType: "application/json; charset=utf-8",
    error: function(XMLHttpRequest,textStatus,errorThrown){
      console.log("0. Exception")
    },
    success: function(result){
      // 微信config配置
      dakaObj.setUserId(result.openid);
      $("#nickname").html(result.nickname);
      $("#imgUser").attr("src",result.headimgurl);

      $.ajax({
        url: weblink.getInitDaka+"?userId="+result.openid
              + "&year=" + dakaObj.year()
              + "&month=" + dakaObj.month()
              + "&date=" + dakaObj.date(),
        type: "GET",
        async: false,
        success: function(json){
          if(json == null || json.length == 0) { console.log("不存在此用户信息!"); return; }
          dakaObj.setSumDate(json.signed);
          dakaObj.setFriends(json.friends);
          $("#spanSum").text(json.friends);
          $("#slideLabel").html(dakaCalendar.getTitle());

          if(json.detailed != null && json.detailed.length != 0){
            dakaObj.setContent(json.detailed.practise);
            dakaObj.setSigned(true);
          }

          if(json.calendar != null && json.calendar.length != 0){
            TBCalendar.setPrintedCalendars(json.calendar.calendar,json.calendar.trainCalendar,"banner" + json.calendar.month);
            if(dakaObj.getSigned()){
              TBCalendar.setTodayCalendar(dakaObj.month(),dakaObj.date());
            }
          }
        }
      });

      // 微信配置
      if(result.timestamp != null){
        var sharer = new WxShare(
          result.timestamp,
          result.nonceStr,
          result.signature,
          result.nickname,
          result.openid,
          dakaObj.year(),
          dakaObj.month()
        );
      }
      // 设置
      initTraining();         // 设置训练内容点击
      initCanvas();           // 设置画布
      initSlideCal();         // 设置日历翻页
    }
  }); // END: 用户信息初始化
};

$(document).ready(function(){
  // 基础配置 及 绑定
  defaultPageCal();     // 设置日历
  defaultBtnBind();
  // 带参数配置
  initOneStep();

  // 上下滑动
  (new Binder("bindUp",0.2,true,"page1","page2")).bind();
  (new Binder("bindDown",0.2,false,"page1","page2")).bind();
  $(".classBindUp").bind("click",function(){
    $("#page1").removeClass("append-move-down");
    $("#page2").removeClass("append-move-down");
    $("#page1").addClass("append-move-up");
    $("#page2").addClass("append-move-up");
  });

  $(".classBindDown").bind("click",function(){
    $("#page1").removeClass("append-move-up");
    $("#page2").removeClass("append-move-up");
    $("#page1").addClass("append-move-down");
    $("#page2").addClass("append-move-down");
  });

  // 点击分享: 显示
  $("#btnShare").bind("click",function(){
    $("#part-share").css("display","block");
  })

  // 点击分享： 隐藏
  $("#part-share").bind("click",function(){
    $("#part-share").css("display","none");
  })
});
