import request from '@/api/request'

/**
 * 秒杀商品列表
 * @param {Object} params - 查询参数
 */
export const getSeckillList = (params) => {
  return request({
    url: '/user/seckillGoods/findPage',
    method: 'get',
    params,
  })
}

/**
 * 秒杀商品详情
 * @param {Number} id - 秒杀活动ID
 */
export const getSeckillDetail = (id) => {
  return request({
    url: '/user/seckillGoods/findById',
    method: 'get',
    params: { id },
  })
}

/**
 * 秒杀抢购
 * @param {Object} data - 抢购数据
 */
export const buySeckill = (data) => {
  return request({
    url: '/user/seckillGoods/add',
    method: 'post',
    data,
  })
}

/**
 * 秒杀订单支付
 * @param {String} id - 订单id
 */
export const paySeckill = (id) => {
  return request({
    url: '/user/seckillGoods/pay',
    method: 'get',
    params: { id },
  })
}

/**
 * 我的秒杀订单
 * @param {Object} params - 查询参数
 */
export const mySeckillOrders = (params) => {
  return request({
    url: '/user/seckillGoods/findOrder',
    method: 'get',
    params,
  })
}
