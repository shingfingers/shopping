import request from '@/api/request'

/**
 * 获取广告/轮播图列表
 * 后端 GGController 返回 Category 实体（实为广告位）
 */
export const getCategoryTree = () => {
  return request({
    url: '/user/category/all',
    method: 'get',
  })
}

/**
 * 获取商品分类树
 * 后端 ProductTypeController 返回 ProductType 列表（含 level/parentId）
 * 前端根据 level 和 parentId 构建树结构
 */
export const getProductTypeTree = () => {
  return request({
    url: '/user/productType/all',
    method: 'get',
  })
}

/**
 * 获取品牌列表
 */
export const getBrandList = () => {
  return request({
    url: '/user/brand/findAll',
    method: 'get',
  })
}

/**
 * 商品列表
 * @param {Object} params - 查询参数
 */
export const getProductList = (params) => {
  return request({
    url: '/user/goodsSearch/search',
    method: 'post',
    data: params,
  })
}

/**
 * 商品详情
 * @param {Number} id - 商品ID
 */
export const getProductDetail = (id) => {
  return request({
    url: '/user/goodsSearch/findDesc',
    method: 'get',
    params: { id },
  })
}

/**
 * 自动补齐关键词
 * @param {String} keyword - 关键词
 */
export const autoSuggest = (keyword) => {
  return request({
    url: `/user/goodsSearch/autoSuggest?keyword=${keyword}`,
    method: 'get',
  })
}

/**
 * 高级搜索
 * @param {Object} data - 搜索条件
 */
export const advancedSearch = (data) => {
  return request({
    url: '/user/goodsSearch/search',
    method: 'post',
    data,
  })
}
