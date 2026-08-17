import request from '@/utils/request'

// 分页查询管理员
export function searchAdmins(params) {
  return request({
    url: '/admin/search',
    method: 'GET',
    params,
  })
}

// 新增管理员
export function addAdmin(data) {
  return request({
    url: '/admin/add',
    method: 'POST',
    data,
  })
}

// 修改管理员
export function updateAdmin(data) {
  return request({
    url: '/admin/update',
    method: 'PUT',
    data,
  })
}

// 删除管理员
export function deleteAdmin(aid) {
  return request({
    url: '/admin/delete',
    method: 'DELETE',
    params: { aid },
  })
}

// 修改管理员角色（后端以请求参数接收 Long[] rids）
export function updateAdminRole(aid, rids) {
  const params = new URLSearchParams()
  params.append('aid', aid)
  ;(rids || []).forEach((rid) => params.append('rids', rid))
  return request({
    url: '/admin/updateRoleToAdmin',
    method: 'PUT',
    data: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}