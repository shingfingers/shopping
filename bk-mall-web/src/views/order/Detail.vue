<template>
  <DefaultLayout>
    <div class="order-detail-page">
      <div class="section-inner">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">" class="breadcrumb">
          <el-breadcrumb-item :to="{ path: '/orders' }">我的订单</el-breadcrumb-item>
          <el-breadcrumb-item>订单详情</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="detail-body" v-loading="loading">
          <!-- 错误 / 加载失败 -->
          <div v-if="errorMsg" class="error-block">
            <el-empty :description="errorMsg" :image-size="120">
              <el-button type="primary" @click="loadOrderDetail">重新加载</el-button>
              <el-button @click="router.push('/orders')">返回订单列表</el-button>
            </el-empty>
          </div>

          <!-- 订单详情 -->
          <template v-else-if="order">
            <!-- 订单状态横幅 -->
            <div class="status-banner" :class="statusClass(order.status)">
              <div class="banner-text">
                <span class="status-label">{{ statusText(order.status) }}</span>
                <span class="status-desc">{{ statusDesc(order.status) }}</span>
              </div>
            </div>

            <!-- 收货信息 -->
            <div class="info-block">
              <h3 class="block-title">收货信息</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">收货人：</span>
                  <span class="value">{{ order.receiver || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">手机号：</span>
                  <span class="value">{{ order.receiverMobile || '-' }}</span>
                </div>
                <div class="info-item info-full">
                  <span class="label">收货地址：</span>
                  <span class="value">{{ order.receiverAreaName || '-' }}</span>
                </div>
                <div class="info-item info-full" v-if="order.buyerMessage">
                  <span class="label">买家留言：</span>
                  <span class="value">{{ order.buyerMessage }}</span>
                </div>
              </div>
            </div>

            <!-- 商品清单 -->
            <div class="info-block">
              <h3 class="block-title">商品清单</h3>
              <div v-if="goodsList.length === 0" class="goods-empty">
                <el-empty
                  :description="loading ? '商品信息加载中' : '暂无商品信息'"
                  :image-size="80"
                />
              </div>
              <table v-else class="goods-table">
                <thead>
                  <tr>
                    <th class="col-product">商品</th>
                    <th class="col-price">单价</th>
                    <th class="col-quantity">数量</th>
                    <th class="col-subtotal">小计</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in goodsList" :key="item.id">
                    <td class="col-product">
                      <img
                        :src="getProductImage(item)"
                        :alt="item.name || item.goodsName"
                      />
                      <div class="product-info">
                        <p class="product-name">{{ item.name || item.goodsName }}</p>
                        <p class="product-spec" v-if="item.spec">{{ item.spec }}</p>
                      </div>
                    </td>
                    <td class="col-price">¥{{ formatPrice(item.price) }}</td>
                    <td class="col-quantity">× {{ item.quantity }}</td>
                    <td class="col-subtotal">
                      ¥{{ formatPrice((Number(item.price) || 0) * (Number(item.quantity) || 0)) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 订单信息 -->
            <div class="info-block">
              <h3 class="block-title">订单信息</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">订单编号：</span>
                  <span class="value">{{ order.id || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">下单时间：</span>
                  <span class="value">{{ order.createTime || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">支付时间：</span>
                  <span class="value">{{ order.paymentTime || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">发货时间：</span>
                  <span class="value">{{ order.consignTime || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">完成时间：</span>
                  <span class="value">{{ order.endTime || '-' }}</span>
                </div>
                <div class="info-item" v-if="order.closeTime">
                  <span class="label">关闭时间：</span>
                  <span class="value">{{ order.closeTime }}</span>
                </div>
                <div class="info-item">
                  <span class="label">支付方式：</span>
                  <span class="value">{{ order.paymentType || '-' }}</span>
                </div>
              </div>
            </div>

            <!-- 金额信息 -->
            <div class="amount-block">
              <div class="amount-row">
                <span class="amount-label">邮费：</span>
                <span class="amount-value">¥{{ formatPrice(order.postFee || 0) }}</span>
              </div>
              <div class="amount-row amount-total">
                <span class="amount-label">实付金额：</span>
                <span class="amount-value total-price">¥{{ formatPrice(order.payment || 0) }}</span>
              </div>
            </div>

            <!-- 底部操作按钮 -->
            <div class="footer-actions">
              <el-button @click="router.push('/orders')">返回订单列表</el-button>
              <el-button
                v-if="order.status === 'pending_pay'"
                type="warning"
                @click="handlePay"
              >
                立即付款
              </el-button>
              <el-button
                v-if="order.status === 'pending_pay'"
                @click="handleCancel"
              >
                取消订单
              </el-button>
              <el-button
                v-if="order.status === 'pending_receive'"
                type="success"
                @click="handleConfirmReceive"
              >
                确认收货
              </el-button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import useUserStore from '@/stores/user'
import { getOrderDetail, payOrder, cancelOrder, confirmReceive } from '@/api/order'
import { getProductImage } from '@/utils/placeholders'
import { formatPrice } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const errorMsg = ref('')
const order = ref(null)
const goodsList = ref([])

// 状态文案映射（复用 order/List.vue 逻辑）
function statusText(status) {
  const map = {
    pending_pay: '待付款',
    pending_ship: '待发货',
    pending_receive: '待收货',
    completed: '已完成',
    cancelled: '已取消',
  }
  return map[status] || status
}

// 状态样式映射（颜色：未付款-橙、已付款/已发货-蓝、成功-绿、关闭-灰）
function statusClass(status) {
  if (status === 'pending_pay') return 'status-warning'
  if (status === 'completed') return 'status-success'
  if (status === 'cancelled') return 'status-cancelled'
  return 'status-primary'
}

// 状态横幅副标题
function statusDesc(status) {
  const map = {
    pending_pay: '请尽快完成支付',
    pending_ship: '商家正在备货中',
    pending_receive: '商品已发出，请注意查收',
    completed: '交易已完成，感谢您的惠顾',
    cancelled: '订单已关闭',
  }
  return map[status] || ''
}

async function loadOrderDetail() {
  loading.value = true
  errorMsg.value = ''
  try {
    const id = route.params.id
    const res = await getOrderDetail(id)
    order.value = res.data || null
    // 后端返回的 Orders 不含商品列表（cartGoods 为 null），做兼容处理
    goodsList.value = order.value?.cartGoods || order.value?.items || []
  } catch (err) {
    if (err?.__offline) {
      errorMsg.value = '网络异常，无法加载订单详情'
    } else {
      errorMsg.value = '订单详情加载失败'
    }
    order.value = null
    goodsList.value = []
  } finally {
    loading.value = false
  }
}

// 立即付款
async function handlePay() {
  try {
    await payOrder({ orderId: order.value?.id })
    ElMessage.success('支付成功！')
    loadOrderDetail()
  } catch (error) {
    if (error?.__offline) {
      ElMessage.warning('网络异常，支付未完成')
    } else {
      ElMessage.error('支付失败')
    }
  }
}

// 取消订单
function handleCancel() {
  ElMessageBox.confirm('确定要取消此订单吗？', '取消订单', {
    confirmButtonText: '确定',
    cancelButtonText: '再看看',
    type: 'warning',
  })
    .then(async () => {
      try {
        await cancelOrder(order.value?.id)
        ElMessage.success('订单已取消')
        loadOrderDetail()
      } catch (error) {
        if (error?.__offline) {
          ElMessage.warning('网络异常，取消未生效')
        } else {
          ElMessage.error('取消订单失败')
        }
      }
    })
    .catch(() => {})
}

// 确认收货
function handleConfirmReceive() {
  ElMessageBox.confirm('确认已收到商品？', '确认收货', {
    confirmButtonText: '确认收货',
    type: 'success',
  })
    .then(async () => {
      try {
        await confirmReceive(order.value?.id)
        ElMessage.success('已确认收货')
        loadOrderDetail()
      } catch (error) {
        if (error?.__offline) {
          ElMessage.warning('网络异常，确认收货未生效')
        } else {
          ElMessage.error('确认收货失败')
        }
      }
    })
    .catch(() => {})
}

onMounted(() => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({ name: 'Login', query: { redirect: route.fullPath } })
    return
  }
  loadOrderDetail()
})
</script>

<style scoped lang="scss">
.order-detail-page {
  background: $bg-color;
  min-height: calc(100vh - 160px);
}

.section-inner {
  width: $layout-width;
  margin: 0 auto;
  padding: 0 20px 40px;
}

.breadcrumb {
  padding: 20px 0 16px;
  font-size: 13px;
}

.detail-body {
  min-height: 300px;
}

// ============= 错误状态 =============
.error-block {
  background: #fff;
  border-radius: $border-radius-small;
  padding: 80px 0;
}

// ============= 状态横幅 =============
.status-banner {
  @include flex-between;
  padding: 20px 28px;
  border-radius: $border-radius-small;
  margin-bottom: 16px;
  color: #fff;

  .banner-text {
    display: flex;
    align-items: baseline;
    gap: 16px;
  }

  .status-label {
    font-size: 22px;
    font-weight: 700;
  }

  .status-desc {
    font-size: 13px;
    opacity: 0.85;
  }

  &.status-warning {
    background: linear-gradient(135deg, $warning-color, #f0b65a);
  }
  &.status-primary {
    background: linear-gradient(135deg, $primary-color, #66b1ff);
  }
  &.status-success {
    background: linear-gradient(135deg, $success-color, #85ce61);
  }
  &.status-cancelled {
    background: linear-gradient(135deg, $text-placeholder, #d3d4d8);
  }
}

// ============= 信息区块 =============
.info-block {
  background: #fff;
  border-radius: $border-radius-small;
  padding: 20px 24px;
  margin-bottom: 16px;
  border: 1px solid $border-color-light;
}

.block-title {
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
  margin: 0 0 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid $border-color-light;
}

.info-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 40px;

  .info-item {
    font-size: 14px;
    line-height: 1.8;
    color: $text-regular;
    min-width: 280px;

    &.info-full {
      width: 100%;
    }

    .label {
      color: $text-secondary;
    }

    .value {
      color: $text-primary;
    }
  }
}

// ============= 商品清单表格 =============
.goods-empty {
  padding: 30px 0;
}

.goods-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  thead {
    th {
      background: $bg-color;
      color: $text-secondary;
      font-weight: 500;
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid $border-color-light;
    }

    .col-product { width: auto; }
    .col-price { width: 120px; text-align: right; }
    .col-quantity { width: 100px; text-align: center; }
    .col-subtotal { width: 120px; text-align: right; }
  }

  tbody {
    td {
      padding: 16px;
      border-bottom: 1px solid $border-color-light;
      vertical-align: middle;
      color: $text-regular;
    }

    tr:last-child td {
      border-bottom: none;
    }

    .col-product {
      display: flex;
      align-items: center;
      gap: 12px;

      img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: $border-radius-base;
        border: 1px solid $border-color-light;
      }

      .product-info {
        flex: 1;

        .product-name {
          font-size: 14px;
          color: $text-primary;
          @include text-ellipsis(2);
        }

        .product-spec {
          font-size: 12px;
          color: $text-secondary;
          margin-top: 4px;
        }
      }
    }

    .col-price { text-align: right; }
    .col-quantity { text-align: center; color: $text-secondary; }
    .col-subtotal { text-align: right; color: $danger-color; font-weight: 600; }
  }
}

// ============= 金额区块 =============
.amount-block {
  background: #fff;
  border-radius: $border-radius-small;
  padding: 20px 24px;
  margin-bottom: 16px;
  border: 1px solid $border-color-light;

  .amount-row {
    @include flex-between;
    padding: 6px 0;
    font-size: 14px;

    .amount-label {
      color: $text-secondary;
    }

    .amount-value {
      color: $text-regular;
    }

    &.amount-total {
      margin-top: 8px;
      padding-top: 14px;
      border-top: 1px dashed $border-color;

      .amount-label {
        color: $text-primary;
        font-weight: 600;
      }

      .total-price {
        font-size: 20px;
        font-weight: 700;
        color: $danger-color;
      }
    }
  }
}

// ============= 底部操作 =============
.footer-actions {
  @include flex-between;
  background: #fff;
  border-radius: $border-radius-small;
  padding: 16px 24px;
  border: 1px solid $border-color-light;

  // 右对齐操作按钮组
  flex-direction: row-reverse;

  :deep(.el-button) {
    margin-left: 12px;
    margin-right: 0;
  }
}
</style>
