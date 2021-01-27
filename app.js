// app.js
import {
  fetchUserInfo,
  searchUserInfo
} from './utils/fetch'
import {
  proxy_url
} from './utils/const'

App({
  globalData: {
    fullscreen: false,
    userInfo: {},
    userauto: {},
    openid: ''
  },
  async onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 是否全面屏
    wx.getSystemInfo({
      success: (res) => {
        if (res.model.indexOf('iPhone') != -1) {
          // console.log("苹果手机")
          if (res.model.indexOf('XR') != -1 || res.model.indexOf('XS') != -1 || res.model.indexOf('X') != -1 || res.model.indexOf('12') != -1 || res.model.indexOf('11') != -1) {
            console.log("是全面屏")
            this.globalData.fullscreen = true
          } else {
            // console.log("不是全面屏")
            this.globalData.fullscreen = false
          }
        } else {
          console.log('非苹果手机')
        }
      }
    })

    wx.login({
      success: res => {
        wx.request({
          url: `${proxy_url}/api/user/openid`,
          data: {
            code: res.code
          },
          method: 'POST',
          header: {
            "Content-Type": "application/json"
          },
          success: async (res) => {
            this.globalData.openid = res.data.data.openid
            wx.setStorage({key:'openid',data:res.data.data.openid})
            let {
              data
            } = await searchUserInfo(res.data.data.openid)
            // 注册用户
            if (data.code != 0) {
              let params = {
                openid: res.data.data.openid,
              }
              fetchUserInfo(params).then(res => {
                console.log('成功创建新用户', res.data)
              }).catch(err => console.warn('api/user出错啦', err))
            }else{
              console.log('该用户已注册')
            }
          }
        })
      }
    })
  },
})