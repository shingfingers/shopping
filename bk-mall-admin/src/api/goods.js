import request from '@/utils/request'

// 分页查询商品
export function searchGoods(params) {
  return request({
    url: '/goods/search',
    method: 'GET',
    params,
  })
}

// 根据id查询商品
export function getGoodsById(id) {
  return request({
    url: '/goods/findById',
    method: 'GET',
    params: { id },
  })
}

// 新增商品
export function addGoods(data) {
  return request({
    url: '/goods/add',
    method: 'POST',
    data,
  })
}

// 修改商品
export function updateGoods(data) {
  return request({
    url: '/goods/update',
    method: 'PUT',
    data,
  })
}

// 上架/下架
export function putAwayGoods(id, isMarketable) {
  return request({
    url: '/goods/putAway',
    method: 'PUT',
    params: { id, isMarketable },
  })
}