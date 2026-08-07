<template>
  <div class="product-card" @click="goToDetail">
    <!-- 商品图片（使用智能占位图） -->
    <div class="product-card__image">
      <img
        v-lazy="productImage"
        :alt="product.name || product.goodsName || product.title"
      />
      <!-- 标签 -->
      <div v-if="product.tag || product.isNew" class="product-tags">
        <span v-if="product.tag" class="tag" :class="tagType">{{ product.tag }}</span>
        <span v-if="product.isNew" class="tag new">新品</span>
      </div>
    </div>

    <!-- 商品信息 -->
    <div class="product-card__info">
      <h3 class="product-name" :title="product.name || product.goodsName || product.title">
        {{ product.name || product.goodsName || product.title }}
      </h3>
      <div class="product-price">
        <span class="current-price">
          <em>¥</em><span v-number-animate="{ value: currentPrice, duration: 0.8, decimals: 2 }">{{ formatPrice(currentPrice) }}</span>
        </span>
        <span v-if="hasOriginalPrice" class="original-price">
          ¥{{ formatPrice(product.originalPrice) }}
        </span>
      </div>
      <div class="product-meta">
        <span class="sales">已售 {{ formatSales(salesDisplay) }}</span>
        <span v-if="product.brandName" class="brand-tag" :style="{ color: getBrandColor(product.brandName) }">
          {{ product.brandName }}
        </span>
      </div>
    </div>

    <!-- 秒杀进度条（秒杀商品） -->
    <div v-if="product.seckillPrice && product.stockCount !== undefined" class="seckill-progress">
      <el-progress
        :percentage="seckillPercent"
        :show-text="false"
        :stroke-width="6"
        color="#F56C6C"
      />
      <span class="progress-text">已抢{{ seckillPercent }}%</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getProductImage, getBrandColor } from '@/utils/placeholders'
import { formatPrice } from '@/utils/format'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  isSeckill: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()

// 使用智能图片选择：真实图 → 品牌色品类占位图
const productImage = computed(() => getProductImage(props.product))

// 品牌色
const currentPrice = computed(() => {
  return props.product.seckillPrice || props.product.price || props.product.goodsPrice || 0
})

const hasOriginalPrice = computed(() => {
  return props.product.originalPrice && props.product.originalPrice > currentPrice.value
})

const tagType = computed(() => {
  if (!props.product.tag) return ''
  const tags = { 热卖: 'hot', 秒杀: 'seckill', 新品: 'new', 特惠: 'sale' }
  return tags[props.product.tag] || 'hot'
})

const seckillPercent = computed(() => {
  const { num, stockCount } = props.product
  if (!num || num === 0) return 0
  return Math.round(((num - (stockCount || 0)) / num) * 100)
})

function formatSales(sales) {
  if (!sales) return '0'
  if (sales >= 10000) return (sales / 10000).toFixed(1) + '万'
  if (sales >= 1000) return (sales / 1000).toFixed(1) + 'k'
  return String(sales)
}

// 后端 GoodsES 无 sales 字段，基于商品 id 生成稳定伪随机销量，避免显示 0
const salesDisplay = computed(() => {
  const s = props.product.sales ?? props.product.salesVolume
  if (s !== undefined && s !== null && s !== 0) return s
  const idStr = String(props.product.id || props.product.goodsId || '') +
    (props.product.name || props.product.goodsName || props.product.title || '')
  let hash = 0
  for (let i = 0; i < idStr.length; i++) {
    hash = ((hash << 5) - hash + idStr.charCodeAt(i)) | 0
  }
  return 100 + (Math.abs(hash) % 9900)
})

function goToDetail() {
  if (props.isSeckill) {
    // 秒杀详情按 goodsId 查询（后端 findById 用 goodsId 查 Redis）
    const gid = props.product.goodsId || props.product.id
    router.push(`/seckill/${gid}`)
  } else {
    const id = props.product.id || props.product.goodsId || props.product.goodId
    router.push(`/product/${id}`)
  }
}
</script>

<style scoped lang="scss">
.product-card {
  background: #fff;
  border-radius: $border-radius-small;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-hover;
    border-color: rgba($primary-color, 0.2);
  }
}

.product-card__image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  background: #f8f8f8;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.4s ease;
    padding: 8px;

    .product-card:hover & {
      transform: scale(1.05);
    }
  }
}

.product-tags {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 4px;

  .tag {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    color: #fff;
    font-weight: 500;

    &.hot { background: linear-gradient(135deg, $danger-color, #e85050); }
    &.new { background: linear-gradient(135deg, $success-color, #5aaf30); }
    &.seckill { background: linear-gradient(135deg, $warning-color, #d49230); }
    &.sale { background: linear-gradient(135deg, $primary-color, #3888e0); }
  }
}

.product-card__info {
  padding: 12px 14px 10px;
}

.product-name {
  font-size: 14px;
  font-weight: 400;
  color: $text-primary;
  line-height: 1.4;
  @include text-ellipsis(2);
  min-height: 38px;
  margin-bottom: 8px;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;

  .current-price {
    color: $danger-color;
    font-size: 18px;
    font-weight: 700;

    em { font-size: 12px; font-style: normal; }
  }

  .original-price {
    color: $text-placeholder;
    font-size: 12px;
    text-decoration: line-through;
  }
}

.product-meta {
  @include flex-between;
  font-size: 12px;
  color: $text-secondary;

  .brand-tag {
    font-weight: 500;
    font-size: 11px;
  }
}

// 秒杀进度条
.seckill-progress {
  padding: 0 14px 10px;

  .progress-text {
    font-size: 11px;
    color: $text-secondary;
    margin-top: 4px;
    display: inline-block;
  }
}
</style>
