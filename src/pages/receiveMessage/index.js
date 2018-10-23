//index.js
//获取应用实例
const app = getApp()
var time = 0
var touchInfo = {
  touchStart: 0,
  touchEnd: 0
}
var interval = null
const innerAudioContext = wx.createInnerAudioContext()

Page({
  data: {
    messageContent: '',
    userInfo: {},
    prevCount: 1,
    receiveData: {
      text: '猜猜你会看到啥?',
      imageDataStatus: false
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    musicInfo: {
      playerStatus: false,
      playerIcon: '../../img/play.png',
      songName: '',
      artist: ''
    }
  },
  onLoad: function () {
    this.getMusic()
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
  touchStart: function(e) {
    touchInfo.touchStart = e.touches[0].pageX
    interval = setInterval(function() {
      time++
    }, 100)
  },
  touchEnd: function(e) {
    touchInfo.touchEnd = e.changedTouches[0].pageX
    if (touchInfo.touchEnd - touchInfo.touchStart >= 80 && time < 10) {
      console.log('向右滑动')
      wx.navigateTo({
        url: '../sendMessage/index'
      })
    }
    clearInterval(interval)
    time = 0
  },
  receiveMessage: function() {
    const _this = this
    this.setData({
      imageDataStatus: false
    })
    wx.request({
      url: '%domain%/receiveText',
      method: 'POST',
      data: {
        name: this.data.userInfo.nickName
      },
      success: function(data) {
        console.log(data)
        _this.setData({
          receiveData: {
            text: data.data.text,
            image: data.data.image.image,
            imagePlaceholder: `${data.data.image.imagePlaceholder}`,
            imageDataStatus: true
          }
        })
        innerAudioContext.src = data.data.music
        wx.hideLoading()
      }
    })
  },
  imageLoaded: function() {
    this.setData({
      receiveData: {
        ...this.data.receiveData,
        imageDataStatus: true
      }
    })
  },
  getMusic: function() {
    const _this = this
    wx.request({
      url: '%domain%/getMusic',
      method: 'GET',
      success: function(data) {
        console.log(data)
        _this.setData({
          musicInfo: {
            songName: data.data.songName,
            artist: data.data.artist
          }
        })
        innerAudioContext.src = data.data.musicSrc
      }
    })
  },
  onPullDownRefresh: function() {
    console.log('onPullDownRefresh')
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  audioControl: function(e) {
    let { musicInfo } = this.data
    const icon = musicInfo.playerStatus ? '../../img/pause.png' : '../../img/play.png'
    musicInfo.playerStatus ? innerAudioContext.play() : innerAudioContext.pause()
    this.setData({
      musicInfo: {
        playerStatus: !musicInfo.playerStatus,
        playerIcon: icon
      }
    })
  }
})
