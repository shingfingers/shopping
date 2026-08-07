import request from '@/api/request'

/**
 * 获取所有省份
 */
export const getAllProvinces = () => {
  return request({
    url: '/user/address/findAllProvince',
    method: 'get',
  })
}

/**
 * 根据省份查询城市
 * @param {number} provinceId - 省份ID
 */
export const getCitiesByProvince = (provinceId) => {
  return request({
    url: '/user/address/findCityByProvince',
    method: 'get',
    params: { provinceId },
  })
}

/**
 * 根据城市查询区县
 * @param {number} cityId - 城市ID
 */
export const getAreasByCity = (cityId) => {
  return request({
    url: '/user/address/findAreaByCity',
    method: 'get',
    params: { cityId },
  })
}

/**
 * 查询当前用户的所有收货地址
 */
export const getAddressList = () => {
  return request({
    url: '/user/address/findByUser',
    method: 'get',
  })
}

/**
 * 查询地址详情
 * @param {number} id - 地址ID
 */
export const getAddressDetail = (id) => {
  return request({
    url: '/user/address/findById',
    method: 'get',
    params: { id },
  })
}

/**
 * 新增收货地址
 * @param {Object} data - 地址数据
 */
export const addAddress = (data) => {
  return request({
    url: '/user/address/add',
    method: 'post',
    data,
  })
}

/**
 * 修改收货地址
 * @param {Object} data - 地址数据
 */
export const updateAddress = (data) => {
  return request({
    url: '/user/address/update',
    method: 'put',
    data,
  })
}

/**
 * 删除收货地址
 * @param {number} id - 地址ID
 */
export const deleteAddress = (id) => {
  return request({
    url: '/user/address/delete',
    method: 'delete',
    params: { id },
  })
}
