import request from '@/utils/request'

// 分页查询商品类型
export function searchProductTypes(params) {
  return request({
    url: '/productType/search',
    method: 'GET',
    params,
  })
}

// 根据父id查询子类型
export function findByParentId(parentId) {
  return request({
    url: '/productType/findByParentId',
    method: 'GET',
    params: { parentId },
  })
}

// 新增商品类型
export function addProductType(data) {
  return request({
    url: '/productType/add',
    method: 'POST',
    data,
  })
}

// 修改商品类型
export function updateProductType(data) {
  return request({
    url: '/productType/update',
    method: 'PUT',
    data,
  })
}

// 删除商品类型
export function deleteProductType(id) {
  return request({
    url: '/productType/delete',
    method: 'DELETE',
    params: { id },
  })
}