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
    musicInfo: {
      playerStatus: false,
      playerIcon: '../../img/play.png',
      songName: '未获取歌曲',
      artist: '未知艺术家'
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
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
      wx.redirectTo({
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
          },
          prevCount: 1
        })
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
        // _this.setData({
        //   musicInfo: {
        //     ..._this.data.musicInfo,
        //     songName: data.data.songName,
        //     artist: data.data.artist
        //   }
        // })
        innerAudioContext.src = data.data.music
      }
    })
  },
  onPullDownRefresh: function() {
    wx.showLoading()
    wx.stopPullDownRefresh()
    const _this = this
    wx.request({
      url: 'https://www.alloween.xyz/getHistory',
      method: 'POST',
      data: {
        name: this.data.userInfo.nickName,
        prevCount: this.data.prevCount
      },
      success: function(data) {
        console.log(data)
        _this.setData({
          prevCount: _this.data.prevCount + 1,
          receiveData: {
            text: data.data.text,
            image: data.data.image
          },
          // musicInfo: {
          //   songName: data.data.music.songName,
          //   artist: data.data.music.artist
          // }
        })
        // innerAudioContext.src = data.data.music.musicSrc
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
    console.log(innerAudioContext)
    let { musicInfo } = this.data
    const icon = musicInfo.playerStatus ? '../../img/play.png' : '../../img/pause.png'
    musicInfo.playerStatus ? innerAudioContext.pause() :  innerAudioContext.play()
    this.setData({
      musicInfo: {
        ...musicInfo,
        playerStatus: !musicInfo.playerStatus,
        playerIcon: icon
      }
    })
  }
})
