<template>
  <DefaultLayout>
    <div class="home-page">
      <!-- 主视觉区 = 分类菜单 + 轮播 + 快捷入口 -->
      <section class="hero-section">
        <div class="hero-inner">
          <!-- 左侧全部分类 -->
          <div class="category-menu" @mouseleave="activeCategoryId = null">
            <div
              v-for="cat in categories"
              :key="cat.id"
              class="category-item"
              :class="{ active: activeCategoryId === cat.id }"
              @mouseenter="handleCategoryHover(cat)"
              @click="goToCategory(cat.id)"
            >
              <img class="cat-icon" :src="getCategoryIcon(cat.name)" :alt="cat.name" />
              <span class="cat-name">{{ cat.name }}</span>
              <el-icon><ArrowRight /></el-icon>

              <!-- 子分类弹出层 -->
              <transition name="fade">
                <div v-if="activeCategoryId === cat.id && cat.children?.length" class="sub-category-panel">
                  <div
                    v-for="group in chunkArray(cat.children, 8)"
                    :key="group[0]?.id"
                    class="sub-cat-group"
                  >
                    <a
                      v-for="child in group"
                      :key="child.id"
                      class="sub-cat-item"
                      @click.stop="goToCategory(child.id)"
                    >
                      {{ child.name }}
                    </a>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <!-- 轮播Banner -->
          <div class="hero-banner">
            <Carousel :slides="banners" @click="handleBannerClick" />
          </div>

          <!-- 右侧快捷入口 -->
          <div class="hero-sidebar">
            <div class="sidebar-card">
              <div class="sidebar-header">
                <el-avatar :size="40" :src="userStore.avatar" />
                <div v-if="userStore.isLoggedIn" class="user-greeting">
                  <p>Hi, {{ userStore.displayName }}</p>
                  <span class="vip-badge">VIP会员</span>
                </div>
                <div v-else class="user-greeting">
                  <p>Hi, 欢迎来BK商城</p>
                  <div class="login-links">
                    <router-link to="/login">登录</router-link>
                    <router-link to="/register">注册</router-link>
                  </div>
                </div>
              </div>
              <div class="sidebar-actions">
                <div class="action-item" @click="router.push('/orders')">
                  <el-icon :size="20"><Tickets /></el-icon>
                  <span>我的订单</span>
                </div>
                <div class="action-item" @click="router.push('/cart')">
                  <el-icon :size="20"><ShoppingCartFull /></el-icon>
                  <span>购物车</span>
                </div>
                <div class="action-item">
                  <el-icon :size="20"><Star /></el-icon>
                  <span>我的收藏</span>
                </div>
                <div class="action-item">
                  <el-icon :size="20"><Service /></el-icon>
                  <span>客户服务</span>
                </div>
              </div>
            </div>
            <!-- 公告 -->
            <div class="notice-card">
              <el-icon :size="18"><Bell /></el-icon>
              <div class="notice-text">
                <span class="notice-label">公告：</span>
                <span>{{ currentNotice }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 快捷入口图标区 -->
      <section class="quick-entries">
        <div class="section-inner">
          <div
            v-for="entry in quickEntries"
            :key="entry.title"
            class="quick-entry"
            @click="handleQuickEntry(entry)"
          >
            <div class="entry-icon" :style="{ background: entry.bg }">
              <el-icon :size="24" color="#fff"><component :is="entry.icon" /></el-icon>
            </div>
            <span>{{ entry.title }}</span>
          </div>
        </div>
      </section>

      <!-- 限时秒杀模块 -->
      <section class="seckill-section">
        <div class="section-inner">
          <div class="section-header">
            <div class="header-left">
              <h2 class="section-title">
                <el-icon color="#F56C6C"><Timer /></el-icon>
                限时秒杀
              </h2>
              <div class="countdown" v-if="seckillRemaining > 0">
                <span class="countdown-label">距结束</span>
                <span class="countdown-item">{{ padZero(hours) }}</span>
                <span class="countdown-sep">:</span>
                <span class="countdown-item">{{ padZero(minutes) }}</span>
                <span class="countdown-sep">:</span>
                <span class="countdown-item">{{ padZero(seconds) }}</span>
              </div>
            </div>
            <router-link to="/seckill" class="view-more">
              查看更多 <el-icon><ArrowRight /></el-icon>
            </router-link>
          </div>
          <div class="seckill-products">
            <template v-if="seckillLoading">
              <Skeleton v-for="n in 4" :key="n" type="product" />
            </template>
            <template v-else-if="seckillProducts.length === 0">
              <div class="empty-data">
                <el-empty description="暂无秒杀商品" :image-size="80" />
              </div>
            </template>
            <ProductCard
              v-for="product in seckillProducts"
              :key="product.id"
              :product="product"
              :is-seckill="true"
            />
          </div>
        </div>
      </section>

      <!-- 猜你喜欢 / 推荐商品 -->
      <section class="recommend-section">
        <div class="section-inner">
          <div class="section-header">
            <h2 class="section-title">猜你喜欢</h2>
            <el-tabs v-model="recommendTab" class="recommend-tabs" @tab-change="handleRecommendTabChange">
              <el-tab-pane label="精选推荐" name="hot" />
              <el-tab-pane label="新品上市" name="new" />
              <el-tab-pane label="热销排行" name="sales" />
            </el-tabs>
          </div>
          <div class="product-grid" v-loading="recommendLoading">
            <template v-if="recommendProducts.length > 0">
              <ProductCard
                v-for="product in recommendProducts"
                :key="product.id"
                :product="product"
              />
            </template>
            <template v-else-if="!recommendLoading">
              <Skeleton v-for="n in 8" :key="n" type="product" />
            </template>
          </div>
          <div class="load-more" v-if="hasMore">
            <el-button :loading="loadingMore" @click="loadMoreProducts">
              加载更多
            </el-button>
          </div>
        </div>
      </section>

      <!-- 品牌专区 -->
      <section class="brand-section">
        <div class="section-inner">
          <div class="section-header">
            <h2 class="section-title">品牌专区</h2>
          </div>
          <div class="brand-grid">
            <div v-for="brand in brands" :key="brand.name" class="brand-card">
              <div class="brand-logo-placeholder">
                <span>{{ brand.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Carousel from '@/components/Carousel.vue'
import ProductCard from '@/components/ProductCard.vue'
import Skeleton from '@/components/Skeleton.vue'
import ErrorState from '@/components/ErrorState.vue'
import useUserStore from '@/stores/user'
import { getProductList, getCategoryTree, getProductTypeTree, getBrandList } from '@/api/product'
import { getSeckillList } from '@/api/seckill'
import { generatePlaceholder, getCategoryIcon } from '@/utils/placeholders'

// 生成本地 Banner 占位图（替代外部 picsum.photos 依赖）
function generateBannerImage(title, subtitle, color1, color2) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="360" viewBox="0 0 800 360">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color1}"/>
        <stop offset="100%" style="stop-color:${color2}"/>
      </linearGradient>
    </defs>
    <rect fill="url(#bg)" width="800" height="360"/>
    <circle cx="650" cy="80" r="120" fill="rgba(255,255,255,0.08)"/>
    <circle cx="720" cy="280" r="80" fill="rgba(255,255,255,0.06)"/>
    <text x="60" y="180" font-size="42" font-weight="700" fill="#fff" font-family="PingFang SC, Microsoft YaHei">${title}</text>
    <text x="60" y="230" font-size="22" fill="rgba(255,255,255,0.85)" font-family="PingFang SC, Microsoft YaHei">${subtitle}</text>
  </svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const router = useRouter()
const userStore = useUserStore()

// ==================== 分类菜单 ====================
const categories = ref([])
const activeCategoryId = ref(null)

// ==================== 轮播Banner ====================
const banners = ref([
  { image: generateBannerImage('618年中大促', '全场低至5折 限时特惠', '#ff5e3a', '#ff2d55'), title: '618年中大促', subtitle: '全场低至5折 限时特惠' },
  { image: generateBannerImage('数码新品季', '最新旗舰手机 震撼上市', '#409EFF', '#337ecc'), title: '数码新品季', subtitle: '最新旗舰手机 震撼上市' },
  { image: generateBannerImage('家电焕新节', '以旧换新 最高补贴2000元', '#E6A23C', '#c5882e'), title: '家电焕新节', subtitle: '以旧换新 最高补贴2000元' },
  { image: generateBannerImage('夏日清凉购', '空调冰箱 冰点价格', '#67C23A', '#4d9e28'), title: '夏日清凉购', subtitle: '空调冰箱 冰点价格' },
])

// ==================== 公告 ====================
const notices = [
  'BK商城618年中大促火热进行中，全场低至5折！',
  '新用户注册即享100元优惠券礼包，快来加入吧！',
  '物流配送时效升级，部分地区支持当日达服务。',
]
let noticeIndex = 0
const currentNotice = ref(notices[0])
let noticeTimer = null

// ==================== 快捷入口 ====================
const quickEntries = [
  { title: '手机数码', icon: 'Iphone', bg: 'linear-gradient(135deg, #409EFF, #337ecc)' },
  { title: '电脑办公', icon: 'Monitor', bg: 'linear-gradient(135deg, #67C23A, #4d9e28)' },
  { title: '家用电器', icon: 'HomeFilled', bg: 'linear-gradient(135deg, #E6A23C, #c5882e)' },
  { title: '服饰鞋靴', icon: 'Present', bg: 'linear-gradient(135deg, #F56C6C, #d45353)' },
  { title: '美妆护肤', icon: 'MagicStick', bg: 'linear-gradient(135deg, #e040fb, #c033d6)' },
  { title: '食品生鲜', icon: 'Apple', bg: 'linear-gradient(135deg, #ff6e40, #e05530)' },
  { title: '家居家装', icon: 'House', bg: 'linear-gradient(135deg, #78909c, #5c6f7a)' },
  { title: '图书文娱', icon: 'Reading', bg: 'linear-gradient(135deg, #26c6da, #1fa8ba)' },
]

// ==================== 秒杀 ====================
const seckillProducts = ref([])
const seckillLoading = ref(false)
const seckillRemaining = ref(0)
let countdownTimer = null

const hours = computed(() => Math.floor(seckillRemaining.value / 3600))
const minutes = computed(() => Math.floor((seckillRemaining.value % 3600) / 60))
const seconds = computed(() => seckillRemaining.value % 60)

// ==================== 推荐商品 ====================
const recommendTab = ref('hot')
const recommendProducts = ref([])
const recommendLoading = ref(false)
const loadingMore = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const hasMore = ref(true)

// ==================== 品牌 ====================
const brands = ref([])

// ==================== 方法 ====================

function handleCategoryHover(cat) {
  activeCategoryId.value = cat.id
}

function goToCategory(catId) {
  router.push({ name: 'ProductList', query: { categoryId: catId } })
}

function handleBannerClick(slide) {
  if (slide.url) {
    window.open(slide.url, '_blank')
  }
}

function handleQuickEntry(entry) {
  router.push({ name: 'ProductList', query: { keyword: entry.title } })
}

function chunkArray(arr, size) {
  const result = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

function padZero(num) {
  return String(num).padStart(2, '0')
}

// 加载分类树（使用真实商品分类接口，失败降级到硬编码）
async function loadCategories() {
  try {
    const res = await getProductTypeTree()
    const list = res.data || []
    const rootItems = list.filter(i => !i.parentId || i.parentId === 0 || i.level === 1)
    categories.value = rootItems.map(root => {
      const children = list.filter(c => c.parentId === root.id)
      return {
        id: root.id,
        name: root.name,
        children: children.map(child => ({ id: child.id, name: child.name })),
      }
    })
    if (categories.value.length === 0) throw new Error('empty')
  } catch {
    categories.value = [
      { id: 1, name: '手机数码', children: [
        { id: 101, name: '手机' }, { id: 102, name: '平板电脑' }, { id: 103, name: '耳机音箱' },
        { id: 104, name: '智能手表' }, { id: 105, name: '相机' }, { id: 106, name: '充电配件' },
      ]},
      { id: 2, name: '电脑办公', children: [
        { id: 201, name: '笔记本' }, { id: 202, name: '台式机' }, { id: 203, name: '打印机' },
      ]},
      { id: 3, name: '家用电器', children: [
        { id: 301, name: '空调' }, { id: 302, name: '冰箱' }, { id: 303, name: '洗衣机' },
      ]},
      { id: 4, name: '服饰鞋靴' },
      { id: 5, name: '美妆护肤' },
      { id: 6, name: '食品生鲜' },
      { id: 7, name: '家居家装' },
      { id: 8, name: '图书文娱' },
    ]
  }
}

// 加载品牌列表
async function loadBrands() {
  try {
    const res = await getBrandList()
    brands.value = res.data || []
    if (brands.value.length === 0) throw new Error('empty')
  } catch {
    brands.value = [
      { id: 1, name: '华为' }, { id: 2, name: '小米' }, { id: 3, name: '苹果' }, { id: 4, name: '三星' },
      { id: 5, name: '海尔' }, { id: 6, name: '格力' }, { id: 7, name: '美的' }, { id: 8, name: 'TCL' },
      { id: 9, name: '耐克' }, { id: 10, name: '阿迪达斯' }, { id: 11, name: '兰蔻' }, { id: 12, name: '雅诗兰黛' },
    ]
  }
}

// 加载秒杀商品
async function loadSeckillProducts() {
  seckillLoading.value = true
  try {
    const res = await getSeckillList({ page: 1, size: 4 })
    seckillProducts.value = res.data?.records || res.data || []

    if (seckillProducts.value.length > 0 && seckillProducts.value[0].endTime) {
      seckillRemaining.value = Math.max(0, Math.floor((new Date(seckillProducts.value[0].endTime) - Date.now()) / 1000))
    } else {
      seckillRemaining.value = 2 * 60 * 60
    }
  } catch {
    seckillProducts.value = [
      { id: 1, name: '小米14 Ultra 5G旗舰手机', price: 5999, originalPrice: 6999, mainImage: generatePlaceholder('小米14 Ultra 5G旗舰手机', 400, 400), num: 1000, stockCount: 230, tag: '秒杀', sales: 8999 },
      { id: 2, name: '华为MateBook X Pro 2024款', price: 7999, originalPrice: 9999, mainImage: generatePlaceholder('华为MateBook X Pro 2024款', 400, 400), num: 500, stockCount: 85, tag: '秒杀', sales: 4567 },
      { id: 3, name: 'Apple AirPods Pro 第二代', price: 1499, originalPrice: 1999, mainImage: generatePlaceholder('Apple AirPods Pro 第二代', 400, 400), num: 2000, stockCount: 520, tag: '秒杀', sales: 23456 },
      { id: 4, name: '戴森V15无线吸尘器', price: 3290, originalPrice: 4990, mainImage: generatePlaceholder('戴森V15无线吸尘器', 400, 400), num: 300, stockCount: 67, tag: '秒杀', sales: 6543 },
    ]
    seckillRemaining.value = 2 * 60 * 60
  } finally {
    seckillLoading.value = false
  }
}

function startCountdown() {
  countdownTimer = setInterval(() => {
    if (seckillRemaining.value > 0) {
      seckillRemaining.value--
    } else {
      clearInterval(countdownTimer)
    }
  }, 1000)
}

// 加载推荐商品
async function loadRecommendProducts(page = 1) {
  recommendLoading.value = page === 1
  loadingMore.value = page > 1

  try {
    const params = {
      page,
      size: pageSize.value,
      sort: recommendTab.value === 'hot' ? 'comprehensive' : recommendTab.value === 'new' ? 'newest' : 'sales',
    }
    const res = await getProductList(params)
    // 后端返回 GoodsSearchResult，商品列表在 goodsPage.records 中
    const data = res.data?.goodsPage?.records || res.data?.records || res.data || []
    // 确保是数组
    const list = Array.isArray(data) ? data : []

    if (page === 1) {
      recommendProducts.value = list
    } else {
      recommendProducts.value = [...recommendProducts.value, ...list]
    }

    hasMore.value = list.length >= pageSize.value
    currentPage.value = page
  } catch {
    const mockProducts = Array.from({ length: 8 }, (_, i) => ({
      id: `rec-${page}-${i}`,
      name: `精选商品 ${(page - 1) * 8 + i + 1}`,
      price: Math.round(99 + Math.random() * 1900),
      originalPrice: Math.round(199 + Math.random() * 2800),
      mainImage: generatePlaceholder(`精选商品 ${(page - 1) * 8 + i + 1}`, 400, 400),
      sales: Math.round(100 + Math.random() * 5000),
      tag: i % 3 === 0 ? '热卖' : '',
    }))
    if (page === 1) {
      recommendProducts.value = mockProducts
    } else {
      recommendProducts.value = [...recommendProducts.value, ...mockProducts.slice(0, 4)]
    }
    hasMore.value = page < 3
    currentPage.value = page
  } finally {
    recommendLoading.value = false
    loadingMore.value = false
  }
}

function loadMoreProducts() {
  loadRecommendProducts(currentPage.value + 1)
}

function handleRecommendTabChange() {
  currentPage.value = 1
  hasMore.value = true
  loadRecommendProducts(1)
}

// 公告轮播
function startNoticeRotation() {
  noticeTimer = setInterval(() => {
    noticeIndex = (noticeIndex + 1) % notices.length
    currentNotice.value = notices[noticeIndex]
  }, 3000)
}

// ==================== 生命周期 ====================
onMounted(() => {
  loadCategories()
  loadBrands()
  loadSeckillProducts()
  startCountdown()
  loadRecommendProducts()
  startNoticeRotation()
})

onUnmounted(() => {
  clearInterval(countdownTimer)
  clearInterval(noticeTimer)
})
</script>

<style scoped lang="scss">
.home-page {
  background: $bg-color;
}

// ==================== 主视觉区 ====================
.hero-section {
  background: #fff;
  padding: 16px 0;

  .hero-inner {
    width: $layout-width;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    gap: 16px;
    height: 400px;
  }
}

// 分类菜单
.category-menu {
  width: 220px;
  background: $bg-color-dark;
  border-radius: $border-radius-small;
  overflow: visible;
  flex-shrink: 0;
  padding: 8px 0;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  color: #ccc;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  font-size: 13px;
  gap: 8px;

  &:hover,
  &.active {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }

  .cat-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    border-radius: 50%;
  }

  .cat-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .el-icon {
    font-size: 11px;
  }
}

// 子分类弹出层
.sub-category-panel {
  position: absolute;
  left: 100%;
  top: 0;
  width: 480px;
  min-height: 100%;
  background: #fff;
  border-radius: 0 $border-radius-small $border-radius-small $border-radius-small;
  box-shadow: $shadow-dark;
  z-index: $z-dropdown;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sub-cat-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.sub-cat-item {
  padding: 6px 14px;
  background: #f5f5f5;
  border-radius: $border-radius-base;
  font-size: 12px;
  color: $text-regular;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: rgba($primary-color, 0.1);
    color: $primary-color;
  }
}

// 轮播Banner
.hero-banner {
  flex: 1;
  border-radius: $border-radius-small;
  overflow: hidden;
  min-width: 0;
}

// 右侧用户卡片
.hero-sidebar {
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
}

.sidebar-card {
  background: #fafafa;
  border-radius: $border-radius-small;
  padding: 16px;
  border: 1px solid #f0f0f0;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;

  .user-greeting {
    p { font-size: 13px; color: $text-regular; }
    .vip-badge {
      font-size: 11px;
      color: $warning-color;
      background: rgba($warning-color, 0.1);
      padding: 1px 6px;
      border-radius: 3px;
    }
    .login-links {
      display: flex;
      gap: 8px;
      margin-top: 3px;
      a {
        font-size: 12px;
        color: $primary-color;
        text-decoration: none;
      }
    }
  }
}

.sidebar-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 4px;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;
    font-size: 12px;
    color: $text-regular;

    &:hover {
      background: rgba($primary-color, 0.06);
      color: $primary-color;
    }
  }
}

.notice-card {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  background: #fff;
  border-radius: $border-radius-small;
  border: 1px solid #f0f0f0;
  font-size: 12px;

  .el-icon { color: $warning-color; flex-shrink: 0; margin-top: 1px; }
  .notice-label { color: $text-regular; font-weight: 500; }
  .notice-text { color: $text-secondary; line-height: 1.5; }
}

// ==================== 快捷入口 ====================
.quick-entries {
  background: #fff;
  padding: 20px 0;
  border-top: 1px solid #f0f0f0;
  margin-top: 12px;

  .section-inner {
    display: flex;
    justify-content: space-around;
  }

  .quick-entry {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
    }

    .entry-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      @include flex-center;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
    }

    span {
      font-size: 12px;
      color: $text-regular;
    }
  }
}

// ==================== 公共区域头部 ====================
.section-header {
  @include flex-between;
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .section-title {
    font-size: 21px;
    font-weight: 700;
    color: $text-primary;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .view-more {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: $text-secondary;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: $primary-color;
    }
  }
}

// ==================== 秒杀模块 ====================
.seckill-section {
  background: #fff;
  margin-top: 12px;
  padding: 28px 0;

  .countdown {
    display: flex;
    align-items: center;
    gap: 4px;

    .countdown-label {
      font-size: 13px;
      color: $text-secondary;
      margin-right: 4px;
    }

    .countdown-item {
      background: #333;
      color: #fff;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 700;
      font-family: 'Courier New', monospace;
    }

    .countdown-sep {
      font-weight: 700;
      font-size: 14px;
    }
  }

  .seckill-products {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
}

// ==================== 推荐商品 ====================
.recommend-section {
  background: #fff;
  margin-top: 12px;
  padding: 28px 0;

  .section-header {
    .recommend-tabs {
      :deep(.el-tabs__header) {
        margin: 0;
      }
      :deep(.el-tabs__nav-wrap::after) {
        display: none;
      }
    }
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    min-height: 400px;
  }

  .load-more {
    text-align: center;
    margin-top: 24px;
  }
}

// ==================== 品牌专区 ====================
.brand-section {
  background: #fff;
  margin-top: 12px;
  padding: 28px 0;

  .brand-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
  }

  .brand-card {
    border: 1px solid #f0f0f0;
    border-radius: $border-radius-small;
    @include flex-center;
    flex-direction: column;
    gap: 10px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: $primary-color;
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
    }

    .brand-logo {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      @include flex-center;
      color: #fff;
      font-size: 22px;
      font-weight: 700;
    }

    .brand-name {
      font-size: 13px;
      color: $text-regular;
      font-weight: 500;
    }
  }
}

// ==================== 通用状态 ====================
.empty-data {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
}

.error-wrapper {
  grid-column: 1 / -1;
}

// 子分类弹出动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// ========== 响应式适配 ==========
@include respond-to('tablet') {
  // hero 区域固定宽度容器铺满
  .hero-section .hero-inner {
    width: 100%;
  }

  // 平板：右侧侧边栏收窄
  .hero-sidebar {
    width: 180px;
  }

  // 平板：分类菜单收窄
  .category-menu {
    width: 180px;
  }

  // 品牌专区平板改为 4 列
  .brand-section .brand-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@include respond-to('mobile') {
  // hero 区域改为纵向布局
  .hero-section {
    padding: 10px 0;

    .hero-inner {
      width: 100%;
      flex-direction: column;
      height: auto;
      gap: 10px;
      padding: 0 12px;
    }
  }

  // 移动端隐藏左侧分类菜单（由 Header 抽屉承担分类入口）
  .category-menu {
    display: none;
  }

  // Banner 全宽
  .hero-banner {
    width: 100%;
    min-height: 160px;
  }

  // 移动端隐藏右侧用户卡片 / 公告
  .hero-sidebar {
    display: none;
  }

  // 快捷入口图标改为 4 列
  .quick-entries {
    .section-inner {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .quick-entry {
      .entry-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
      }

      span {
        font-size: 11px;
      }
    }
  }

  // 秒杀商品网格移动端改为 2 列
  .seckill-section .seckill-products {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  // 推荐商品网格改为 2 列
  .recommend-section .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    min-height: 200px;
  }

  // 品牌专区改为 3 列
  .brand-section .brand-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  // 区块标题缩小
  .section-header {
    margin-bottom: 12px;
    padding-bottom: 8px;

    .section-title {
      font-size: 17px;
    }

    .header-left {
      gap: 10px;
    }
  }

  // 各区块内边距收紧
  .seckill-section,
  .recommend-section,
  .brand-section {
    padding: 18px 0;
    margin-top: 8px;
  }
}
</style>
