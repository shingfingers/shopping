import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getCartList,
  addToCart as addToCartApi,
  updateCartQuantity as updateCartApi,
  deleteFromCart as deleteCartApi,
  clearCart as clearCartApi,
} from '@/api/cart'

/**
 * 购物车状态管理
 * 使用 Pinia Setup 语法定义
 */
const useCartStore = defineStore('cart', () => {
  // ==================== 状态 ====================
  /** 购物车商品列表 */
  const items = ref([])
  /** 加载状态 */
  const loading = ref(false)

  // ==================== 计算属性 ====================

  /** 购物车商品总数量（所有商品数量累加） */
  const totalCount = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.quantity || item.num || 0), 0)
  })

  /** 已选中商品数量 */
  const selectedCount = computed(() => {
    return items.value
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + (item.quantity || item.num || 0), 0)
  })

  /** 已选中商品总金额 */
  const selectedTotal = computed(() => {
    return items.value
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + item.price * (item.quantity || item.num || 0), 0)
  })

  /** 是否全部选中 */
  const isAllSelected = computed(() => {
    return items.value.length > 0 && items.value.every((item) => item.selected)
  })

  // ==================== 方法 ====================

  /**
   * 获取购物车列表
   * 从服务端加载购物车数据，并默认全部选中
   */
  async function fetchCartList() {
    loading.value = true
    try {
      const res = await getCartList()
      // 为每一项补充 quantity（后端 CartGoods 使用 num 字段）和 selected 属性
      items.value = (res.data || []).map((item) => ({
        ...item,
        quantity: item.num ?? item.quantity ?? 1,
        selected: item.selected !== undefined ? item.selected : true,
      }))
    } catch (error) {
      console.error('获取购物车失败:', error)
      // 出错时不清空已有数据
    } finally {
      loading.value = false
    }
  }

  /**
   * 添加商品到购物车
   * @param {string|number} productId - 商品ID
   * @param {Object} data - 附加数据
   * @param {number} data.quantity - 数量，默认1
   * @param {string} [data.specId] - 规格ID
   * @param {Object} [data.product] - 商品完整信息（用于补充名称/价格/图片）
   */
  async function addToCart(productId, data = {}) {
    const p = data.product || {}
    // 后端 CartGoods 字段映射：goodId / num / price / goodsName / headerPic
    await addToCartApi({
      goodId: productId,
      num: data.quantity || 1,
      price: p.price ?? 0,
      goodsName: p.goodsName || p.name || '',
      headerPic: p.headerPic || p.mainImage || '',
    })

    // 添加成功后重新加载购物车
    await fetchCartList()
  }

  /**
   * 更新购物车商品数量
   * @param {string|number} itemId - 购物车项ID（即 goodId）
   * @param {number} quantity - 新数量
   */
  async function updateQuantity(itemId, quantity) {
    await updateCartApi({
      goodId: itemId,
      num: quantity,
    })

    // 本地乐观更新
    const item = items.value.find((i) => i.id === itemId || i.goodId === itemId)
    if (item) {
      item.quantity = quantity
      item.num = quantity
    }
  }

  /**
   * 删除购物车中的商品
   * @param {Array<string|number>} ids - 要删除的商品ID数组
   */
  async function deleteItem(ids) {
    await deleteCartApi(ids)
    // 从本地列表移除
    items.value = items.value.filter((item) => !ids.includes(item.id) && !ids.includes(item.goodId))
  }

  /**
   * 切换单个商品的选中状态
   * @param {string|number} itemId - 购物车项ID
   */
  function toggleItemSelected(itemId) {
    const item = items.value.find((i) => i.id === itemId || i.goodId === itemId)
    if (item) {
      item.selected = !item.selected
    }
  }

  /**
   * 全选 / 取消全选
   * @param {boolean} selected - 是否选中
   */
  function toggleAllSelected(selected) {
    items.value.forEach((item) => {
      item.selected = selected
    })
  }

  /**
   * 清空本地购物车（不调用后端，用于离线降级）
   */
  function clearLocalCart() {
    items.value = []
  }

  /**
   * 清空购物车（调用后端接口，成功后本地清空）
   */
  async function clearCart() {
    await clearCartApi()
    items.value = []
  }

  // ==================== 导出 ====================
  return {
    // 状态
    items,
    loading,
    // 计算属性
    totalCount,
    selectedCount,
    selectedTotal,
    isAllSelected,
    // 方法
    fetchCartList,
    addToCart,
    updateQuantity,
    deleteItem,
    toggleItemSelected,
    toggleAllSelected,
    clearLocalCart,
    clearCart,
  }
}, {
  // 持久化配置 - 未登录时保存在localStorage
  persist: {
    key: 'bk_mall_cart',
    storage: localStorage,
  },
})

export default useCartStore
