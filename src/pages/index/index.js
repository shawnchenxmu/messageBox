//index.js
//获取应用实例
const app = getApp()

var dayCount = function(){
  var start = new Date("2018-04-05")
  var now = new Date()
  return parseInt((now - start) / (1000 * 60 * 60 * 24)) + 1
}

Page({
  data: {
    motto: dayCount(),
    messageContent: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    markers: [{
      iconPath: "../../img/wake.jpg",
      id: 0,
      latitude: 51,
      longitude: 0,
      width: 50,
      height: 50
    }, {
      iconPath: "../../img/cs.jpg",
      id: 1,
      latitude: 31,
      longitude: 121.6,
      width: 50,
      height: 50
    }]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getContent: function(e) {
    this.setData({
      messageContent: e.detail.value
    })
  },
  login: function() {
    wx.switchTab({
      url: "/pages/sendMessage/index"
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
