<template>
  <header class="app-header">
    <!-- 顶部工具栏 -->
    <div class="header-top">
      <div class="header-top__inner">
        <div class="header-top__left">
          <span class="welcome-text">欢迎来到BK商城</span>
          <span class="top-sep">|</span>
          <router-link to="/seckill" class="top-link hot">限时秒杀</router-link>
        </div>
        <div class="header-top__right">
          <template v-if="userStore.isLoggedIn">
            <el-dropdown trigger="click" @command="handleUserCommand">
              <span class="user-info">
                <el-avatar :size="22" :src="userStore.avatar" />
                <span class="username">{{ userStore.displayName }}</span>
                <el-icon :size="14"><ArrowDown /></el-icon>
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
            <router-link to="/login" class="top-link">登录</router-link>
            <span class="top-sep">|</span>
            <router-link to="/register" class="top-link">注册</router-link>
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
        <el-button class="menu-toggle" text circle @click="mobileNavOpen = true">
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
              <template v-else-if="searchHistory.length > 0">
                <div class="dropdown-section">
                  <div class="section-title">
                    <span>搜索历史</span>
                    <el-button text size="small" type="primary" @click.stop="clearAllHistory">清空</el-button>
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
              <el-icon :size="24"><ShoppingCartFull /></el-icon>
            </el-badge>
            <span>购物车</span>
          </router-link>
          <router-link to="/orders" class="action-btn" @click="closeAll">
            <el-icon :size="24"><Tickets /></el-icon>
            <span>我的订单</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 分类导航条 -->
    <nav class="header-nav">
      <div class="header-nav__inner">
        <div class="nav-categories">
          <span
            v-for="cat in mainCategories"
            :key="cat.id"
            class="nav-item"
            :class="{ active: activeNav === `category-${cat.id}` }"
            @click="handleNavSelect(`category-${cat.id}`)"
          >
            {{ cat.name }}
          </span>
          <el-dropdown trigger="click" @command="handleNavSelect">
            <span class="nav-item nav-more">
              更多 <el-icon :size="14"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="cat in moreCategories"
                  :key="cat.id"
                  :command="`category-${cat.id}`"
                >
                  {{ cat.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
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
      <el-menu :default-active="activeNav" @select="handleNavSelect">
        <el-menu-item v-for="cat in categories" :key="cat.id" :index="`category-${cat.id}`">
          {{ cat.name }}
        </el-menu-item>
      </el-menu>
    </el-drawer>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { onClickOutside } from '@vueuse/core'
import useUserStore from '@/stores/user'
import useCartStore from '@/stores/cart'
import { getProductTypeTree, autoSuggest } from '@/api/product'
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

const keyword = ref('')
const showDropdown = ref(false)
const suggestions = ref([])
const searchRef = ref(null)
let suggestTimer = null
const mobileNavOpen = ref(false)
const searchHistory = ref([])

const hotSearches = ref([
  { name: '手机', type: 'danger' },
  { name: '笔记本电脑', type: '' },
  { name: '耳机', type: 'success' },
  { name: '空调', type: '' },
  { name: '运动鞋', type: 'warning' },
  { name: '面膜', type: '' },
])

onClickOutside(searchRef, () => { showDropdown.value = false })

function loadSearchHistory() { searchHistory.value = getSearchHistory() }

watch(keyword, (val) => {
  if (suggestTimer) clearTimeout(suggestTimer)
  if (!val || val.trim().length < 1) { suggestions.value = []; return }
  suggestTimer = setTimeout(async () => {
    try {
      const res = await autoSuggest(val.trim())
      suggestions.value = res.data || []
    } catch { suggestions.value = [] }
  }, 300)
})

function handleSearch() {
  const trimmed = keyword.value.trim()
  if (!trimmed) return
  addSearchHistory(trimmed)
  searchHistory.value = getSearchHistory()
  showDropdown.value = false
  router.push({ name: 'ProductList', query: { keyword: trimmed } })
}

function handleClear() { keyword.value = ''; suggestions.value = []; showDropdown.value = true }
function handleSuggestionClick(item) { keyword.value = item; handleSearch() }
function handleHistoryClick(item) { keyword.value = item; handleSearch() }
function removeHistory(item) { removeSearchHistory(item); searchHistory.value = getSearchHistory() }
function clearAllHistory() { clearSearchHistory(); searchHistory.value = [] }

const categories = ref([])
const activeNav = ref('')

const mainCategories = computed(() => categories.value.slice(0, 6))
const moreCategories = computed(() => categories.value.slice(6))

onMounted(async () => {
  await loadCategories()
  if (userStore.isLoggedIn) cartStore.fetchCartList()
  loadSearchHistory()
})

async function loadCategories() {
  try {
    const res = await getProductTypeTree()
    const list = res.data || []
    categories.value = list
      .filter(i => !i.parentId || i.parentId === 0 || i.level === 1)
      .map(i => ({ id: i.id, name: i.name }))
    if (categories.value.length === 0) throw new Error('empty')
  } catch {
    categories.value = [
      { id: 1, name: '手机数码' }, { id: 2, name: '电脑办公' }, { id: 3, name: '家用电器' },
      { id: 4, name: '服饰鞋靴' }, { id: 5, name: '美妆护肤' }, { id: 6, name: '食品生鲜' },
      { id: 7, name: '家居家装' }, { id: 8, name: '图书文娱' },
    ]
  }
}

function handleNavSelect(index) {
  const catId = index.replace('category-', '')
  router.push({ name: 'ProductList', query: { categoryId: catId } })
  closeAll()
}

function handleUserCommand(command) {
  switch (command) {
    case 'orders': router.push('/orders'); break
    case 'profile': router.push({ name: 'OrderList' }); break
    case 'logout': userStore.logout(); ElMessage.success('已安全退出'); break
  }
}

function goTo(path) { router.push(path); closeAll() }
function closeAll() { showDropdown.value = false; mobileNavOpen.value = false }
</script>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: $z-sticky;
  background: #fff;
}

// ========== 顶部工具条 ==========
.header-top {
  background: $bg-color;
  border-bottom: 1px solid $border-color;

  &__inner {
    width: $layout-width;
    margin: 0 auto;
    @include flex-between;
    height: 34px;
    padding: 0 20px;
    font-size: 12px;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.welcome-text { color: $text-secondary; }
.top-sep { color: $border-color; }

.top-link {
  color: $text-regular;
  text-decoration: none;
  transition: $transition-fast;
  &:hover { color: $primary-color; }
  &.hot { color: $danger-color; font-weight: 500; }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  color: $text-regular;
  padding: 2px 6px;
  border-radius: $border-radius-base;
  transition: $transition-fast;
  &:hover { color: $primary-color; background: $primary-bg; }
  .username { max-width: 100px; @include text-ellipsis; }
}

// ========== 主导航区 ==========
.header-main {
  background: #fff;
  border-bottom: 1px solid $border-color-light;

  &__inner {
    width: $layout-width;
    margin: 0 auto;
    display: flex;
    align-items: center;
    height: 72px;
    padding: 0 20px;
    gap: 28px;
  }
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;

  .logo-icon {
    width: 42px;
    height: 42px;
    background: linear-gradient(135deg, $primary-color, $primary-light);
    border-radius: 10px;
    @include flex-center;
    color: #fff;
    font-weight: 800;
    font-size: 16px;
    letter-spacing: 1px;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    .logo-title {
      font-size: 20px;
      font-weight: 700;
      color: $text-primary;
      line-height: 1.2;
    }
    .logo-subtitle {
      font-size: 11px;
      color: $text-secondary;
      letter-spacing: 2px;
    }
  }
}

// ========== 搜索栏 ==========
.search-bar {
  flex: 1;
  max-width: 520px;
  position: relative;

  :deep(.el-input-group__append) {
    .el-button {
      padding: 0 20px;
      border-radius: 0 $border-radius-base $border-radius-base 0;
      font-weight: 500;
    }
  }

  :deep(.el-input__wrapper) {
    border-radius: $border-radius-base 0 0 $border-radius-base;
    box-shadow: 0 0 0 1px $border-color inset;
    transition: $transition-fast;
    &:hover { box-shadow: 0 0 0 1px $primary-light inset; }
    &.is-focus { box-shadow: 0 0 0 2px $primary-color inset; }
  }
}

.search-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid $border-color;
  border-radius: $border-radius-small;
  box-shadow: $shadow-dark;
  z-index: $z-dropdown;
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
    transition: background 0.15s;
    font-size: 13px;
    &:hover { background: $bg-color; }
    .el-icon { color: $text-secondary; font-size: 14px; }
  }
}

.history-tags, .hot-tags {
  padding: 4px 14px 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  .el-tag { cursor: pointer; }
}

.slide-down-enter-active,
.slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from,
.slide-down-leave-to { opacity: 0; transform: translateY(-6px); }

// ========== 快捷操作 ==========
.header-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  .action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    text-decoration: none;
    color: $text-regular;
    font-size: 12px;
    padding: 6px 10px;
    border-radius: $border-radius-base;
    transition: $transition-fast;
    &:hover { color: $primary-color; background: $primary-bg; }
  }
}

// ========== 分类导航条 ==========
.header-nav {
  background: #fff;
  border-bottom: 1px solid $border-color;

  &__inner {
    width: $layout-width;
    margin: 0 auto;
    padding: 0 20px;
  }
}

.nav-categories {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 42px;
}

.nav-item {
  padding: 8px 16px;
  font-size: 14px;
  color: $text-regular;
  cursor: pointer;
  border-radius: $border-radius-base;
  transition: $transition-fast;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;

  &:hover {
    color: $primary-color;
    background: $primary-bg;
  }

  &.active {
    color: $primary-color;
    font-weight: 600;
    background: $primary-bg;
  }
}

.nav-more {
  color: $text-secondary;
  font-size: 13px;
}

// ========== 移动端汉堡菜单 ==========
.menu-toggle {
  display: none;
  flex-shrink: 0;
  color: $text-primary;
}

// ========== 响应式适配 ==========
@include respond-to('tablet') {
  .header-top { display: none; }
  .header-main__inner,
  .header-nav__inner { width: 100%; }
  .search-bar { max-width: none; }
  .logo .logo-text .logo-subtitle { display: none; }
}

@include respond-to('mobile') {
  .header-top,
  .header-nav { display: none; }

  .header-main__inner {
    width: 100%;
    height: auto;
    padding: 8px 12px;
    gap: 10px;
    flex-wrap: wrap;
  }

  .menu-toggle { display: inline-flex; order: 0; }

  .logo {
    gap: 8px;
    flex: 1;
    min-width: 0;
    .logo-icon { width: 36px; height: 36px; font-size: 14px; border-radius: 8px; }
    .logo-text {
      .logo-title { font-size: 17px; }
      .logo-subtitle { display: none; }
    }
  }

  .search-bar {
    flex: 1 1 100%;
    max-width: none;
    order: 3;
    width: 100%;
  }

  .header-actions {
    gap: 6px;
    order: 2;
    margin-left: auto;
    .action-btn span { display: none; }
  }
}
</style>