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
      iconPath: "../../img/location.png",
      id: 0,
      latitude: 29,
      longitude: 113,
      width: 20,
      height: 30
    }, {
      iconPath: "../../img/location.png",
      id: 0,
      latitude: 24,
      longitude: 117.6,
      width: 20,
      height: 30
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
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
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
  sendMessage: function() {
    const _this = this
    wx.request({
      url: 'http://localhost:3000/sendText',
      method: 'POST',
      data: {
        text: this.data.messageContent
      },
      success: function() {
        _this.setData({
          messageContent: '',
        })
        wx.showToast({
          title: '发送成功',
          duration: 1000,
          icon: 'none'
        })
      }
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
