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
    imageUrl: '',
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
  pickImage: function() {
    const _this = this
    wx.chooseImage({
      count: 1, 
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: function(res){
        const tempFilePaths = res.tempFilePaths;
        _this.setData({
          imageUrl: tempFilePaths
        })
      },
      fail: function(res) {
        console.log('fail', res)
      },
      complete: function(res) {
        console.log('complete', res)
      }
    })
  },
  sendImage: function() {
    const _this = this
    wx.uploadFile({
      url: 'http://localhost:3000/sendImage',
      filePath: this.data.imageUrl[0],
      name: 'image',
      header: {
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryCm5uzQJT35A903Am'
      },
      formData: {
        type: 'image',
        name: this.data.userInfo.nickName,
      },
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {
        console.log('fail', res)
      },
      complete: function(res) {
        console.log('complete', res)
      }
    })
  },
  sendMessage: function() {
    const _this = this
    wx.request({
      url: 'http://localhost:3000/sendText',
      method: 'POST',
      data: {
        content: this.data.messageContent,
        type: 'text',
        name: this.data.userInfo.nickName
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
