import request from '@/api/request'

/**
 * 用户名密码登录
 */
export const login = (data) => {
  return request({
    url: '/user/shoppingUser/loginPassword',
    method: 'post',
    data,
  })
}

/**
 * 邮箱验证码登录
 */
export const loginCheckCode = (email, checkCode) => {
  return request({
    url: `/user/shoppingUser/loginCheckCode?email=${email}&checkCode=${checkCode}`,
    method: 'post',
  })
}

/**
 * 用户注册
 */
export const register = (data) => {
  return request({
    url: '/user/shoppingUser/register',
    method: 'post',
    data,
  })
}

/**
 * 获取用户信息（获取登录用户名）
 */
export const getUserInfo = () => {
  return request({
    url: '/user/shoppingUser/getName',
    method: 'get',
  })
}

/**
 * 发送注册邮箱验证码
 */
export const sendEmailCode = (email) => {
  return request({
    url: `/user/shoppingUser/sendEmailCode?email=${email}`,
    method: 'get',
  })
}

/**
 * 验证注册邮箱验证码
 */
export const registerCheckCode = (email, checkCode) => {
  return request({
    url: `/user/shoppingUser/registerCheckCode?email=${email}&checkCode=${checkCode}`,
    method: 'get',
  })
}

/**
 * 发送登录邮箱验证码
 */
export const sendLoginCheckCode = (email) => {
  return request({
    url: `/user/shoppingUser/sendLoginCheckCode?email=${email}`,
    method: 'get',
  })
}

/**
 * 退出登录
 */
export const logout = () => {
  return request({
    url: '/user/logout',
    method: 'post',
  })
}
