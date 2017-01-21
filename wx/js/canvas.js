/*
* Create for point (x, y)
*/

var midpoint = function(){
  this.x = 0;
  this.y = 0;
}

var CanvasTitle = function(){
  var pos = {};
  var font = "";
  var text = "";
  var canvasId = "";
  var fillStyle = "#000000";
  var font_family = "EurostileMN";

  this.setting = function(json){
    if(json.font != null) font = json.font;
    if(json.text != null) text = json.text;
    if(json.fillStyle != null) fillStyle = json.fillStyle;
    if(json.pos != null) pos = json.pos;
    if(json.canvasId != null) canvasId = json.canvasId;
  };

  this.setCanvasId = function(id){
    canvasId = id;
  };

  this.setPos = function(obj){
    pos = obj;
  }

  this.setText = function(txt){
    text = txt;
  };

  this.createText = function(txt){
    if(canvasId == null) {
      console.log("[CreateText] canvasId is null");
      return;
    }
    if(pos == null) return;
    if(txt != null) text = txt;

    var bg = document.getElementById(canvasId);
    var ctx = bg.getContext("2d");

    ctx.font="bold 50px EurostileMN"; //EurostileMN
    ctx.fillStyle = "#93f9b9";
    ctx.fillText(text,pos.x,pos.y);
  };
};

var CanvasObj = function(){
  // 原始参数
  var circ = Math.PI * 2;
  var quart= Math.PI / 2;

  // 基本参数
  var canvasId = '';
  var imgSize = {width : 300, height : 300};
  var midpoint = {};
  var radius = 30;    // 半径
  var start =  0;     // 开始位置
  var end =  0.8;       // 结束位置
  var speed = 0.01;   // 加载速度

  // 样式参数
  var lineWidth = 10.0;         // 线段粗细
  var lineCap = 'square';      // 线段样式
  var strokeStyle = "#000000"; // 线段颜色
  var globalAlpha = 1;

  this.setCanvasId = function(id) {  canvasId = id; };

  this.setLineCap = function(cap) { lineCap = cap; };

  this.setStrokeStyle= function(color) { strokeStyle = color;}

  this.setLineWidth = function(width) { lineWidth = width;}

  this.setAlpha = function(alpha) { globalAlpha = alpha; };

  this.setRadius = function(r){  radius = r; };

  this.setRange = function(s,e){ start = s; end = e; };

  this.setMidPoint = function(m){  midpoint = m; };

  this.setSpeed = function(s) { speed = s; };

  this.setImgSize = function(imgsize){ imgSize = imgsize; };

  this.setting = function(json){
    if(json.canvasId != null) canvasId = json.canvasId;
    if(json.radius != null) radius = json.radius;
    if(json.start != null) start = json.start;
    if(json.end != null) end = json.end;
    if(json.speed != null) speed = json.speed;
    if(json.lineWidth != null) lineWidth = json.lineWidth;
    if(json.lineCap != null) lineCap = json.lineCap;
    if(json.strokeStyle != null) strokeStyle = json.strokeStyle;
    if(json.globalAlpha != null) globalAlpha = json.globalAlpha;
    if(json.midpoint != null) midpoint = json.midpoint;
    if(json.imgSize != null) imgSize = json.imgSize;
  }

  // 画圆：对外接口
  this.createCircle = function(){
    if(canvasId.length == 0) {
      console.log("[Canvas] Select your container.");
      return ;
    }

    var bg = document.getElementById(canvasId);
    var ctx = bg.getContext('2d');
    ctx.lineCap = lineCap;
    ctx.strokeStyle = strokeStyle;
    ctx.globalAlpha = globalAlpha;
    ctx.lineWidth = lineWidth;
    var imd = ctx.createImageData(imgSize.height,imgSize.width);

    var draw = function(current){
      ctx.putImageData(imd,0,0);
      ctx.beginPath();
      ctx.arc(midpoint.x,midpoint.y,radius,-(quart),((circ)*current) - quart,false);
      ctx.stroke();
    }

    var t = start;
    var now = end;
    var timer = null;
    function loadCanvas(now){
      timer = setInterval(function(){
        if(t > now){
          clearInterval(timer);
        } else {
          draw(t);
          t += speed;
        }
      })
    }

    loadCanvas(now);
  };

  // 点击打卡修改Canvas
  this.modifyCircle = function(lastEnd,lastSpeed){
    if(lastEnd == null) return;
    speed = (lastSpeed != null)? lastSpeed : speed;
    lastEnd = (lastEnd == 0) ? 1 : lastEnd;
    var bg = document.getElementById(canvasId);
    var ctx = bg.getContext('2d');

    ctx.lineCap = lineCap;
    ctx.strokeStyle = strokeStyle;
    ctx.globalAlpha = globalAlpha;
    ctx.lineWidth = lineWidth;
    var imd = ctx.createImageData(imgSize.height,imgSize.width);

    var draw = function (current){
      ctx.putImageData(imd,0,0);
      ctx.beginPath();
      ctx.arc(midpoint.x,midpoint.y,radius,-(quart),((circ)*current) - quart,false);
      ctx.stroke();
    }

    var t = end;
    var now = lastEnd;
    var timer = null;
    function loadCanvas(now){
      timer = setInterval(function(){
        if(t >= now){
          clearInterval(timer);
          if(lastEnd == 1)  ctx.clearRect(0,0,imgSize.width,imgSize.height);
        } else {
          draw(t);
          t += speed;
        }
      },5)
    }
    loadCanvas(now);
  };
}
