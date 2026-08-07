/**
 * 表单验证工具函数
 */

/**
 * 验证手机号
 */
export const validatePhone = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入手机号'))
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    return callback(new Error('手机号格式不正确'))
  } else {
    callback()
  }
}

/**
 * 验证密码强度
 * 必须包含字母和数字，长度6-20位
 */
export const validatePassword = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入密码'))
  } else if (value.length < 6 || value.length > 20) {
    return callback(new Error('密码长度必须在6-20位之间'))
  } else if (!/^[A-Za-z0-9]+$/.test(value)) {
    return callback(new Error('密码必须包含字母和数字'))
  } else {
    callback()
  }
}

/**
 * 验证确认密码
 */
export const validateConfirmPassword = (rule, value, callback) => {
  const password = rule.scope.password || ''
  if (!value) {
    return callback(new Error('请再次输入密码'))
  } else if (value !== password) {
    return callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

/**
 * 验证邮箱
 */
export const validateEmail = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入邮箱'))
  } else if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
    return callback(new Error('邮箱格式不正确'))
  } else {
    callback()
  }
}

/**
 * 验证URL
 */
export const validateURL = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入URL'))
  } else if (!/^https?:\/\/.+\..+/.test(value)) {
    return callback(new Error('URL格式不正确'))
  } else {
    callback()
  }
}

/**
 * 验证非空
 */
export const validateRequired = (rule, value, callback) => {
  if (typeof value === 'string') {
    if (!value.trim()) {
      return callback(new Error(rule.message || '此项为必填项'))
    }
  } else if (Array.isArray(value)) {
    if (value.length === 0) {
      return callback(new Error(rule.message || '此项为必填项'))
    }
  } else if (!value) {
    return callback(new Error(rule.message || '此项为必填项'))
  }
  callback()
}
