<template>
  <DefaultLayout>
    <div class="product-list-page">
      <!-- 面包屑导航 -->
      <div class="breadcrumb-bar">
        <div class="section-inner">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentCategory">分类</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentCategory">{{ currentCategory.name }}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="keyword">搜索"{{ keyword }}"</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>

      <div class="section-inner">
        <div class="content-layout">
          <!-- 左侧筛选 -->
          <aside class="filter-sidebar">
            <!-- 分类筛选 -->
            <div class="filter-group">
              <h4 class="filter-title">商品分类</h4>
              <div class="category-tree">
                <div
                  v-for="cat in categoryTree"
                  :key="cat.id"
                  class="cat-node"
                  :class="{ active: activeCatId === cat.id }"
                  @click="selectCategory(cat)"
                >
                  <span>{{ cat.name }}</span>
                  <el-icon v-if="activeCatId === cat.id"><Check /></el-icon>
                </div>
              </div>
            </div>

            <!-- 价格区间 -->
            <div class="filter-group">
              <h4 class="filter-title">价格区间</h4>
              <div class="price-range">
                <div
                  v-for="range in priceRanges"
                  :key="range.label"
                  class="price-option"
                  :class="{ active: activePriceRange === range.value }"
                  @click="selectPriceRange(range.value)"
                >
                  {{ range.label }}
                </div>
              </div>
            </div>

            <!-- 品牌 -->
            <div class="filter-group">
              <h4 class="filter-title">品牌</h4>
              <el-input
                v-model="brandSearch"
                size="small"
                placeholder="搜索品牌"
                clearable
              />
              <div class="brand-list">
                <div
                  v-for="brand in filteredBrands"
                  :key="brand"
                  class="brand-option"
                  :class="{ active: activeBrand === brand }"
                  @click="activeBrand = activeBrand === brand ? '' : brand"
                >
                  {{ brand }}
                </div>
              </div>
            </div>

            <el-button type="primary" class="reset-btn" @click="resetFilters">
              重置筛选
            </el-button>
          </aside>

          <!-- 右侧商品区 -->
          <div class="main-content">
            <!-- 排序栏 -->
            <div class="sort-bar">
              <div class="sort-options">
                <span
                  v-for="sort in sortOptions"
                  :key="sort.value"
                  class="sort-item"
                  :class="{ active: activeSort === sort.value }"
                  @click="handleSort(sort.value)"
                >
                  {{ sort.label }}
                  <el-icon v-if="activeSort === sort.value && sort.value !== 'comprehensive'">
                    <component :is="sortOrder === 'asc' ? 'Top' : 'Bottom'" />
                  </el-icon>
                </span>
              </div>
              <div class="total-count">
                共 <b>{{ total }}</b> 件商品
              </div>
              <!-- 移动端筛选按钮 -->
              <el-button class="filter-toggle" @click="filterDrawerOpen = true">
                <el-icon><Filter /></el-icon>
                <span>筛选</span>
              </el-button>
            </div>

            <!-- 商品网格 -->
            <div class="product-grid" v-loading="loading">
              <template v-if="loadError">
                <div class="error-wrapper">
                  <ErrorState message="商品列表加载失败" :on-retry="retryLoad" />
                </div>
              </template>
              <template v-else-if="products.length > 0">
                <ProductCard
                  v-for="product in products"
                  :key="product.id || product.goodsId"
                  :product="product"
                />
              </template>
              <template v-else-if="!loading">
                <el-empty description="没有找到符合条件的商品" :image-size="120" />
              </template>
              <template v-else>
                <Skeleton v-for="n in 8" :key="n" />
              </template>
            </div>

            <!-- 分页 -->
            <div class="pagination-bar" v-if="total > pageSize">
              <el-pagination
                v-model:current-page="currentPage"
                :page-size="pageSize"
                :total="total"
                layout="prev, pager, next, jumper, total"
                background
                @current-change="handlePageChange"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 移动端筛选抽屉 -->
      <el-drawer
        v-model="filterDrawerOpen"
        title="筛选条件"
        direction="ltr"
        size="80%"
        class="filter-drawer"
      >
        <div class="filter-drawer-content">
          <!-- 分类筛选 -->
          <div class="filter-group">
            <h4 class="filter-title">商品分类</h4>
            <div class="category-tree">
              <div
                v-for="cat in categoryTree"
                :key="cat.id"
                class="cat-node"
                :class="{ active: activeCatId === cat.id }"
                @click="selectCategory(cat)"
              >
                <span>{{ cat.name }}</span>
                <el-icon v-if="activeCatId === cat.id"><Check /></el-icon>
              </div>
            </div>
          </div>

          <!-- 价格区间 -->
          <div class="filter-group">
            <h4 class="filter-title">价格区间</h4>
            <div class="price-range">
              <div
                v-for="range in priceRanges"
                :key="range.label"
                class="price-option"
                :class="{ active: activePriceRange === range.value }"
                @click="selectPriceRange(range.value)"
              >
                {{ range.label }}
              </div>
            </div>
          </div>

          <!-- 品牌 -->
          <div class="filter-group">
            <h4 class="filter-title">品牌</h4>
            <el-input
              v-model="brandSearch"
              size="small"
              placeholder="搜索品牌"
              clearable
            />
            <div class="brand-list">
              <div
                v-for="brand in filteredBrands"
                :key="brand"
                class="brand-option"
                :class="{ active: activeBrand === brand }"
                @click="activeBrand = activeBrand === brand ? '' : brand"
              >
                {{ brand }}
              </div>
            </div>
          </div>

          <el-button type="primary" class="reset-btn" @click="resetFilters">
            重置筛选
          </el-button>
        </div>
      </el-drawer>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ProductCard from '@/components/ProductCard.vue'
import Skeleton from '@/components/Skeleton.vue'
import ErrorState from '@/components/ErrorState.vue'
import { getProductList, getCategoryTree, getProductTypeTree } from '@/api/product'
import { generatePlaceholder } from '@/utils/placeholders'

const route = useRoute()
const router = useRouter()

// ============= URL参数 =============
const keyword = ref(route.query.keyword || '')
const activeCatId = ref(Number(route.query.categoryId) || null)

// 移动端筛选抽屉
const filterDrawerOpen = ref(false)

// ============= 分类树 =============
const categoryTree = ref([])
const currentCategory = computed(() => {
  if (!activeCatId.value) return null
  return categoryTree.value.find(c => c.id === activeCatId.value) || null
})

// ============= 筛选条件 =============
const activePriceRange = ref('')
const activeBrand = ref('')
const brandSearch = ref('')

const priceRanges = [
  { label: '全部', value: '' },
  { label: '0-99元', value: '0-99' },
  { label: '100-299元', value: '100-299' },
  { label: '300-999元', value: '300-999' },
  { label: '1000-2999元', value: '1000-2999' },
  { label: '3000元以上', value: '3000-' },
]

const allBrands = ['华为', '小米', '苹果', '三星', '海尔', '格力', '美的', 'TCL', '耐克', '阿迪达斯', '戴尔', '联想', '索尼', '飞利浦']

const filteredBrands = computed(() => {
  if (!brandSearch.value) return allBrands
  return allBrands.filter(b => b.toLowerCase().includes(brandSearch.value.toLowerCase()))
})

// ============= 排序 =============
const activeSort = ref('comprehensive')
const sortOrder = ref('desc')

const sortOptions = [
  { label: '综合', value: 'comprehensive' },
  { label: '销量', value: 'sales' },
  { label: '价格', value: 'price' },
  { label: '新品', value: 'newest' },
]

// ============= 分页 =============
const currentPage = ref(1)
const pageSize = 20
const total = ref(0)

// ============= 商品列表 =============
const products = ref([])
const loading = ref(false)
const loadError = ref(false)

// ============= 方法 =============

// 选择分类
function selectCategory(cat) {
  activeCatId.value = activeCatId.value === cat.id ? null : cat.id
  currentPage.value = 1
  updateQuery()
  loadProducts()
}

// 选择价格区间
function selectPriceRange(range) {
  activePriceRange.value = activePriceRange.value === range ? '' : range
  currentPage.value = 1
  loadProducts()
}

// 排序
function handleSort(sort) {
  if (activeSort.value === sort) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    activeSort.value = sort
    sortOrder.value = 'desc'
  }
  currentPage.value = 1
  loadProducts()
}

// 分页切换
function handlePageChange(page) {
  currentPage.value = page
  loadProducts()
}

// 重置筛选
function resetFilters() {
  activeCatId.value = null
  activePriceRange.value = ''
  activeBrand.value = ''
  activeSort.value = 'comprehensive'
  sortOrder.value = 'desc'
  currentPage.value = 1
  updateQuery()
  loadProducts()
}

// 更新URL
function updateQuery() {
  router.replace({
    query: {
      ...(keyword.value && { keyword: keyword.value }),
      ...(activeCatId.value && { categoryId: activeCatId.value }),
    },
  })
}

// 加载商品列表
async function loadProducts() {
  loading.value = true
  loadError.value = false
  try {
    const params = {
      page: currentPage.value,
      size: pageSize,
      // 排序字段对齐后端：sortFiled(NEW/PRICE/SALES) + sort(ASC/DESC)，综合不传
      ...(activeSort.value !== 'comprehensive' && {
        sortFiled: activeSort.value === 'newest' ? 'NEW' : activeSort.value === 'price' ? 'PRICE' : 'SALES',
        sort: sortOrder.value.toUpperCase(),
      }),
      ...(activeCatId.value && { categoryId: activeCatId.value }),
      ...(keyword.value && { keyword: keyword.value }),
      ...(activeBrand.value && { brand: activeBrand.value }),
    }
    // 价格区间解析为 lowPrice/highPrice 传给后端
    if (activePriceRange.value) {
      const [low, high] = activePriceRange.value.split('-')
      if (low) params.lowPrice = Number(low)
      if (high) params.highPrice = Number(high)
    }
    const res = await getProductList(params)
    // 后端返回 GoodsSearchResult，商品列表在 goodsPage.records 中
    const records = res.data?.goodsPage?.records || res.data?.records || res.data || []
    const list = Array.isArray(records) ? records : []

    if (list.length > 0) {
      // 后端 GoodsES 无 sales 字段，补充随机销量数据用于展示
      list.forEach(p => {
        if (p.sales === undefined || p.sales === null) {
          // 基于商品 id 整体 hash 生成稳定的伪随机销量，避免每次切换页码销量跳变
          const idStr = String(p.id) + (p.goodsName || '')
          let hash = 0
          for (let i = 0; i < idStr.length; i++) {
            hash = ((hash << 5) - hash + idStr.charCodeAt(i)) | 0
          }
          p.sales = 100 + (Math.abs(hash) % 9900)
        }
      })
      products.value = list
      total.value = res.data?.goodsPage?.total || res.data?.total || list.length
    } else {
      // API 返回空数据时降级到 mock
      throw new Error('empty result')
    }
  } catch (err) {
    // 后端不可用或无数据时，显示空状态（不生成 mock 商品）
    products.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 重试加载
function retryLoad() {
  currentPage.value = 1
  loadProducts()
}

// 加载分类（使用真实商品分类接口）
async function loadCategories() {
  try {
    const res = await getProductTypeTree()
    const list = res.data || []
    categoryTree.value = list
      .filter(i => !i.parentId || i.parentId === 0 || i.level === 1)
      .map(i => ({ id: i.id, name: i.name, children: list.filter(c => c.parentId === i.id).map(c => ({ id: c.id, name: c.name })) }))
    if (categoryTree.value.length === 0) throw new Error('empty')
  } catch {
    categoryTree.value = [
      { id: 1, name: '手机数码' },
      { id: 2, name: '电脑办公' },
      { id: 3, name: '家用电器' },
      { id: 4, name: '服饰鞋靴' },
      { id: 5, name: '美妆护肤' },
      { id: 6, name: '食品生鲜' },
      { id: 7, name: '家居家装' },
      { id: 8, name: '图书文娱' },
    ]
  }
}

// 监听品牌筛选
watch(activeBrand, () => {
  currentPage.value = 1
  loadProducts()
})

// 监听路由参数变化
watch(() => route.query, (newQuery) => {
  keyword.value = newQuery.keyword || ''
  activeCatId.value = Number(newQuery.categoryId) || null
  currentPage.value = 1
  loadProducts()
})

onMounted(() => {
  loadCategories()
  loadProducts()
})
</script>

<style scoped lang="scss">
.product-list-page {
  background: $bg-color;
  min-height: calc(100vh - 160px);
}

.section-inner {
  width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.breadcrumb-bar {
  background: #fff;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  .section-inner {
    padding: 0 20px;
  }
}

.content-layout {
  display: flex;
  gap: 16px;
  padding: 20px 0;
}

// ==================== 左侧筛选 ====================
.filter-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  height: fit-content;
  position: sticky;
  top: 168px;
}

.filter-group {
  margin-bottom: 20px;

  .filter-title {
    font-size: 14px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 10px;
  }
}

.category-tree {
  .cat-node {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 10px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 13px;
    color: $text-regular;
    transition: all 0.2s;

    &:hover { background: $bg-color; }
    &.active {
      background: rgba($primary-color, 0.08);
      color: $primary-color;
      font-weight: 500;
    }
  }
}

.price-option {
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 12px;
  color: $text-regular;
  transition: all 0.2s;
  margin-bottom: 2px;

  &:hover { background: $bg-color; }
  &.active {
    background: rgba($primary-color, 0.08);
    color: $primary-color;
  }
}

.brand-list {
  max-height: 200px;
  overflow-y: auto;
  margin-top: 8px;

  .brand-option {
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 12px;
    color: $text-regular;
    transition: all 0.2s;

    &:hover { background: $bg-color; }
    &.active {
      background: rgba($primary-color, 0.08);
      color: $primary-color;
    }
  }
}

.reset-btn {
  width: 100%;
}

// ==================== 右侧商品区 ====================
.main-content {
  flex: 1;
  min-width: 0;
}

.sort-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 0 16px;
  height: 48px;
  margin-bottom: 16px;

  .sort-options {
    display: flex;
    gap: 4px;
  }

  .sort-item {
    padding: 6px 14px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 13px;
    color: $text-regular;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 2px;

    &:hover {
      background: $bg-color;
    }

    &.active {
      background: rgba($primary-color, 0.08);
      color: $primary-color;
      font-weight: 500;
    }
  }

  .total-count {
    font-size: 12px;
    color: $text-secondary;

    b { color: $primary-color; }
  }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  min-height: 400px;
}

.pagination-bar {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  padding-bottom: 20px;
}

// 移动端筛选按钮（默认隐藏）
.filter-toggle {
  display: none;
  margin-left: auto;
}

// ========== 响应式适配 ==========
@include respond-to('tablet') {
  .section-inner {
    width: 100%;
  }

  // 平板：商品网格改为 3 列
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@include respond-to('mobile') {
  .section-inner {
    width: 100%;
    padding: 0 12px;
  }

  // 隐藏桌面端左侧筛选（改由抽屉承担）
  .filter-sidebar {
    display: none;
  }

  // 显示移动端筛选按钮
  .filter-toggle {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  // 内容区改为纵向
  .content-layout {
    flex-direction: column;
    gap: 12px;
    padding: 12px 0;
  }

  // 排序栏自适应换行
  .sort-bar {
    flex-wrap: wrap;
    height: auto;
    padding: 10px 12px;
    gap: 8px;

    .sort-options {
      flex-wrap: wrap;
      gap: 4px;
    }

    .sort-item {
      padding: 5px 10px;
      font-size: 12px;
    }

    .total-count {
      font-size: 11px;
    }
  }

  // 商品网格改为 2 列
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    min-height: 200px;
  }

  // 分页栏紧凑
  .pagination-bar {
    margin-top: 20px;
    padding-bottom: 16px;
  }
}
</style>
