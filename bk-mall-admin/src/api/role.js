import request from '@/utils/request'

// 查询所有角色
export function findAllRoles() {
  return request({
    url: '/role/findAll',
    method: 'GET',
  })
}