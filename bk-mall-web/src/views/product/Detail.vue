<template>
  <DefaultLayout>
    <div class="product-detail-page" v-loading="loading">
      <div class="section-inner">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/" class="breadcrumb">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'ProductList' }">商品列表</el-breadcrumb-item>
          <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 商品基本信息区 -->
        <div class="product-info-section">
          <!-- 左侧图片 -->
          <div class="product-gallery">
            <div class="main-image">
              <img :src="currentImage" :alt="product.name" />
            </div>
            <div class="thumbnail-list" v-if="galleryImages.length > 1">
              <div
                v-for="(img, idx) in galleryImages"
                :key="idx"
                class="thumbnail"
                :class="{ active: currentImage === img }"
                @click="currentImage = img"
              >
                <img :src="img" :alt="`${product.name} - ${idx + 1}`" />
              </div>
            </div>
          </div>

          <!-- 右侧信息 -->
          <div class="product-info">
            <h1 class="product-title">{{ product.name }}</h1>
            <p class="product-subtitle" v-if="product.caption">{{ product.caption }}</p>

            <!-- 价格区 -->
            <div class="price-box">
              <div class="price-row">
                <span class="price-label">价 格</span>
                <span class="current-price">
                  <em>¥</em><span v-number-animate="{ value: product.price || 0, duration: 1, decimals: 2 }">{{ formatPrice(product.price) }}</span>
                </span>
                <span v-if="hasOriginalPrice" class="original-price">
                  原价 ¥{{ formatPrice(product.originalPrice) }}
                </span>
              </div>
              <div class="price-row" v-if="product.seckillPrice">
                <span class="price-label">秒杀价</span>
                <span class="seckill-price"><em>¥</em>{{ formatPrice(product.seckillPrice) }}</span>
              </div>
            </div>

            <!-- 品牌 -->
            <div class="info-rows">
              <div class="info-row" v-if="product.brandName">
                <span class="label">品 牌</span>
                <span class="brand-tag" :style="{ color: getBrandColor(product.brandName) }">
                  {{ product.brandName }}
                </span>
              </div>
              <div class="info-row">
                <span class="label">促 销</span>
                <div class="tags">
                  <el-tag size="small" type="danger">限时特惠</el-tag>
                  <el-tag size="small" type="warning">满减优惠</el-tag>
                  <el-tag size="small">支持7天无理由退货</el-tag>
                </div>
              </div>
              <div class="info-row">
                <span class="label">配 送</span>
                <span>现货，下单后预计24小时内发货，包邮</span>
              </div>
              <div class="info-row">
                <span class="label">服 务</span>
                <span>由BK商城发货，提供售后服务</span>
              </div>
              <div class="info-row">
                <span class="label">库 存</span>
                <span :class="{ 'low-stock': product.stockCount <= 50 && product.stockCount > 0 }">
                  {{ product.stockCount > 0 ? `有货 (剩余${product.stockCount}件)` : '暂时缺货' }}
                </span>
              </div>
              <div class="info-row">
                <span class="label">销 量</span>
                <span>{{ formatSales(product.sales) }}+ 件</span>
              </div>
            </div>

            <!-- SKU规格选择 -->
            <div v-if="specGroups.length" class="sku-section">
              <div v-for="spec in specGroups" :key="spec.specName" class="sku-group">
                <span class="sku-label">{{ spec.specName }}</span>
                <div class="sku-options">
                  <span
                    v-for="opt in spec.specificationOptions"
                    :key="opt.id || opt.optionName"
                    class="sku-option"
                    :class="{ active: selectedSku[spec.specName] === opt.optionName }"
                    @click="selectedSku[spec.specName] = opt.optionName"
                  >
                    {{ opt.optionName }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 数量 + 操作按钮 -->
            <div class="action-section">
              <div class="quantity-group">
                <span class="label">数 量</span>
                <el-input-number
                  v-model="quantity"
                  :min="1"
                  :max="Math.min(product.stockCount || 99, 99)"
                  :disabled="!product.stockCount"
                  size="large"
                />
              </div>
              <div class="action-buttons">
                <el-button
                  type="danger" size="large"
                  :disabled="!product.stockCount"
                  @click="handleBuyNow"
                >
                  立即购买
                </el-button>
                <el-button
                  type="primary" size="large"
                  :disabled="!product.stockCount"
                  :loading="addingToCart"
                  @click="handleAddToCart"
                >
                  加入购物车
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 商品详情Tab -->
        <div class="product-detail-section">
          <el-tabs v-model="activeTab" type="border-card">
            <el-tab-pane label="商品介绍" name="intro">
              <div class="tab-content">
                <div class="intro-grid">
                  <div class="intro-item" v-for="attr in productAttributes" :key="attr.label">
                    <span class="attr-label">{{ attr.label }}</span>
                    <span class="attr-value">{{ attr.value }}</span>
                  </div>
                </div>
                <div class="desc-images" v-if="product.descriptionImages?.length">
                  <img v-for="(img, idx) in product.descriptionImages" :key="idx" :src="img" :alt="`${product.name} 详情 ${idx + 1}`" />
                </div>
                <div v-else class="desc-placeholder">
                  <el-empty description="详细商品描述加载中..." :image-size="80" />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="规格参数" name="specs">
              <div class="tab-content">
                <el-table :data="specTableData" border stripe>
                  <el-table-column prop="label" label="参数名" width="200" />
                  <el-table-column prop="value" label="参数值" />
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="用户评价" name="reviews">
              <div class="tab-content">
                <div class="review-summary">
                  <div class="review-score">
                    <span class="score-num">98%</span>
                    <el-rate :model-value="4.9" disabled show-score text-color="#ff9900" />
                  </div>
                  <div class="review-tags">
                    <el-tag size="small" v-for="tag in reviewTags" :key="tag">{{ tag }}</el-tag>
                  </div>
                </div>
                <div v-for="review in reviews" :key="review.id" class="review-item">
                  <div class="review-header">
                    <el-avatar :size="32">{{ review.user }}</el-avatar>
                    <div>
                      <p class="review-user">{{ review.user }}</p>
                      <el-rate :model-value="review.rating" disabled size="small" />
                    </div>
                    <span class="review-date">{{ review.date }}</span>
                  </div>
                  <p class="review-content">{{ review.content }}</p>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import useCartStore from '@/stores/cart'
import useUserStore from '@/stores/user'
import { getProductDetail } from '@/api/product'
import { generatePlaceholder, getProductImages, getBrandColor, matchLocalImage } from '@/utils/placeholders'
import { formatPrice } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const productId = computed(() => route.params.id)
const loading = ref(false)
const addingToCart = ref(false)
const quantity = ref(1)
const activeTab = ref('intro')
const currentImage = ref('')

// ============= 商品数据 =============
const product = ref({
  name: '',
  price: 0,
  stockCount: 0,
  specifications: [],
  mainImage: '',
  images: [],
})

// 商品图片列表：优先使用后端真实图片(headerPic)
const galleryImages = computed(() => {
  // images 已在 loadProduct 中处理为 URL 数组（含 headerPic）
  if (product.value.images?.length > 0) {
    return product.value.images
  }
  const realImg = product.value.headerPic || product.value.mainImage
  if (realImg) {
    return [realImg]
  }
  // 无真实图时生成占位图
  return getProductImages(product.value, 4)
})

// 初始化当前图片
watch(galleryImages, (imgs) => {
  if (imgs.length > 0 && !currentImage.value) {
    currentImage.value = imgs[0]
  }
}, { immediate: true })

const specGroups = computed(() => product.value.specifications || [])
const selectedSku = ref({})

const productAttributes = computed(() => [
  { label: '商品名称', value: product.value.name || '--' },
  { label: '商品编号', value: product.value.id || '--' },
  { label: '品牌', value: product.value.brandName || '--' },
  { label: '商品毛重', value: product.value.weight || '500g' },
  { label: '商品产地', value: product.value.origin || '中国大陆' },
  { label: '材质', value: product.value.material || '--' },
])

const hasOriginalPrice = computed(() => {
  return product.value.originalPrice && product.value.originalPrice > product.value.price
})

const specTableData = computed(() => {
  const specs = []
  product.value.specifications?.forEach(spec => {
    spec.specificationOptions?.forEach(opt => {
      specs.push({ label: spec.specName, value: opt.optionName })
    })
  })
  if (specs.length === 0) specs.push({ label: '默认', value: '标准版' })
  return specs
})

const reviewTags = ['质量好', '发货快', '性价比高', '包装精美', '颜色正']
const reviews = [
  { id: 1, user: '张***生', rating: 5, date: '2024-06-15', content: '商品质量非常好，发货速度快，包装很用心。使用了一段时间，效果很棒，强烈推荐！' },
  { id: 2, user: '李***姐', rating: 5, date: '2024-06-12', content: '第二次购买了，质量一如既往的好。客服态度也很好，物流很快。' },
  { id: 3, user: '王***哥', rating: 4, date: '2024-06-10', content: '整体不错，性价比很高。就是物流稍微慢了一天，不过商品没问题。' },
]

function formatSales(sales) {
  if (!sales) return '0'
  if (sales >= 10000) return (sales / 10000).toFixed(1) + '万'
  if (sales >= 1000) return (sales / 1000).toFixed(1) + 'k'
  return String(sales)
}

async function loadProduct() {
  loading.value = true
  try {
    const res = await getProductDetail(productId.value)
    const data = res.data
    if (!data || !data.id) {
      throw new Error('商品详情获取失败')
    }
    // 后端 GoodsDesc 字段映射为前端期望的字段名
    // 过滤内网 FastDFS 地址（前端无法访问），用占位图替代
    const rawHeaderPic = data.headerPic || data.mainImage || ''
    const isInternal = url => !url || url.includes('192.168.') || url.includes('127.0.0.1')
    const headerPic = isInternal(rawHeaderPic)
      ? matchLocalImage(data.goodsName || data.name || '') || generatePlaceholder(data.goodsName || data.name || '', 600, 600)
      : rawHeaderPic
    // images 是 List<GoodsImage> 对象数组，提取 imageUrl
    // 过滤掉内网 FastDFS 地址（前端无法访问），只保留可访问的真实图片
    const imageUrls = (data.images || [])
      .map(i => i.imageUrl || i)
      .filter(url => url && !isInternal(url))
    const allImages = [headerPic, ...imageUrls].filter(Boolean)
    // 品牌对象取 name
    const brandName = typeof data.brand === 'object' ? data.brand?.name : data.brand
    product.value = {
      ...data,
      // 字段名兼容：前端模板用 name，后端返回 goodsName
      name: data.goodsName || data.name || '',
      // 品牌名兼容
      brandName: brandName || data.brandName || '',
      // 主图
      mainImage: headerPic,
      headerPic: headerPic,
      // 后端无 stockCount/sales 字段，补充默认值用于展示
      stockCount: data.stockCount ?? 100,
      sales: data.sales ?? (() => {
        const idStr = String(data.id) + (data.goodsName || '')
        let hash = 0
        for (let i = 0; i < idStr.length; i++) {
          hash = ((hash << 5) - hash + idStr.charCodeAt(i)) | 0
        }
        return 100 + (Math.abs(hash) % 9900)
      })(),
      // 多图列表
      images: allImages.length > 0 ? allImages : undefined,
    }
    // 后端返回的规格结构已是 Specification 数组，直接保留
    if (data.specifications) {
      product.value.specifications = data.specifications
    }
    currentImage.value = headerPic
  } catch {
    // 离线模式：从 mock 数据取
    const { getMockProductDetail } = await import('@/mock')
    const mock = getMockProductDetail(productId.value)
    if (mock) {
      product.value = mock
      currentImage.value = mock.mainImage
    } else {
      // 最终 fallback
      product.value = {
        id: productId.value,
        name: `商品 ${productId.value}`,
        caption: '商品描述',
        price: 2999,
        originalPrice: 3999,
        stockCount: 100,
        sales: 5678,
        brandName: '品牌',
        mainImage: generatePlaceholder('商品', 600, 600),
        images: [
          generatePlaceholder('商品 1', 600, 600),
          generatePlaceholder('商品 2', 600, 600),
          generatePlaceholder('商品 3', 600, 600),
        ],
        specifications: [
          { specName: '颜色', specificationOptions: [
            { id: 1, optionName: '陶瓷白' }, { id: 2, optionName: '陶瓷黑' },
          ]},
          { specName: '版本', specificationOptions: [
            { id: 4, optionName: '128GB' }, { id: 5, optionName: '256GB' },
          ]},
        ],
      }
      currentImage.value = product.value.mainImage
    }
  } finally {
    loading.value = false
  }
}

async function handleAddToCart() {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({ name: 'Login', query: { redirect: route.fullPath } })
    return
  }
  addingToCart.value = true
  try {
    await cartStore.addToCart(productId.value, {
      quantity: quantity.value,
      specId: Object.values(selectedSku.value).join('/'),
      product: {
        id: product.value.id,
        goodsName: product.value.goodsName || product.value.name,
        name: product.value.name || product.value.goodsName,
        price: product.value.price,
        headerPic: product.value.headerPic || product.value.mainImage,
      },
    })
    ElMessage.success('已成功添加到购物车 ✓')
  } catch (error) {
    // 离线（后端未启动）时降级提示，业务错误由响应拦截器提示；不再伪装成功
    if (error?.__offline) {
      ElMessage.warning('网络异常，加入购物车未生效')
    } else {
      ElMessage.error('加入购物车失败')
    }
  } finally {
    addingToCart.value = false
  }
}

function handleBuyNow() {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({ name: 'Login', query: { redirect: route.fullPath } })
    return
  }
  router.push({
    name: 'OrderConfirm',
    query: {
      productId: productId.value,
      quantity: quantity.value,
      spec: JSON.stringify(selectedSku.value),
    },
  })
}

onMounted(loadProduct)
</script>

<style scoped lang="scss">
.product-detail-page {
  background: $bg-color;
  min-height: calc(100vh - 160px);
}

.breadcrumb { padding: 16px 0; }

.product-info-section {
  display: flex;
  gap: 28px;
  background: #fff;
  border-radius: $border-radius-small;
  padding: 28px;
  margin-bottom: 20px;
  border: 1px solid $border-color-light;
}

.product-gallery {
  width: 420px;
  flex-shrink: 0;

  .main-image {
    width: 420px;
    height: 420px;
    border: 1px solid $border-color-light;
    border-radius: $border-radius-small;
    overflow: hidden;
    @include flex-center;
    background: $bg-color;

    img {
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
    }
  }

  .thumbnail-list {
    display: flex;
    gap: 10px;
    margin-top: 12px;

    .thumbnail {
      width: 72px;
      height: 72px;
      border: 2px solid transparent;
      border-radius: $border-radius-base;
      overflow: hidden;
      cursor: pointer;
      transition: $transition-fast;
      background: $bg-color;

      &.active { border-color: $primary-color; }

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        padding: 4px;
      }
    }
  }
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-title {
  font-size: 20px;
  font-weight: 600;
  color: $text-primary;
  line-height: 1.4;
  margin-bottom: 4px;
}

.product-subtitle {
  font-size: 13px;
  color: $danger-color;
  margin-bottom: 16px;
}

.price-box {
  background: linear-gradient(135deg, #fef2f2, #fff);
  border-radius: $border-radius-small;
  padding: 18px;
  margin-bottom: 18px;
  border: 1px solid #fecaca;

  .price-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 6px;
    &:last-child { margin-bottom: 0; }
  }

  .price-label { font-size: 13px; color: $text-secondary; width: 42px; }

  .current-price {
    font-size: 28px;
    font-weight: 700;
    color: $danger-color;
    line-height: 1;
    em { font-size: 16px; font-style: normal; }
  }

  .seckill-price {
    font-size: 22px;
    font-weight: 700;
    color: #ff6e40;
    em { font-size: 14px; font-style: normal; }
  }

  .original-price {
    font-size: 13px;
    color: $text-placeholder;
    text-decoration: line-through;
  }
}

.info-rows {
  margin-bottom: 16px;

  .info-row {
    display: flex;
    margin-bottom: 8px;
    font-size: 13px;
    color: $text-regular;

    .label { color: $text-secondary; width: 42px; flex-shrink: 0; }
    .tags { display: flex; gap: 6px; flex-wrap: wrap; }
    .brand-tag { font-weight: 600; font-size: 13px; }
  }

  .low-stock { color: $warning-color; font-weight: 500; }
}

.sku-section {
  margin-bottom: 18px;

  .sku-group {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
  }

  .sku-label {
    font-size: 13px; color: $text-secondary;
    width: 42px; flex-shrink: 0; line-height: 28px;
  }

  .sku-options {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .sku-option {
    padding: 5px 14px;
    border: 1px solid $border-color;
    border-radius: $border-radius-base;
    cursor: pointer;
    font-size: 13px;
    transition: $transition-fast;

    &:hover { border-color: $primary-color; }
    &.active {
      border-color: $primary-color;
      background: $primary-bg;
      color: $primary-color;
      font-weight: 500;
    }
  }
}

.action-section {
  display: flex;
  gap: 20px;
  align-items: flex-end;

  .quantity-group {
    display: flex;
    align-items: center;
    gap: 8px;
    .label { font-size: 13px; color: $text-secondary; }
  }

  .action-buttons {
    display: flex;
    gap: 12px;
    .el-button { min-width: 140px; height: 44px; font-size: 16px; font-weight: 500; }
  }
}

.product-detail-section {
  background: #fff;
  border-radius: $border-radius-small;
  overflow: hidden;
  border: 1px solid $border-color-light;

  :deep(.el-tabs__content) { padding: 0; }
  .tab-content { padding: 24px; min-height: 300px; }
}

.intro-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 24px;
  .intro-item {
    display: flex;
    font-size: 13px;
    .attr-label { color: $text-secondary; width: 80px; flex-shrink: 0; }
    .attr-value { color: $text-primary; }
  }
}

.desc-images img {
  width: 100%;
  margin-bottom: 10px;
  border-radius: $border-radius-base;
}

.desc-placeholder { text-align: center; padding: 40px; }

.review-summary {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid $border-color-light;
  margin-bottom: 20px;
  .review-score { text-align: center;
    .score-num { font-size: 36px; font-weight: 700; color: $danger-color; display: block; }
  }
  .review-tags { display: flex; gap: 6px; flex-wrap: wrap; }
}

.review-item {
  padding: 16px 0;
  border-bottom: 1px solid $border-color-light;
  .review-header {
    display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
    .review-user { font-size: 13px; color: $text-primary; margin-bottom: 2px; }
    .review-date { margin-left: auto; font-size: 12px; color: $text-secondary; }
  }
  .review-content { font-size: 13px; color: $text-regular; line-height: 1.6; }
}

// ========== 响应式 ==========
@include respond-to('tablet') {
  .product-gallery {
    width: 340px;
    .main-image { width: 340px; height: 340px; }
  }
  .intro-grid { grid-template-columns: 1fr; }
}

@include respond-to('mobile') {
  .breadcrumb { padding: 12px 0; }
  .product-info-section { flex-direction: column; gap: 16px; padding: 16px; }
  .product-gallery {
    width: 100%;
    .main-image { width: 100%; height: auto; aspect-ratio: 1/1; max-width: 420px; margin: 0 auto; }
    .thumbnail-list { justify-content: flex-start; }
  }
  .product-title { font-size: 17px; }
  .price-box { padding: 12px; .current-price { font-size: 24px; } }
  .action-section {
    flex-direction: column; align-items: stretch; gap: 14px;
    .action-buttons { display: flex; gap: 10px;
      .el-button { flex: 1; min-width: 0; height: 42px; font-size: 15px; }
    }
  }
  .intro-grid { grid-template-columns: 1fr; }
  .product-detail-section .tab-content { padding: 14px; }
  .review-summary { flex-direction: column; align-items: flex-start; gap: 12px; }
}
</style>
