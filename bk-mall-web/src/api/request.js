import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getToken, removeToken, getUserId } from '@/utils/auth'

// 注意：不在这里 import router，避免循环依赖
// (request.js → router → views → components → stores → api → request.js)
// 拦截器中如需跳转登录页，使用 window.location.href

// 检测是否处于离线/无后端状态
let isOffline = false

/**
 * 标记后端离线状态
 */
export function setOfflineMode(val) {
  isOffline = val
}

export function getOfflineMode() {
  return isOffline
}

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
  timeout: 30000, // 30秒超时（邮件发送等操作较慢，避免误判离线）
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 如果已标记离线，直接返回一个模拟的成功响应
    // 但这种情况下由调用方决定是否使用mock数据
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // 后端接口需要 userId 请求头（从 JWT 解析后存储）
    const userId = getUserId()
    if (userId) {
      config.headers.userId = userId
    }
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data

    // 如果自定义code不是200，则判断为错误
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')

      // code === 401: token失效
      if (res.code === 401) {
        ElMessageBox.confirm('登录已过期，请重新登录', '提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          removeToken()
          window.location.href = '/login'
        })
      }

      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      return res
    }
  },
  (error) => {
    console.error('响应错误:', error)

    // 网络异常 → 标记离线模式
    if (!error.response || error.code === 'ECONNABORTED' || error.message.includes('Network Error')) {
      isOffline = true
      // 不弹出错误提示，让调用方自动切换到mock数据
      return Promise.reject({ ...error, __offline: true })
    }

    let message = '网络异常，请稍后重试'

    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          removeToken()
          window.location.href = '/login'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址不存在'
          break
        case 500:
          message = '服务器内部错误'
          // 不弹出提示，让调用方使用 mock 数据
          return Promise.reject(error)
        case 502:
          message = '网关错误'
          break
        case 503:
          message = '服务不可用'
          break
        case 504:
          message = '网关超时'
          break
        default:
          message = error.response.data?.message || '请求失败'
      }
    } else if (error.code === 'ECONNABORTED') {
      message = '请求超时，请稍后重试'
    }

    // 只在非 500 错误时弹出提示
    if (!error.response || error.response.status !== 500) {
      ElMessage.error(message)
    }
    return Promise.reject(error)
  }
)

export default request
