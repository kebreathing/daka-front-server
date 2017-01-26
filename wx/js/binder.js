/**
* 封装类： 滑动识别
*/
var Binder = function(id,percent,updown,upId,downId){
  // 可见变量
  this.bindId = id;   // 绑定监听的区域

  // 不可见变量
  var screenHeight = $("#" + id).height();
  var standardHeight = screenHeight * percent;
  var startX = 0, startY = 0;
  var diffX = 0, diffY = 0;

  // 操作函数
  function touchStart(e){
    e.preventDefault()
    var touch = e.touches[0];
    startX = touch.pageX;
    startY = touch.pageY;
  }

  function touchMove(e){
    e.preventDefault();
    var touch = e.touches[0];
    diffY = touch.pageY - startY;
  }

  function touchEnd(e){
    // if(this.upId == null || this.downId == null) return;
    if(diffY >= (-1 * screenHeight) && diffY <= (-1 * standardHeight) && updown){
      // 整体向上走
      $("#" + upId).removeClass("append-move-down");
      $("#" + downId).removeClass("append-move-down");

      $("#" + upId).addClass("append-move-up");
      $("#" + downId).addClass("append-move-up");
      // $("#" + downId).css("display","block");
      // $("#" + upId).css("display","none");
    } else if(diffY >= standardHeight && diffY <= screenHeight && !updown){
      // 整体向下走
      $("#" + upId).removeClass("append-move-up");
      $("#" + downId).removeClass("append-move-up");
      $("#" + upId).addClass("append-move-down");
      $("#" + downId).addClass("append-move-down");
    }
    diffY = 0;
  }

  this.setDivs = function(upid,downid){
    this.upId = upid;
    this.downid = downid;
  }

  this.bind = function(){
    document.getElementById(this.bindId).addEventListener('touchstart',touchStart,false);
    document.getElementById(this.bindId).addEventListener('touchmove',touchMove,false);
    document.getElementById(this.bindId).addEventListener('touchend',touchEnd,false);
  }
}
