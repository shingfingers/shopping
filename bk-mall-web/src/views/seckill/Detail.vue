<template>
  <DefaultLayout>
    <div class="seckill-detail-page" v-loading="loading">
      <div class="section-inner">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/" class="breadcrumb">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'Seckill' }">秒杀专区</el-breadcrumb-item>
          <el-breadcrumb-item>{{ product.name || product.goodsName }}</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 秒杀详情区 -->
        <div class="seckill-detail-section">
          <div class="detail-left">
            <img :src="product.mainImage || product.headerPic || placeholderImage" :alt="product.name" />
          </div>

          <div class="detail-center">
            <div class="seckill-label">限时秒杀</div>
            <h1 class="product-name">{{ product.name || product.goodsName || product.title }}</h1>

            <!-- 秒杀价格 -->
            <div class="seckill-price-box">
              <div class="price-main">
                <span class="price-label">秒杀价</span>
                <span class="seckill-price"><em>¥</em>{{ formatPrice(product.seckillPrice || product.price) }}</span>
                <span class="original-price">原价 ¥{{ formatPrice(product.originalPrice || (product.price * 1.5)) }}</span>
              </div>
              <!-- 倒计时 -->
              <div class="countdown-box">
                <span class="countdown-label">距结束</span>
                <span class="countdown-item">{{ padZero(hours) }}</span>
                <span class="countdown-sep">:</span>
                <span class="countdown-item">{{ padZero(minutes) }}</span>
                <span class="countdown-sep">:</span>
                <span class="countdown-item">{{ padZero(seconds) }}</span>
              </div>
            </div>

            <!-- 进度条 -->
            <div class="progress-section" v-if="product.num && product.stockCount !== undefined">
              <div class="progress-header">
                <span>已抢{{ seckillPercent }}%</span>
                <span>剩余 <b class="stock-count">{{ product.stockCount || 0 }}</b> 件</span>
              </div>
              <el-progress
                :percentage="seckillPercent"
                :show-text="false"
                :stroke-width="12"
                color="#F56C6C"
              />
            </div>

            <!-- 商品信息 -->
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">配送</span>
                <span>现货，下单后24小时内发货，包邮</span>
              </div>
              <div class="info-item">
                <span class="info-label">服务</span>
                <span>7天无理由退货 · 正品保障</span>
              </div>
            </div>

            <!-- 抢购按钮 -->
            <el-button
              type="danger"
              size="large"
              class="buy-btn"
              :disabled="!product.stockCount || buying"
              :loading="buying"
              @click="handleBuy"
            >
              {{ product.stockCount ? '立即抢购' : '已售罄' }}
            </el-button>
          </div>

          <div class="detail-right">
            <h4>秒杀规则</h4>
            <ul>
              <li>限时特惠，数量有限，售完即止</li>
              <li>每个ID限购一件</li>
              <li>秒杀商品不支持无理由退货</li>
              <li>请在15分钟内完成支付，超时自动取消</li>
            </ul>
          </div>
        </div>

        <!-- 秒杀结果弹窗 -->
        <el-dialog v-model="showResult" title="秒杀结果" width="420px" center :close-on-click-modal="false">
          <div class="result-content">
            <el-icon v-if="buySuccess" color="#67C23A" :size="64"><CircleCheckFilled /></el-icon>
            <el-icon v-else color="#F56C6C" :size="64"><CircleCloseFilled /></el-icon>
            <h3>{{ buySuccess ? '恭喜您，抢购成功！' : '很遗憾，抢购失败' }}</h3>
            <p v-if="buySuccess">订单已生成，请尽快完成支付</p>
            <p v-else>该商品已售罄或库存不足，下次努力哦~</p>
          </div>
          <template #footer>
            <el-button v-if="buySuccess" type="primary" :loading="paying" @click="handlePayOrder">
              立即支付
            </el-button>
            <el-button @click="showResult = false">关闭</el-button>
          </template>
        </el-dialog>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import useUserStore from '@/stores/user'
import { getSeckillDetail, buySeckill, paySeckill } from '@/api/seckill'
import { generatePlaceholder } from '@/utils/placeholders'
import { formatPrice } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const productId = computed(() => route.params.id)
const loading = ref(false)
const buying = ref(false)
const showResult = ref(false)
const buySuccess = ref(false)
const paying = ref(false)
const orderId = ref('')
const remainingSeconds = ref(7200) // 默认2小时

const placeholderImage = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">' +
  '<rect fill="#f5f5f5" width="400" height="400"/><text fill="#ccc" x="50%" y="50%" ' +
  'text-anchor="middle" dy=".3em" font-size="16">暂无</text></svg>'
)

const product = ref({
  name: '',
  seckillPrice: 0,
  price: 0,
  originalPrice: 0,
  stockCount: 0,
  num: 0,
})

const hours = computed(() => Math.floor(remainingSeconds.value / 3600))
const minutes = computed(() => Math.floor((remainingSeconds.value % 3600) / 60))
const seconds = computed(() => remainingSeconds.value % 60)

const seckillPercent = computed(() => {
  const { num, stockCount } = product.value
  if (!num || num === 0) return 0
  return Math.round(((num - (stockCount || 0)) / num) * 100)
})

let countdownTimer = null

function padZero(num) {
  return String(num).padStart(2, '0')
}

async function loadDetail() {
  loading.value = true
  try {
    const res = await getSeckillDetail(productId.value)
    product.value = res.data || res
  } catch {
    // 模拟数据
    product.value = {
      id: productId.value,
      goodsId: productId.value,
      name: '华为MateBook X Pro 2024款 13代i7 16GB+1TB 3.1K触屏',
      title: '华为MateBook X Pro 2024款',
      seckillPrice: 7999,
      price: 7999,
      originalPrice: 9999,
      num: 500,
      stockCount: 85,
      mainImage: generatePlaceholder('华为MateBook X Pro', 600, 600),
    }
  } finally {
    loading.value = false
  }
}

async function handleBuy() {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({ name: 'Login', query: { redirect: route.fullPath } })
    return
  }

  buying.value = true
  try {
    // 组装订单商品（后端 createOrder 需要 cartGoods）
    const res = await buySeckill({
      cartGoods: [{
        goodId: product.value.goodsId || product.value.id,
        goodsName: product.value.name || product.value.title,
        price: product.value.seckillPrice || product.value.price,
        headerPic: product.value.headerPic || product.value.mainImage,
        num: 1,
      }],
    })
    orderId.value = res.data?.id || ''
    buySuccess.value = !!orderId.value
  } catch {
    buySuccess.value = false
  } finally {
    buying.value = false
    showResult.value = true
  }
}

// 秒杀订单立即支付
async function handlePayOrder() {
  if (!orderId.value) return
  paying.value = true
  try {
    await paySeckill(orderId.value)
    ElMessage.success('支付成功！')
    showResult.value = false
    router.push('/orders')
  } catch {
    ElMessage.error('支付失败，请稍后重试')
  } finally {
    paying.value = false
  }
}

function startCountdown() {
  countdownTimer = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--
    } else {
      clearInterval(countdownTimer)
    }
  }, 1000)
}

onMounted(() => {
  loadDetail()
  startCountdown()
})

onUnmounted(() => {
  clearInterval(countdownTimer)
})
</script>

<style scoped lang="scss">
.seckill-detail-page {
  background: $bg-color;
  min-height: calc(100vh - 160px);
}

.section-inner {
  width: $layout-width;
  margin: 0 auto;
  padding: 0 20px 40px;
}

.breadcrumb {
  padding: 16px 0;
}

// ============= 秒杀详情 =============
.seckill-detail-section {
  display: flex;
  gap: 24px;
  background: #fff;
  border-radius: $border-radius-small;
  padding: 24px;
  border: 1px solid $border-color-light;
}

.detail-left {
  width: 440px;
  flex-shrink: 0;

  img {
    width: 440px;
    height: 440px;
    object-fit: cover;
    border-radius: $border-radius-small;
  }
}

.detail-center {
  flex: 1;
  min-width: 0;
}

.seckill-label {
  display: inline-block;
  background: linear-gradient(135deg, $danger-color, #e85050);
  color: #fff;
  padding: 3px 12px;
  border-radius: $border-radius-base;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 10px;
}

.product-name {
  font-size: 20px;
  font-weight: 600;
  color: $text-primary;
  line-height: 1.4;
  margin-bottom: 16px;
}

// 价格区
.seckill-price-box {
  background: linear-gradient(135deg, #fef0f0, #fff5f5);
  border-radius: $border-radius-small;
  padding: 16px;
  margin-bottom: 20px;

  .price-main {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 12px;
  }

  .price-label {
    font-size: 13px;
    color: $text-secondary;
  }

  .seckill-price {
    font-size: 32px;
    font-weight: 700;
    color: $danger-color;

    em { font-size: 18px; font-style: normal; }
  }

  .original-price {
    font-size: 14px;
    color: $text-placeholder;
    text-decoration: line-through;
  }

  .countdown-box {
    display: flex;
    align-items: center;
    gap: 6px;

    .countdown-label { font-size: 13px; color: $text-secondary; margin-right: 4px; }
    .countdown-item {
      background: #333;
      color: #fff;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 18px;
      font-weight: 700;
      font-family: 'Courier New', monospace;
    }
    .countdown-sep { font-weight: 700; font-size: 18px; }
  }
}

// 进度条
.progress-section {
  margin-bottom: 20px;

  .progress-header {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: $text-secondary;
    margin-bottom: 8px;

    .stock-count { color: $danger-color; font-size: 16px; }
  }
}

// 信息
.info-list {
  font-size: 13px;
  margin-bottom: 24px;

  .info-item {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    color: $text-regular;

    .info-label { color: $text-secondary; width: 36px; flex-shrink: 0; }
  }
}

.buy-btn {
  width: 220px;
  height: 50px;
  font-size: 18px;
  letter-spacing: 2px;
}

// 右侧规则
.detail-right {
  width: 220px;
  flex-shrink: 0;
  padding: 16px;
  background: $bg-color;
  border-radius: $border-radius-small;
  border: 1px solid $border-color-light;

  h4 {
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 12px;
  }

  ul {
    list-style: disc;
    padding-left: 16px;

    li {
      font-size: 12px;
      color: $text-secondary;
      margin-bottom: 8px;
      line-height: 1.6;
    }
  }
}

// 结果弹窗
.result-content {
  text-align: center;
  padding: 20px 0;

  h3 {
    font-size: 20px;
    margin: 16px 0 8px;
  }

  p { color: $text-secondary; font-size: 14px; }
}
</style>
