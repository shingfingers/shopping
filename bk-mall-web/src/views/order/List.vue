<template>
  <DefaultLayout>
    <div class="order-list-page">
      <div class="section-inner">
        <h2 class="page-title">我的订单</h2>

        <!-- 订单状态Tab -->
        <div class="order-tabs">
          <el-radio-group v-model="activeTab" @change="handleTabChange">
            <el-radio-button value="all">全部订单</el-radio-button>
            <el-radio-button value="pending_pay">待付款</el-radio-button>
            <el-radio-button value="pending_ship">待发货</el-radio-button>
            <el-radio-button value="pending_receive">待收货</el-radio-button>
            <el-radio-button value="completed">已完成</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 订单列表 -->
        <div class="order-list" v-loading="loading">
          <template v-if="orders.length > 0">
            <div v-for="order in orders" :key="order.id" class="order-card">
              <!-- 订单头部 -->
              <div class="order-header">
                <div class="order-info">
                  <span class="order-id">订单号：{{ order.id || order.orderNo }}</span>
                  <span class="order-date">{{ order.createdAt || order.createTime }}</span>
                </div>
                <span class="order-status" :class="statusClass(order.status)">
                  {{ statusText(order.status) }}
                </span>
              </div>

              <!-- 订单商品 -->
              <div class="order-goods">
                <div v-for="item in (order.items || [order])" :key="item.id" class="goods-item">
                  <img :src="item.mainImage || item.headerPic || placeholderImage" :alt="item.name || item.goodsName" />
                  <div class="goods-info">
                    <p class="goods-name">{{ item.name || item.goodsName }}</p>
                    <p class="goods-spec" v-if="item.spec">{{ item.spec }}</p>
                  </div>
                  <span class="goods-price">¥{{ formatPrice(item.price) }}</span>
                  <span class="goods-quantity">× {{ item.quantity }}</span>
                </div>
              </div>

              <!-- 订单底部操作 -->
              <div class="order-footer">
                <span class="order-total">
                  共 {{ order.items?.length || 1 }} 件商品，实付：
                  <b class="total-price">¥{{ formatPrice(order.payAmount || order.totalAmount || order.price) }}</b>
                </span>
                <div class="order-actions">
                  <el-button
                    v-if="order.status === 'pending_pay'"
                    type="primary"
                    size="small"
                    @click="handlePay(order)"
                  >
                    立即付款
                  </el-button>
                  <el-button
                    v-if="order.status === 'pending_pay'"
                    size="small"
                    @click="handleCancel(order)"
                  >
                    取消订单
                  </el-button>
                  <el-button
                    v-if="order.status === 'pending_receive'"
                    type="success"
                    size="small"
                    @click="handleConfirmReceive(order)"
                  >
                    确认收货
                  </el-button>
                  <el-button size="small" @click="handleViewDetail(order)">
                    查看详情
                  </el-button>
                </div>
              </div>
            </div>
          </template>

          <!-- 空状态 -->
          <div v-else-if="!loading" class="empty-orders">
            <el-empty description="暂无订单" :image-size="120">
              <el-button type="primary" @click="$router.push('/')">去逛逛</el-button>
            </el-empty>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-bar" v-if="total > pageSize">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next, total"
            background
            @current-change="loadOrders"
          />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import useUserStore from '@/stores/user'
import { getOrderList, cancelOrder, payOrder, confirmReceive } from '@/api/order'
import { formatPrice } from '@/utils/format'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('all')
const orders = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = 10
const total = ref(0)

const placeholderImage = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">' +
  '<rect fill="#f5f5f5" width="60" height="60"/><text fill="#ccc" x="50%" y="50%" ' +
  'text-anchor="middle" dy=".3em" font-size="8">暂无</text></svg>'
)

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

function statusClass(status) {
  if (status === 'pending_pay') return 'status-warning'
  if (status === 'completed') return 'status-success'
  if (status === 'cancelled') return 'status-cancelled'
  return 'status-primary'
}

async function loadOrders() {
  loading.value = true
  try {
    const res = await getOrderList({
      page: currentPage.value,
      size: pageSize,
      status: activeTab.value === 'all' ? undefined : activeTab.value,
    })
    orders.value = res.data?.records || res.data || []
    total.value = res.data?.total || 0
  } catch {
    // 模拟数据
    orders.value = Array.from({ length: 5 }, (_, i) => ({
      id: `ORD202406${String(1500 + i)}`,
      orderNo: `ORD202406${String(1500 + i)}`,
      status: ['pending_pay', 'pending_ship', 'pending_receive', 'completed'][i % 4],
      createdAt: '2024-06-15 10:30:00',
      payAmount: Math.round(199 + Math.random() * 5000),
      items: [{
        id: `item-${i}`,
        name: `订单商品 ${i + 1}`,
        price: Math.round(99 + Math.random() * 2000),
        quantity: Math.ceil(Math.random() * 3),
        mainImage: generatePlaceholder(`订单商品 ${i + 1}`, 200, 200),
      }],
    }))
    total.value = 28
  } finally {
    loading.value = false
  }
}

function handleTabChange() {
  currentPage.value = 1
  loadOrders()
}

// 立即付款
async function handlePay(order) {
  ElMessageBox.confirm(`确认支付 ¥${formatPrice(order.payAmount || order.totalAmount || 0)}？`, '支付确认', {
    confirmButtonText: '确认支付',
    type: 'info',
  }).then(async () => {
    try {
      await payOrder({ orderId: order.id })
      ElMessage.success('支付成功！')
      loadOrders()
    } catch (error) {
      if (error?.__offline) {
        ElMessage.warning('网络异常，支付未完成')
      } else {
        ElMessage.error('支付失败')
      }
    }
  }).catch(() => {})
}

// 取消订单
function handleCancel(order) {
  ElMessageBox.confirm('确定要取消此订单吗？', '取消订单', {
    confirmButtonText: '确定',
    cancelButtonText: '再看看',
    type: 'warning',
  }).then(async () => {
    try {
      await cancelOrder(order.id)
      ElMessage.success('订单已取消')
      loadOrders()
    } catch (error) {
      if (error?.__offline) {
        ElMessage.warning('网络异常，取消未生效')
      } else {
        ElMessage.error('取消订单失败')
      }
    }
  }).catch(() => {})
}

// 确认收货
function handleConfirmReceive(order) {
  ElMessageBox.confirm('确认已收到商品？', '确认收货', {
    confirmButtonText: '确认收货',
    type: 'success',
  }).then(async () => {
    try {
      await confirmReceive(order.id)
      ElMessage.success('已确认收货')
      loadOrders()
    } catch (error) {
      if (error?.__offline) {
        ElMessage.warning('网络异常，确认收货未生效')
      } else {
        ElMessage.error('确认收货失败')
      }
    }
  }).catch(() => {})
}

function handleViewDetail(order) {
  router.push({ name: 'OrderDetail', params: { id: order.id } })
}

onMounted(() => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({ name: 'Login', query: { redirect: '/orders' } })
    return
  }
  loadOrders()
})
</script>

<style scoped lang="scss">
.order-list-page {
  background: $bg-color;
  min-height: calc(100vh - 160px);
}

.section-inner {
  width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: $text-primary;
  padding: 24px 0 16px;
}

.order-tabs {
  margin-bottom: 16px;
}

// ============= 订单卡片 =============
.order-card {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;

  .order-info {
    display: flex;
    gap: 16px;
    font-size: 13px;
    color: $text-secondary;
  }

  .order-status {
    font-size: 14px;
    font-weight: 600;

    &.status-warning { color: $warning-color; }
    &.status-success { color: $success-color; }
    &.status-primary { color: $primary-color; }
    &.status-cancelled { color: $text-placeholder; }
  }
}

.order-goods {
  padding: 8px 20px;
}

.goods-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child { border-bottom: none; }

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #f0f0f0;
  }

  .goods-info {
    flex: 1;

    .goods-name {
      font-size: 14px;
      color: $text-primary;
    }

    .goods-spec {
      font-size: 12px;
      color: $text-secondary;
      margin-top: 2px;
    }
  }

  .goods-price { color: $text-regular; font-size: 13px; width: 90px; text-align: right; }
  .goods-quantity { color: $text-secondary; font-size: 13px; width: 50px; text-align: center; }
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-top: 1px solid #f0f0f0;

  .order-total {
    font-size: 13px;
    color: $text-secondary;
  }

  .total-price {
    font-size: 16px;
    color: $danger-color;
    font-weight: 700;
  }

  .order-actions {
    display: flex;
    gap: 8px;
  }
}

// ============= 空状态 =============
.empty-orders {
  background: #fff;
  border-radius: 8px;
  padding: 80px 0;
}

.pagination-bar {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
