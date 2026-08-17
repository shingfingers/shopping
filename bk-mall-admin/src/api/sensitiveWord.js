import request from '@/utils/request'

// 分页查询敏感词
export function searchSensitiveWords(params) {
  return request({
    url: '/sensitiveWord/search',
    method: 'GET',
    params,
  })
}

// 新增敏感词
export function addSensitiveWord(data) {
  return request({
    url: '/sensitiveWord/add',
    method: 'POST',
    data,
  })
}

// 删除敏感词
export function deleteSensitiveWord(id) {
  return request({
    url: '/sensitiveWord/delete',
    method: 'DELETE',
    params: { id },
  })
}