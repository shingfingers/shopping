import request from '@/utils/request'

// 登录（Spring Security 表单登录：/admin/login，POST 表单）
export function login(data) {
  // 使用 URLSearchParams 以表单形式提交
  const form = new URLSearchParams()
  form.append('username', data.username)
  form.append('password', data.password)
  return request({
    url: '/admin/login',
    method: 'POST',
    data: form,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/admin/logout',
    method: 'POST',
  })
}

// 获取当前登录管理员名
export function getUsername() {
  return request({
    url: '/admin/getUsername',
    method: 'GET',
  })
}