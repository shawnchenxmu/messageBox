//index.js
//获取应用实例
const app = getApp()
var time = 0
var touchInfo = {
  touchStart: 0,
  touchEnd: 0
}
var interval = null

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
  touchStart: function(e) {
    touchInfo.touchStart = e.touches[0].pageX
    console.log('start', touchInfo.touchStart)
    interval = setInterval(function() {
      time++
    }, 100)
  },
  touchEnd: function(e) {
    touchInfo.touchEnd = e.changedTouches[0].pageX
    console.log('end', touchInfo.touchEnd)
    if (touchInfo.touchStart - touchInfo.touchEnd >= 80 && time < 10) {
      console.log('向左滑动')
      wx.redirectTo({
        url: '../receiveMessage/index'
      })
    }
    clearInterval(interval)
    time = 0
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
  sendMessage: function() {
    const _this = this
    if(!this.data.messageContent.length) {
      wx.showToast({
        title: '啥都没写要我发啥子呀！',
        duration: 1000,
        icon: 'none'
      })
      return
    }
    if(!this.data.imageUrl || !this.data.imageUrl.length) {
      wx.showToast({
        title: '选图片呐傻大可！！！',
        duration: 1000,
        icon: 'none'
      })
      return
    }
    wx.uploadFile({
      url: '%domain%/sendImage',
      filePath: this.data.imageUrl[0],
      name: 'image',
      header: {
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryCm5uzQJT35A903Am'
      },
      formData: {
        type: 'image',
        name: this.data.userInfo.nickName
      },
      success: function(res) {
        wx.showToast({
          title: '发送成功',
          duration: 2000,
          icon: 'none'
        })
        _this.setData({
          imageUrl: '',
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '发送失败',
          duration: 2000,
          icon: 'none'
        })
        console.log('fail', res)
      }
    })
    wx.request({
      url: '%domain%/sendText',
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
