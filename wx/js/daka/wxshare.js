/**
* 微信分享
*/

var WxShare = function(timestamp,nonceStr,signature,nickname,openId,year,month){
  var title = nickname + ":肌遇打卡";
  var imgUrl = "";
  var link = webhost + "/share?openId=" + openId +"&year=" + year + "&month=" + month;
  var desc = "今日你打卡未?";
  wx.config({
    debug: true,
    appId: webObj.appId,
    timestamp: timestamp,
    nonceStr: nonceStr,
    signature: signature,
    jsApiList: [
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareQZone'
    ]
  }); // END: wx.config

  wx.ready(function(){
    wx.onMenuShareTimeline({
      title: title,
      link: link,
      imgUrl: imgUrl,
      success: function () {
        console.log(link + "  分享成功");
      },
      cancel: function () {
      }
    }); // END: 微信分享朋友圈

    wx.onMenuShareAppMessage({
        title: title
        desc: desc,
        link: link,
        imgUrl: imgUrl,
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
          console.log(link + "  分享成功");
        },
        cancel: function () {
        }
    }); // END: 微信分享给朋友

    wx.onMenuShareQQ({
        title: title,
        desc: desc,
        link: link,
        imgUrl: imgUrl,
        success: function () {
          console.log(link + "  分享成功");
        },
        cancel: function () {
        }
    }); // END: 微信分享给qq

    wx.error(function(res){
      console.log("微信配置错误")
      console.log(res)
    })
  }); // END: wx.ready
}
