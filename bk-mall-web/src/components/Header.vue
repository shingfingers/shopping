<template>
  <header class="app-header">
    <!-- 顶部工具栏 -->
    <div class="header-top">
      <div class="header-top__inner">
        <div class="header-top__left">
          <span class="welcome-text">欢迎来到BK商城</span>
          <el-divider direction="vertical" />
          <router-link to="/seckill" class="top-link hot">⚡ 限时秒杀</router-link>
        </div>
        <div class="header-top__right">
          <template v-if="userStore.isLoggedIn">
            <el-dropdown trigger="click" @command="handleUserCommand">
              <span class="user-info">
                <el-avatar :size="24" :src="userStore.avatar" />
                <span class="username">{{ userStore.displayName }}</span>
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="orders">
                    <el-icon><Tickets /></el-icon>我的订单
                  </el-dropdown-item>
                  <el-dropdown-item command="profile">
                    <el-icon><User /></el-icon>个人中心
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button text size="small" @click="goTo('/login')">登录</el-button>
            <el-divider direction="vertical" />
            <el-button text size="small" @click="goTo('/register')">注册</el-button>
          </template>
        </div>
      </div>
    </div>

    <!-- 主导航区 -->
    <div class="header-main">
      <div class="header-main__inner">
        <!-- Logo -->
        <router-link to="/" class="logo" @click="closeAll">
          <div class="logo-icon">BK</div>
          <div class="logo-text">
            <span class="logo-title">BK商城</span>
            <span class="logo-subtitle">品质生活，尽在BK</span>
          </div>
        </router-link>

        <!-- 移动端汉堡菜单按钮 -->
        <el-button
          class="menu-toggle"
          text
          circle
          @click="mobileNavOpen = true"
        >
          <el-icon :size="24"><Menu /></el-icon>
        </el-button>

        <!-- 搜索栏 -->
        <div ref="searchRef" class="search-bar">
          <el-input
            v-model="keyword"
            size="large"
            placeholder="搜索商品、品牌、分类..."
            clearable
            @keyup.enter="handleSearch"
            @clear="handleClear"
            @focus="showDropdown = true"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
            <template #append>
              <el-button type="primary" :icon="Search" @click="handleSearch">
                搜索
              </el-button>
            </template>
          </el-input>

          <!-- 搜索下拉面板 -->
          <transition name="slide-down">
            <div v-if="showDropdown" class="search-dropdown">
              <!-- 搜索建议 -->
              <template v-if="keyword.trim() && suggestions.length > 0">
                <div class="dropdown-section">
                  <div class="section-title">搜索建议</div>
                  <div
                    v-for="item in suggestions"
                    :key="item"
                    class="dropdown-item"
                    @click="handleSuggestionClick(item)"
                  >
                    <el-icon><Search /></el-icon>
                    <span>{{ item }}</span>
                  </div>
                </div>
              </template>

              <!-- 搜索历史 -->
              <template v-else-if="searchHistory.length > 0">
                <div class="dropdown-section">
                  <div class="section-title">
                    <span>搜索历史</span>
                    <el-button text size="small" type="primary" @click.stop="clearAllHistory">
                      清空
                    </el-button>
                  </div>
                  <div class="history-tags">
                    <el-tag
                      v-for="item in searchHistory"
                      :key="item"
                      closable
                      size="small"
                      @click="handleHistoryClick(item)"
                      @close.stop="removeHistory(item)"
                    >
                      {{ item }}
                    </el-tag>
                  </div>
                </div>
              </template>

              <!-- 热门搜索 -->
              <template v-else>
                <div class="dropdown-section">
                  <div class="section-title">热门搜索</div>
                  <div class="hot-tags">
                    <el-tag
                      v-for="item in hotSearches"
                      :key="item"
                      :type="item.type"
                      size="small"
                      @click="handleHistoryClick(item.name)"
                    >
                      {{ item.name }}
                    </el-tag>
                  </div>
                </div>
              </template>
            </div>
          </transition>
        </div>

        <!-- 快捷操作 -->
        <div class="header-actions">
          <router-link to="/cart" class="action-btn cart-btn" @click="closeAll">
            <el-badge :value="cartStore.totalCount" :hidden="cartStore.totalCount === 0" :max="99">
              <el-icon :size="26"><ShoppingCartFull /></el-icon>
            </el-badge>
            <span>购物车</span>
          </router-link>
          <router-link to="/orders" class="action-btn" @click="closeAll">
            <el-icon :size="26"><Tickets /></el-icon>
            <span>我的订单</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 分类导航条 -->
    <nav class="header-nav">
      <div class="header-nav__inner">
        <el-menu
          mode="horizontal"
          :default-active="activeNav"
          background-color="#1a1a2e"
          text-color="#ccc"
          active-text-color="#409EFF"
          @select="handleNavSelect"
        >
          <el-sub-menu index="all-products">
            <template #title>
              <el-icon><Menu /></el-icon>
              <span>全部分类</span>
            </template>
            <el-menu-item
              v-for="cat in categories"
              :key="cat.id"
              :index="`category-${cat.id}`"
            >
              {{ cat.name }}
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item
            v-for="cat in mainCategories"
            :key="cat.id"
            :index="`category-${cat.id}`"
          >
            {{ cat.name }}
          </el-menu-item>
        </el-menu>
      </div>
    </nav>

    <!-- 移动端导航抽屉 -->
    <el-drawer
      v-model="mobileNavOpen"
      title="商品分类"
      direction="ltr"
      size="70%"
      class="mobile-nav-drawer"
    >
      <el-menu
        :default-active="activeNav"
        @select="handleNavSelect"
      >
        <el-sub-menu index="all-products">
          <template #title>
            <el-icon><Menu /></el-icon>
            <span>全部分类</span>
          </template>
          <el-menu-item
            v-for="cat in categories"
            :key="cat.id"
            :index="`category-${cat.id}`"
          >
            {{ cat.name }}
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item
          v-for="cat in mainCategories"
          :key="cat.id"
          :index="`category-${cat.id}`"
        >
          {{ cat.name }}
        </el-menu-item>
      </el-menu>
    </el-drawer>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { onClickOutside } from '@vueuse/core'
import useUserStore from '@/stores/user'
import useCartStore from '@/stores/cart'
import { getCategoryTree, getProductTypeTree, autoSuggest } from '@/api/product'
import {
  getSearchHistory,
  addSearchHistory,
  removeSearchHistory,
  clearSearchHistory,
} from '@/utils/searchHistory'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const cartStore = useCartStore()

// ==================== 搜索 ====================
const keyword = ref('')
const showDropdown = ref(false)
const suggestions = ref([])
const searchRef = ref(null)
let suggestTimer = null

// 移动端导航抽屉
const mobileNavOpen = ref(false)

// 搜索历史
const searchHistory = ref([])

// 热门搜索词
const hotSearches = ref([
  { name: '手机', type: 'danger' },
  { name: '笔记本电脑', type: '' },
  { name: '耳机', type: 'success' },
  { name: '空调', type: '' },
  { name: '运动鞋', type: 'warning' },
  { name: '面膜', type: '' },
])

// 点击外部关闭下拉
onClickOutside(searchRef, () => {
  showDropdown.value = false
})

// 加载搜索历史
function loadSearchHistory() {
  searchHistory.value = getSearchHistory()
}

// 搜索关键词变化 -> 获取建议
watch(keyword, (val) => {
  if (suggestTimer) clearTimeout(suggestTimer)
  if (!val || val.trim().length < 1) {
    suggestions.value = []
    return
  }
  suggestTimer = setTimeout(async () => {
    try {
      const res = await autoSuggest(val.trim())
      suggestions.value = res.data || []
    } catch {
      suggestions.value = []
    }
  }, 300)
})

// 执行搜索
function handleSearch() {
  const trimmed = keyword.value.trim()
  if (!trimmed) return

  addSearchHistory(trimmed)
  searchHistory.value = getSearchHistory()
  showDropdown.value = false
  router.push({ name: 'ProductList', query: { keyword: trimmed } })
}

// 清空输入
function handleClear() {
  keyword.value = ''
  suggestions.value = []
  showDropdown.value = true
}

// 点击建议词
function handleSuggestionClick(item) {
  keyword.value = item
  handleSearch()
}

// 点击历史词
function handleHistoryClick(item) {
  keyword.value = item
  handleSearch()
}

// 删除单条历史
function removeHistory(item) {
  removeSearchHistory(item)
  searchHistory.value = getSearchHistory()
}

// 清空所有历史
function clearAllHistory() {
  clearSearchHistory()
  searchHistory.value = []
}

// ==================== 分类 ====================
const categories = ref([])
const activeNav = ref('all-products')

// 主导航显示前 6 个分类
const mainCategories = computed(() => categories.value.slice(0, 6))

// 初始化
onMounted(async () => {
  await loadCategories()
  if (userStore.isLoggedIn) {
    cartStore.fetchCartList()
  }
  loadSearchHistory()
})

// 加载分类（使用真实商品分类接口）
async function loadCategories() {
  try {
    const res = await getProductTypeTree()
    const list = res.data || []
    // 取一级分类用于导航栏
    categories.value = list
      .filter(i => !i.parentId || i.parentId === 0 || i.level === 1)
      .map(i => ({ id: i.id, name: i.name }))
    if (categories.value.length === 0) throw new Error('empty')
  } catch {
    categories.value = [
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

// 分类导航选择
function handleNavSelect(index) {
  if (index === 'all-products') {
    router.push({ name: 'ProductList' })
  } else {
    const catId = index.replace('category-', '')
    router.push({ name: 'ProductList', query: { categoryId: catId } })
  }
  closeAll()
}

// ==================== 用户菜单 ====================
function handleUserCommand(command) {
  switch (command) {
    case 'orders':
      router.push('/orders')
      break
    case 'profile':
      router.push({ name: 'OrderList' })
      break
    case 'logout':
      userStore.logout()
      ElMessage.success('已安全退出')
      break
  }
}

function goTo(path) {
  router.push(path)
  closeAll()
}

function closeAll() {
  showDropdown.value = false
  mobileNavOpen.value = false
}
</script>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: $z-sticky;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

// ========== 顶部工具条 ==========
.header-top {
  background: $bg-color-dark;
  font-size: 12px;
  color: #aaa;

  &__inner {
    width: $layout-width;
    margin: 0 auto;
    @include flex-between;
    height: 36px;
    padding: 0 20px;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 2px;
  }
}

.welcome-text {
  color: #999;
}

.top-link {
  color: #ccc;
  text-decoration: none;
  transition: color 0.2s;

  &.hot {
    color: $danger-color;
    font-weight: 500;
  }

  &:hover {
    color: #fff;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #ccc;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
  }

  .username {
    max-width: 100px;
    @include text-ellipsis;
  }
}

// ========== 主导航区 ==========
.header-main {
  background: #fff;

  &__inner {
    width: $layout-width;
    margin: 0 auto;
    display: flex;
    align-items: center;
    height: 80px;
    padding: 0 20px;
    gap: 30px;
  }
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;

  .logo-icon {
    width: 46px;
    height: 46px;
    background: linear-gradient(135deg, $primary-color, #66b1ff);
    border-radius: 10px;
    @include flex-center;
    color: #fff;
    font-weight: 800;
    font-size: 18px;
    letter-spacing: 1px;
  }

  .logo-text {
    display: flex;
    flex-direction: column;

    .logo-title {
      font-size: 22px;
      font-weight: 700;
      color: $text-primary;
      line-height: 1.2;
    }

    .logo-subtitle {
      font-size: 11px;
      color: $text-secondary;
      letter-spacing: 3px;
    }
  }
}

// ========== 搜索栏 ==========
.search-bar {
  flex: 1;
  max-width: 580px;
  position: relative;

  :deep(.el-input-group__append) {
    .el-button {
      padding: 0 24px;
      border-radius: 0 8px 8px 0;
    }
  }

  :deep(.el-input__wrapper) {
    border-radius: 8px 0 0 8px;
    box-shadow: 0 0 0 2px $primary-color inset;

    &:hover,
    &:focus-within {
      box-shadow: 0 0 0 2px #66b1ff inset;
    }
  }
}

// 搜索下拉面板
.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid $border-color;
  border-radius: 0 0 8px 8px;
  box-shadow: $shadow-dark;
  z-index: $z-dropdown;
  margin-top: 2px;
  padding: 8px 0;
  max-height: 360px;
  overflow-y: auto;
}

.dropdown-section {
  padding: 4px 0;

  .section-title {
    padding: 4px 14px;
    font-size: 12px;
    color: $text-secondary;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .dropdown-item {
    padding: 7px 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: background 0.2s;
    font-size: 13px;

    &:hover {
      background: $bg-color;
    }

    .el-icon {
      color: $text-secondary;
      font-size: 14px;
    }
  }
}

.history-tags,
.hot-tags {
  padding: 4px 14px 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  .el-tag {
    cursor: pointer;
  }
}

// 下拉动画
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

// ========== 快捷操作 ==========
.header-actions {
  display: flex;
  gap: 20px;
  flex-shrink: 0;

  .action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    text-decoration: none;
    color: $text-regular;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 8px;
    transition: all 0.2s;

    &:hover {
      color: $primary-color;
      background: rgba($primary-color, 0.06);
    }
  }

  .cart-btn {
    position: relative;
  }
}

// ========== 分类导航条 ==========
.header-nav {
  background: $bg-color-dark;

  &__inner {
    width: $layout-width;
    margin: 0 auto;
    padding: 0 20px;
  }

  :deep(.el-menu) {
    border-bottom: none;

    .el-menu-item {
      height: 44px;
      line-height: 44px;
      font-size: 14px;
      border-bottom: 2px solid transparent;

      &:hover {
        background: rgba(255, 255, 255, 0.06);
        color: #fff;
      }

      &.is-active {
        border-bottom-color: $primary-color;
        color: $primary-color;
      }
    }

    .el-sub-menu {
      .el-sub-menu__title {
        height: 44px;
        line-height: 44px;
        font-size: 14px;
        border-bottom: 2px solid transparent;
        color: #ccc;

        &:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #fff;
        }
      }

      .el-menu {
        background: #fff;

        .el-menu-item {
          height: 36px;
          line-height: 36px;
          color: $text-regular;

          &:hover {
            background: $bg-color;
            color: $primary-color;
          }
        }
      }
    }
  }
}

// ========== 移动端汉堡菜单按钮（默认隐藏） ==========
.menu-toggle {
  display: none;
  flex-shrink: 0;
  color: $text-primary;
}

// ========== 响应式适配 ==========
@include respond-to('tablet') {
  // 隐藏顶部工具栏
  .header-top {
    display: none;
  }

  // 主导航区铺满宽度
  .header-main__inner,
  .header-nav__inner {
    width: 100%;
  }

  // 简化搜索栏
  .search-bar {
    max-width: none;
  }

  // 缩减 Logo 副标题
  .logo .logo-text .logo-subtitle {
    display: none;
  }
}

@include respond-to('mobile') {
  // 隐藏顶部工具栏与底部导航条（导航改由抽屉承担）
  .header-top,
  .header-nav {
    display: none;
  }

  // 主导航区改为可换行布局
  .header-main__inner {
    width: 100%;
    height: auto;
    padding: 10px 12px;
    gap: 12px;
    flex-wrap: wrap;
    align-items: center;
  }

  // 显示汉堡菜单按钮
  .menu-toggle {
    display: inline-flex;
    order: 0;
  }

  // Logo 简化
  .logo {
    gap: 8px;
    flex: 1;
    min-width: 0;

    .logo-icon {
      width: 38px;
      height: 38px;
      font-size: 15px;
      border-radius: 8px;
    }

    .logo-text {
      .logo-title {
        font-size: 18px;
      }
      .logo-subtitle {
        display: none;
      }
    }
  }

  // 搜索栏改为全宽（独占一行）
  .search-bar {
    flex: 1 1 100%;
    max-width: none;
    order: 3;
    width: 100%;
  }

  // 快捷操作简化：只显示购物车
  .header-actions {
    gap: 10px;
    order: 2;
    margin-left: auto;

    .action-btn {
      span {
        display: none;
      }
    }
  }
}
</style>
