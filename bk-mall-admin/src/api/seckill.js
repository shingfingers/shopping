import request from '@/utils/request'

// 分页查询秒杀商品
export function findSeckillPage(params) {
  return request({
    url: '/seckillGoods/findPage',
    method: 'GET',
    params,
  })
}

// 新增秒杀商品
export function addSeckillGoods(data) {
  return request({
    url: '/seckillGoods/add',
    method: 'POST',
    data,
  })
}

// 修改秒杀商品
export function updateSeckillGoods(data) {
  return request({
    url: '/seckillGoods/update',
    method: 'PUT',
    data,
  })
}