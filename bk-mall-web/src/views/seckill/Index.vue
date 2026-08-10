<template>
  <DefaultLayout>
    <div class="seckill-page">
      <!-- 顶部Banner -->
      <div class="seckill-banner">
        <div class="section-inner">
          <h1>BK秒杀</h1>
          <p>每日10点/14点/20点 准时开抢</p>
          <div class="seckill-sessions">
            <div
              v-for="session in sessions"
              :key="session.hour"
              class="session-item"
              :class="{ active: activeSession === session.hour, upcoming: session.status === 'upcoming', ongoing: session.status === 'ongoing' }"
              @click="switchSession(session)"
            >
              <span class="session-hour">{{ session.hour }}:00</span>
              <span class="session-status">
                {{ session.status === 'ongoing' ? '抢购中' : session.status === 'upcoming' ? '即将开始' : '已结束' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 秒杀商品列表 -->
      <div class="section-inner">
        <div class="seckill-header" v-if="activeSessionData.products.length > 0">
          <div class="header-title">
            <el-icon color="#F56C6C" :size="22"><Timer /></el-icon>
            <span>{{ activeSession }}:00 场</span>
            <div class="countdown" v-if="activeSessionData.remaining > 0">
              <span class="countdown-label">距结束</span>
              <span class="countdown-item">{{ padZero(Math.floor(activeSessionData.remaining / 3600)) }}</span>
              <span class="countdown-sep">:</span>
              <span class="countdown-item">{{ padZero(Math.floor((activeSessionData.remaining % 3600) / 60)) }}</span>
              <span class="countdown-sep">:</span>
              <span class="countdown-item">{{ padZero(activeSessionData.remaining % 60) }}</span>
            </div>
          </div>
        </div>

        <div class="seckill-grid" v-loading="loading">
          <template v-if="activeSessionData.products.length > 0">
            <div
              v-for="product in activeSessionData.products"
              :key="product.id || product.goodsId"
              class="seckill-product-card"
              @click="goToDetail(product)"
            >
              <div class="card-image">
                <img :src="product.mainImage || product.headerPic || placeholderImage" :alt="product.name || product.goodsName" />
                <div class="seckill-tag">秒杀</div>
              </div>
              <div class="card-info">
                <h4 class="card-name">{{ product.name || product.goodsName || product.title }}</h4>
                <div class="card-price">
                  <span class="seckill-price">¥{{ formatPrice(product.seckillPrice || product.price) }}</span>
                  <span class="original-price" v-if="product.originalPrice">¥{{ formatPrice(product.originalPrice) }}</span>
                </div>
                <!-- 进度条 -->
                <div class="progress-wrap" v-if="product.num && product.stockCount !== undefined">
                  <el-progress
                    :percentage="Math.round(((product.num - (product.stockCount || 0)) / product.num) * 100)"
                    :show-text="false"
                    :stroke-width="6"
                    color="#F56C6C"
                  />
                  <span class="progress-text">已抢{{ Math.round(((product.num - (product.stockCount || 0)) / product.num) * 100) }}%</span>
                </div>
                <div class="card-bottom">
                  <span class="stock-info">
                    剩余 <b class="stock-count">{{ product.stockCount || 0 }}</b> 件
                  </span>
                  <el-button type="danger" size="small" :disabled="!product.stockCount">
                    立即抢购
                  </el-button>
                </div>
              </div>
            </div>
          </template>
          <el-empty v-else-if="!loading" description="当前场次暂无秒杀商品" :image-size="120" />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { getSeckillList } from '@/api/seckill'
import { generatePlaceholder } from '@/utils/placeholders'
import { formatPrice } from '@/utils/format'

const router = useRouter()
const loading = ref(false)
const activeSession = ref(10)

const placeholderImage = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">' +
  '<rect fill="#f5f5f5" width="220" height="220"/><text fill="#ccc" x="50%" y="50%" ' +
  'text-anchor="middle" dy=".3em" font-size="14">暂无</text></svg>'
)

// 场次
const sessions = ref([
  { hour: 10, status: 'ongoing' },
  { hour: 14, status: 'upcoming' },
  { hour: 20, status: 'upcoming' },
])

// 各场次数据
const activeSessionData = reactive({
  remaining: 0,
  products: [],
})

const sessionDataMap = {
  10: { remaining: 3600, products: [] },
  14: { remaining: 14400, products: [] },
  20: { remaining: 36000, products: [] },
}

let countdownTimer = null

function padZero(num) {
  return String(num).padStart(2, '0')
}

function switchSession(session) {
  if (session.status === 'ended') return
  activeSession.value = session.hour
  const data = sessionDataMap[session.hour]
  activeSessionData.remaining = data.remaining
  activeSessionData.products = data.products
}

function goToDetail(product) {
  const id = product.id || product.goodsId || product.goodId
  router.push(`/seckill/${id}`)
}

async function loadSeckillProducts() {
  loading.value = true
  try {
    const res = await getSeckillList({ page: 1, size: 20 })
    const products = res.data?.records || res.data || []
    sessionDataMap[activeSession.value].products = products
    activeSessionData.products = products
  } catch {
    // 模拟数据
    const mockProducts = Array.from({ length: 8 }, (_, i) => ({
      id: `sk-${i}`,
      goodsId: `sk-goods-${i}`,
      name: `秒杀商品 ${i + 1} - 超值特惠限量抢购`,
      title: `秒杀商品 ${i + 1}`,
      seckillPrice: Math.round(29 + Math.random() * 199),
      price: Math.round(29 + Math.random() * 199),
      originalPrice: Math.round(99 + Math.random() * 599),
      mainImage: generatePlaceholder(`秒杀商品 ${i + 1}`, 400, 400),
      num: 1000,
      stockCount: Math.round(Math.random() * 800),
    }))
    sessionDataMap[activeSession.value].products = mockProducts
    activeSessionData.products = mockProducts
  } finally {
    loading.value = false
  }
}

// 倒计时
function startCountdown() {
  countdownTimer = setInterval(() => {
    if (activeSessionData.remaining > 0) {
      activeSessionData.remaining--
    }
  }, 1000)
}

onMounted(() => {
  loadSeckillProducts()
  startCountdown()
})

onUnmounted(() => {
  clearInterval(countdownTimer)
})
</script>

<style scoped lang="scss">
.seckill-page {
  background: $bg-color;
}

.section-inner {
  width: $layout-width;
  margin: 0 auto;
  padding: 0 20px 40px;
}

// ============= Banner =============
.seckill-banner {
  background: linear-gradient(135deg, #1a1a2e 0%, #2d1b3d 50%, #1a1a2e 100%);
  padding: 36px 0;
  margin-bottom: 24px;
  text-align: center;
  color: #fff;

  h1 {
    font-size: 36px;
    font-weight: 800;
    margin-bottom: 6px;
    font-family: 'Trebuchet MS', sans-serif;
  }

  p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 20px;
  }
}

.seckill-sessions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.session-item {
  padding: 10px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid rgba(255, 255, 255, 0.2);

  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
  }

  &.active {
    background: linear-gradient(135deg, #F56C6C, #e85050);
    border-color: #F56C6C;
  }

  &.ongoing {
    border-color: #F56C6C;
  }

  .session-hour {
    display: block;
    font-size: 22px;
    font-weight: 700;
  }

  .session-status {
    font-size: 12px;
    opacity: 0.8;
  }
}

// ============= 头部倒计时 =============
.seckill-header {
  margin-bottom: 20px;

  .header-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 20px;
    font-weight: 600;
    color: $text-primary;
  }

  .countdown {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: 16px;

    .countdown-label {
      font-size: 13px;
      color: $text-secondary;
      margin-right: 4px;
    }

    .countdown-item {
      background: #333;
      color: #fff;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 700;
      font-family: 'Courier New', monospace;
    }

    .countdown-sep {
      font-weight: 700;
      font-size: 16px;
    }
  }
}

// ============= 秒杀商品网格 =============
.seckill-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  min-height: 300px;
}

.seckill-product-card {
  background: #fff;
  border-radius: $border-radius-small;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid $border-color-light;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-hover;
    border-color: rgba($danger-color, 0.3);
  }

  .card-image {
    position: relative;
    width: 100%;
    padding-top: 100%;
    overflow: hidden;
    background: $bg-color;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s;

      .seckill-product-card:hover & {
        transform: scale(1.05);
      }
    }

    .seckill-tag {
      position: absolute;
      top: 8px;
      left: 8px;
      padding: 2px 10px;
      background: linear-gradient(135deg, $danger-color, #e85050);
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      border-radius: $border-radius-base;
    }
  }

  .card-info {
    padding: 12px 14px;
  }

  .card-name {
    font-size: 14px;
    color: $text-primary;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 8px;
  }

  .card-price {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 10px;

    .seckill-price {
      color: $danger-color;
      font-size: 18px;
      font-weight: 700;
    }

    .original-price {
      color: $text-placeholder;
      font-size: 12px;
      text-decoration: line-through;
    }
  }

  .progress-wrap {
    margin-bottom: 8px;

    .progress-text {
      font-size: 11px;
      color: $text-secondary;
      display: inline-block;
      margin-top: 4px;
    }
  }

  .card-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .stock-info {
      font-size: 12px;
      color: $text-secondary;

      .stock-count { color: $danger-color; font-size: 14px; }
    }
  }
}

// ========== 响应式适配 ==========
@include respond-to('tablet') {
  .section-inner {
    width: 100%;
  }

  // 平板：商品网格改为 3 列
  .seckill-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@include respond-to('mobile') {
  .section-inner {
    width: 100%;
    padding: 0 12px 40px;
  }

  // Banner 标题缩小
  .seckill-banner {
    padding: 24px 0;
    margin-bottom: 16px;

    h1 {
      font-size: 26px;
    }

    p {
      font-size: 12px;
      margin-bottom: 14px;
    }
  }

  // 场次选择器改为横向滚动
  .seckill-sessions {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    justify-content: flex-start;
    padding: 0 12px;
    gap: 10px;

    .session-item {
      flex-shrink: 0;
      padding: 8px 16px;

      .session-hour {
        font-size: 18px;
      }
    }
  }

  // 头部倒计时缩小
  .seckill-header {
    margin-bottom: 14px;

    .header-title {
      font-size: 16px;
      flex-wrap: wrap;
      gap: 6px;
    }

    .countdown {
      margin-left: 0;

      .countdown-item {
        font-size: 14px;
        padding: 2px 6px;
      }
    }
  }

  // 商品网格改为 2 列
  .seckill-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  // 卡片信息收紧
  .seckill-product-card {
    .card-info {
      padding: 10px;
    }

    .card-name {
      font-size: 13px;
    }

    .card-price .seckill-price {
      font-size: 16px;
    }
  }
}
</style>
