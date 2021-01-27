import { proxy_url } from './const'

// 用户注册
export const fetchUserInfo = (data) => {
  const promise = new Promise((resolve,reject)=>{
    wx.request({
      url: `${proxy_url}/api/user`,
      method:'POST',
      data:data,
      header: {
        "Content-Type":"application/json"
      },    
      success:(res)=>{
        resolve(res)
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
   return promise
}

// 查询用户
export const searchUserInfo = (openid) => {
  const promise = new Promise((resolve,reject)=>{
    wx.request({
      url: `${proxy_url}/api/user`,
      method:'GET',
      data:{openid:openid},
      success:(res)=>{
        resolve(res)
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
  return promise
}

// 更新用户
export const updateUserInfo = (data) => {
  const promise = new Promise((resolve,reject)=>{
    wx.request({
      url: `${proxy_url}/api/user`,
      method:'PUT',
      data:data,
      header: {
        "Content-Type":"application/json"
      },    
      success:(res)=>{
        resolve(res)
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
   return promise
}

// 查询天气
export const fetchWeatherInfo = (city) => {
  const promise = new Promise((resolve,reject)=>{
    wx.request({
      url: `${proxy_url}/api/weather`,
      method:'GET',
      data:{city},
      success:(res)=>{
        resolve(res)
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
  return promise
}