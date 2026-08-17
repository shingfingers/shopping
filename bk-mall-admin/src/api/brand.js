import request from '@/utils/request'

// 查询所有品牌
export function getAllBrands() {
  return request({
    url: '/brand/all',
    method: 'GET',
  })
}

// 分页查询品牌
export function searchBrands(params) {
  return request({
    url: '/brand/search',
    method: 'GET',
    params,
  })
}

// 新增品牌
export function addBrand(data) {
  return request({
    url: '/brand/add',
    method: 'POST',
    data,
  })
}

// 修改品牌
export function updateBrand(data) {
  return request({
    url: '/brand/update',
    method: 'PUT',
    data,
  })
}

// 删除品牌
export function deleteBrand(id) {
  return request({
    url: '/brand/delete',
    method: 'DELETE',
    params: { id },
  })
}