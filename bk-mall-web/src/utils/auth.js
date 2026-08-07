/**
 * 认证工具 - Token 管理 & 记住密码
 */

const TOKEN_KEY = 'bk_mall_token'
const REMEMBER_KEY = 'bk_mall_remember'
const USER_ID_KEY = 'bk_mall_userId'

/**
 * 获取 Token
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * 设置 Token
 * @param {string} token
 * @param {boolean} [remember] - 是否持久保存
 */
export const setToken = (token, remember = true) => {
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    // 会话级 Token，关闭浏览器即失效
    sessionStorage.setItem(TOKEN_KEY, token)
  }
}

/**
 * 移除 Token
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
}

/**
 * 保存 userId（后端接口需要 @RequestHeader userId）
 * @param {string|number} userId
 */
export const setUserId = (userId) => {
  if (userId != null && userId !== '') {
    localStorage.setItem(USER_ID_KEY, String(userId))
  }
}

/**
 * 获取 userId
 */
export const getUserId = () => {
  return localStorage.getItem(USER_ID_KEY) || ''
}

/**
 * 移除 userId
 */
export const removeUserId = () => {
  localStorage.removeItem(USER_ID_KEY)
}

/**
 * 从 JWT 中解析 userId
 * JWT 格式：header.payload.signature，payload 为 base64url 编码的 JSON
 * @param {string} token
 * @returns {number|null}
 */
export const parseUserIdFromToken = (token) => {
  if (!token) return null
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(escape(atob(base64)))
    const claims = JSON.parse(json)
    return claims.userId != null ? claims.userId : null
  } catch (e) {
    return null
  }
}

/**
 * 是否已登录
 */
export const isLoggedIn = () => {
  return !!getToken()
}

/**
 * 保存记住的账号
 * @param {string} username
 */
export const saveRememberedAccount = (username) => {
  if (username) {
    localStorage.setItem(REMEMBER_KEY, username)
  } else {
    localStorage.removeItem(REMEMBER_KEY)
  }
}

/**
 * 获取记住的账号
 */
export const getRememberedAccount = () => {
  return localStorage.getItem(REMEMBER_KEY) || ''
}
