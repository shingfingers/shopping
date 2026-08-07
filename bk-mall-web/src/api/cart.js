import request from '@/api/request'

/**
 * 获取购物车列表
 */
export const getCartList = () => {
  return request({
    url: '/user/cart/findCartList',
    method: 'get',
  })
}

/**
 * 添加商品到购物车
 * @param {Object} data - 购物车数据
 */
export const addToCart = (data) => {
  return request({
    url: '/user/cart/addCart',
    method: 'post',
    data,
  })
}

/**
 * 更新购物车数量
 * @param {Object} data - 购物车数据
 */
export const updateCartQuantity = (data) => {
  return request({
    url: '/user/cart/handleCart',
    method: 'get',
    params: data,
  })
}

/**
 * 删除购物车商品
 * @param {Array} ids - 商品ID数组
 */
export const deleteFromCart = (ids) => {
  return request({
    url: '/user/cart/deleteCart',
    method: 'delete',
    params: { goodId: Array.isArray(ids) ? ids[0] : ids },
  })
}

/**
 * 清空购物车
 */
export const clearCart = () => {
  return request({
    url: '/user/cart/clear',
    method: 'delete',
  })
}
