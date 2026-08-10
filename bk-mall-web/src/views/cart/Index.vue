<template>
  <DefaultLayout>
    <div class="cart-page">
      <div class="section-inner">
        <h2 class="page-title">我的购物车</h2>

        <!-- 空购物车 -->
        <div v-if="!cartStore.loading && cartStore.items.length === 0" class="empty-cart">
          <el-empty description="购物车还是空的，快去逛逛吧~" :image-size="180">
            <el-button type="primary" size="large" @click="router.push('/')">
              去购物
            </el-button>
          </el-empty>
        </div>

        <template v-else>
          <!-- 购物车表格 -->
          <div class="cart-table" v-loading="cartStore.loading">
            <div class="cart-header">
              <div class="col-check">
                <el-checkbox
                  :model-value="allSelected"
                  :indeterminate="isIndeterminate"
                  @change="handleSelectAll"
                />
              </div>
              <div class="col-product">商品信息</div>
              <div class="col-price">单价</div>
              <div class="col-quantity">数量</div>
              <div class="col-subtotal">小计</div>
              <div class="col-action">操作</div>
            </div>

            <!-- 购物车列表 -->
            <div class="cart-body">
              <div
                v-for="item in cartStore.items"
                :key="item.goodId || item.id"
                class="cart-item"
              >
                <div class="col-check">
                  <el-checkbox
                    :model-value="item.selected"
                    @change="cartStore.toggleItemSelected(item.goodId || item.id)"
                  />
                </div>
                <div class="col-product">
                  <div class="product-info">
                    <img
                      v-lazy="item.mainImage || item.headerPic || placeholderImage"
                      :alt="item.name || item.goodsName"
                    />
                    <div class="product-detail">
                      <p class="product-name" :title="item.name || item.goodsName">
                        {{ item.name || item.goodsName }}
                      </p>
                      <p class="product-spec" v-if="item.spec || item.specName">
                        {{ item.spec || item.specName }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-price">
                  <span class="price">¥{{ formatPrice(item.price) }}</span>
                </div>
                <div class="col-quantity">
                  <el-input-number
                    :model-value="item.quantity"
                    :min="1"
                    :max="99"
                    size="small"
                    @change="(val) => handleQuantityChange(item, val)"
                  />
                </div>
                <div class="col-subtotal">
                  <span class="subtotal-price">¥{{ formatPrice(item.price * (item.quantity || item.num || 1)) }}</span>
                </div>
                <div class="col-action">
                  <el-button text type="danger" @click="handleDeleteItem(item)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 底部结算栏 -->
          <div class="cart-footer" v-if="cartStore.items.length > 0">
            <div class="footer-left">
              <el-checkbox
                :model-value="allSelected"
                :indeterminate="isIndeterminate"
                @change="handleSelectAll"
              >
                全选
              </el-checkbox>
              <el-button text type="danger" @click="handleClearCart">
                清空购物车
              </el-button>
            </div>
            <div class="footer-right">
              <span class="selected-info">
                已选 <b class="count">{{ cartStore.selectedCount }}</b> 件商品
              </span>
              <span class="total-label">合计：</span>
              <span class="total-price">¥{{ formatPrice(cartStore.selectedTotal) }}</span>
              <el-button
                type="danger"
                size="large"
                :disabled="cartStore.selectedCount === 0"
                @click="handleCheckout"
              >
                去结算
              </el-button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import useCartStore from '@/stores/cart'
import useUserStore from '@/stores/user'
import { formatPrice } from '@/utils/format'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const placeholderImage = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">' +
  '<rect fill="#f5f5f5" width="80" height="80"/><text fill="#ccc" x="50%" y="50%" ' +
  'text-anchor="middle" dy=".3em" font-size="10">暂无</text></svg>'
)

// 全选状态（修复：有正确 getter/setter 的 computed）
const allSelected = computed(() => {
  return cartStore.items.length > 0 && cartStore.items.every(item => item.selected)
})

const isIndeterminate = computed(() => {
  const selectedCount = cartStore.items.filter(i => i.selected).length
  return selectedCount > 0 && selectedCount < cartStore.items.length
})

// 全选（修复：原来的 setter 是空函数）
function handleSelectAll(val) {
  cartStore.toggleAllSelected(val)
}

// 数量变更
async function handleQuantityChange(item, val) {
  if (!val || val < 1) return
  const itemId = item.goodId || item.id
  try {
    await cartStore.updateQuantity(itemId, val)
  } catch {
    ElMessage.error('更新数量失败')
  }
}

// 删除商品
function handleDeleteItem(item) {
  const itemId = item.goodId || item.id
  ElMessageBox.confirm(`确定要删除「${item.name || item.goodsName}」吗？`, '删除确认', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await cartStore.deleteItem([itemId])
      ElMessage.success('已删除')
    } catch (error) {
      // 离线时本地移除，业务错误由拦截器提示
      if (error?.__offline) {
        cartStore.items = cartStore.items.filter(i => i.id !== itemId && i.goodId !== itemId)
        ElMessage.warning('网络异常，已从本地移除')
      } else {
        ElMessage.error('删除失败')
      }
    }
  }).catch(() => {})
}

// 清空购物车
function handleClearCart() {
  if (cartStore.items.length === 0) return
  ElMessageBox.confirm('确定要清空购物车吗？此操作不可恢复。', '清空确认', {
    confirmButtonText: '确定清空',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await cartStore.clearCart()
      ElMessage.success('购物车已清空')
    } catch (error) {
      // 离线时降级到本地清空
      if (error?.__offline) {
        cartStore.clearLocalCart()
        ElMessage.warning('网络异常，已清空本地购物车')
      } else {
        ElMessage.error('清空购物车失败')
      }
    }
  }).catch(() => {})
}

// 去结算
function handleCheckout() {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({ name: 'Login', query: { redirect: '/cart' } })
    return
  }
  if (cartStore.selectedCount === 0) {
    ElMessage.warning('请至少选择一件商品')
    return
  }
  router.push({ name: 'OrderConfirm' })
}

onMounted(() => {
  if (userStore.isLoggedIn) {
    cartStore.fetchCartList()
  }
})
</script>

<style scoped lang="scss">
.cart-page {
  background: $bg-color;
  min-height: calc(100vh - 160px);
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: $text-primary;
  padding: 24px 0 16px;
}

.section-inner {
  width: $layout-width;
  margin: 0 auto;
  padding: 0 20px 40px;
}

.empty-cart {
  background: #fff;
  border-radius: $border-radius-small;
  padding: 80px 0;
  border: 1px solid $border-color-light;
}

// ============= 表格 =============
.cart-table {
  background: #fff;
  border-radius: $border-radius-small $border-radius-small 0 0;
  overflow: hidden;
  border: 1px solid $border-color-light;
}

.cart-header {
  display: flex;
  align-items: center;
  background: $bg-color;
  padding: 14px 20px;
  font-size: 13px;
  color: $text-secondary;
  border-bottom: 1px solid $border-color-light;
}

.cart-body {
  min-height: 200px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid $border-color-light;
  transition: $transition-fast;
  &:hover { background: $bg-color; }
}

.col-check { width: 48px; flex-shrink: 0; }
.col-product { flex: 1; min-width: 0; }
.col-price { width: 120px; text-align: center; flex-shrink: 0; }
.col-quantity { width: 140px; text-align: center; flex-shrink: 0; }
.col-subtotal { width: 120px; text-align: center; flex-shrink: 0; }
.col-action { width: 80px; text-align: center; flex-shrink: 0; }

.product-info {
  display: flex;
  gap: 12px;
  align-items: center;

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: $border-radius-base;
    border: 1px solid $border-color-light;
  }

  .product-detail { flex: 1; }
  .product-name {
    font-size: 14px;
    color: $text-primary;
    line-height: 1.4;
    @include text-ellipsis(2);
  }
  .product-spec {
    font-size: 12px;
    color: $text-secondary;
    margin-top: 4px;
  }
}

.price { color: $text-primary; font-size: 14px; }
.subtotal-price { color: $danger-color; font-size: 15px; font-weight: 600; }

// ============= 底部结算 =============
.cart-footer {
  @include flex-between;
  background: #fff;
  border-radius: 0 0 $border-radius-small $border-radius-small;
  padding: 16px 20px;
  box-shadow: $shadow-sm;
  position: sticky;
  bottom: 0;
  z-index: 10;
  border: 1px solid $border-color-light;
  border-top: none;
}

.footer-left {
  display: flex;
  gap: 16px;
  align-items: center;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 10px;

  .selected-info {
    font-size: 13px;
    color: $text-regular;
    .count { color: $danger-color; font-size: 16px; }
  }
  .total-label { font-size: 13px; color: $text-secondary; }
  .total-price { font-size: 22px; font-weight: 700; color: $danger-color; }
  .el-button { margin-left: 10px; min-width: 120px; font-weight: 500; }
}

// ========== 响应式 ==========
@include respond-to('tablet') {
  .section-inner { width: 100%; }
}

@include respond-to('mobile') {
  .section-inner { width: 100%; padding: 0 12px 40px; }
  .page-title { font-size: 18px; padding: 16px 0 12px; }
  .cart-table { overflow-x: auto; -webkit-overflow-scrolling: touch;
    .cart-header, .cart-item { min-width: 640px; }
  }
  .cart-footer {
    flex-direction: column; align-items: stretch; gap: 12px; padding: 12px;
    .footer-left { justify-content: center; }
    .footer-right { flex-wrap: wrap; justify-content: center; gap: 8px;
      .total-price { font-size: 20px; }
      .el-button { width: 100%; margin-left: 0; }
    }
  }
}
</style>
