import request from '@/api/request'

/**
 * 创建订单
 * @param {Object} data - 订单数据
 */
export const createOrder = (data) => {
  return request({
    url: '/user/orders/add',
    method: 'post',
    data,
  })
}

/**
 * 订单列表
 * @param {Object} params - 查询参数
 */
export const getOrderList = (params) => {
  return request({
    url: '/user/orders/findUserOrders',
    method: 'get',
    params,
  })
}

/**
 * 订单详情
 * @param {Number} id - 订单ID
 */
export const getOrderDetail = (id) => {
  return request({
    url: '/user/orders/findById',
    method: 'get',
    params: { id },
  })
}

/**
 * 订单支付
 * @param {Object} data - 支付数据
 */
export const payOrder = (data) => {
  return request({
    url: '/user/payment/pcPay',
    method: 'post',
    data,
  })
}

/**
 * 取消订单
 * @param {Number} id - 订单ID
 */
export const cancelOrder = (id) => {
  return request({
    url: `/user/orders/cancel/${id}`,
    method: 'post',
  })
}

/**
 * 确认收货
 * @param {Number} id - 订单ID
 */
export const confirmReceive = (id) => {
  return request({
    url: `/user/orders/confirm/${id}`,
    method: 'post',
  })
}

/**
 * 申请退款
 * @param {Object} data - 退款数据
 */
export const applyRefund = (data) => {
  return request({
    url: '/user/orders/refund',
    method: 'post',
    data,
  })
}
