//index.js
//获取应用实例
const app = getApp()
const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.src = 'http://localhost:3000/music/小幸运_田馥甄.mp3'

Page({
  data: {
    messageContent: '',
    userInfo: {},
    receiveData: {
      text: '猜猜你会看到啥?'
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    playerStatus: false,
    playerIcon: '../../img/play.png'
  },
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
  onShow() {
    wx.showLoading({
      title: '加载中...'
    })
    this.receiveMessage()
  },
  receiveMessage: function() {
    const _this = this
    wx.request({
      url: 'https://www.alloween.xyz/receiveText',
      method: 'POST',
      data: {
        name: this.data.userInfo.nickName
      },
      success: function(data) {
        console.log(data)
        _this.setData({
          receiveData: {
            text: data.data.text,
            image: data.data.image
          }
        })
        wx.hideLoading()
      }
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  audioControl: function(e) {
    const icon = this.data.playerStatus ? '../../img/pause.png' : '../../img/play.png'
    this.data.playerStatus ? innerAudioContext.play() : innerAudioContext.pause()
    this.setData({
      playerStatus: !this.data.playerStatus,
      playerIcon: icon
    })
  }
})
