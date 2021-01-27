const app = getApp()
import {
  fetchWeatherInfo,
  updateUserInfo,
  searchUserInfo,
  fetchUserInfo
} from '../../utils/fetch'
Page({
  data: {
    fullscreen: false,
    pageInx: 0,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showNavbar: false, // 底部导航
    openid: "",

    // 独立模块
    usercity: '上海',
    realdata: {}, // 实时天气
    weekdata: [], // 一周天气
    weatherInfo: {}, // 天气信息

    // 城市模块
    region: ['上海市', '上海市', '闵行区']
  },

  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    this.setData({
      fullscreen: app.globalData.userInfo
    })
    wx.getStorage({
      key: 'openid'
    }).then(res => {
      this.setData({
        openid: res.data
      })
      this._searchUserInfo(res.data)
    }).catch(err => {
      this._fetchWeather(this.data.usercity)
      console.warn('获取openid失败')
    })
  },

  onReady() {},

  getUserInfo(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // 获取用户信息
  async _searchUserInfo(openid) {
    wx.showLoading({
      title: '加载中',
    })
    if (openid) {
      this._getUserApi(openid)
    } else {
      wx.getStorage({
        key: 'openid',
      }).then(res => {
        this._getUserApi(res.openid)
      }).catch(err => console.warn(err))
    }
  },

  // 调用用户接口
  async _getUserApi(openid){
    let {
      data
    } = await searchUserInfo(openid)
    
    if (data.code != -1) {
      this.setData({
        userInfo: data.data
      })
      let _city = data.data.city
      this._fetchWeather(_city ? _city : this.data.usercity)
      if (_city) {
        this.setData({
          usercity: data.data.city
        })
      }
    } else {
      this._fetchWeather(this.data.usercity)
    }
  },

  // 查询天气
  async _fetchWeather(city = '上海') {
    let {
      data
    } = await fetchWeatherInfo(city)
    data = data.data
    console.log('查询天气api', data)
    data.weekend.length = 5
    data.weekend.map(item => {
      let _month = new Date(Date.parse(item.date)).getMonth() + 1
      item.month = _month < 10 ? '0' + _month : _month
      item.date = new Date(Date.parse(item.date)).getDate()
    })

    this.setData({
      weatherInfo: data
    }, () => {
      wx.hideLoading()
    })
  },

  // 监听home页面点击事件
  _watchPageTouch(e) {
    let _showNavbar = !this.data.showNavbar
    this.setData({
      showNavbar: _showNavbar
    })
  },

  // 个人设置页面
  _changeCity(e) {
    //  更改默认城市
    wx.navigateTo({
      url: '/pages/profile/profile',
    })
  },

  // 城市选择器
  bindRegionChange: async function (e) {
    let arr = e.detail.value
    this.setData({
      region: e.detail.value
    })
    wx.getStorage({
      key: 'openid',
    }).then(async res => {
      let _openid = res.data
      let params = {
        openid: _openid,
        province: arr[0],
        city: arr[1],
        area: arr[2]
      }
      let {
        data
      } = await updateUserInfo(params)

      if (data.code == 0) {
        // 重新调用用户信息
        this._searchUserInfo(_openid)
        wx.showToast({
          title: '更新成功',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '更新失败',
          icon: 'none'
        })
      }
    }).catch(err => console.warn(err))

  },

  // 取消城市选择
  cancelRegion: (e) => {
    console.log('取消选择', e)
  },

  // 底部tab切换
  _changeTab(e) {
    let inx = e.target.dataset.index
    this.setData({
      pageInx: Number(inx)
    })
  }
})