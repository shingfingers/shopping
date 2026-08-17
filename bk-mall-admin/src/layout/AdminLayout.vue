<template>
  <el-container class="layout">
    <el-aside :width="isCollapse ? '64px' : '210px'" class="aside">
      <div class="logo-area">
        <img src="/favicon.svg" class="logo" alt="logo" />
        <span v-show="!isCollapse" class="logo-text">BK商城管理</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
        class="menu"
      >
        <el-menu-item
          v-for="item in menus"
          :key="item.path"
          :index="item.path"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <template #title>{{ item.title }}</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapse = !isCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="30" class="user-avatar">{{ avatarText }}</el-avatar>
              <span class="username">{{ username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUsername, logout } from '@/api/auth'

const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)
const username = ref('管理员')

const menus = [
  { path: '/dashboard', title: '工作台', icon: 'Odometer' },
  { path: '/goods', title: '商品管理', icon: 'Goods' },
  { path: '/brand', title: '品牌管理', icon: 'CollectionTag' },
  { path: '/productType', title: '分类管理', icon: 'Menu' },
  { path: '/seckill', title: '秒杀管理', icon: 'Timer' },
  { path: '/sensitiveWord', title: '敏感词管理', icon: 'Warning' },
  { path: '/admin', title: '管理员管理', icon: 'User' },
]

const activeMenu = computed(() => route.path)
const currentTitle = computed(() => route.meta.title || '')
const avatarText = computed(() => (username.value ? username.value.charAt(0).toUpperCase() : 'A'))

onMounted(async () => {
  try {
    const res = await getUsername()
    if (res && res.code === 200 && res.data) {
      username.value = res.data
    }
  } catch (e) {
    // 未登录或接口异常，交由拦截器处理
  }
})

async function handleCommand(command) {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
    } catch (e) {
      return
    }
    try {
      await logout()
    } catch (e) {
      // 忽略退出接口异常
    }
    sessionStorage.removeItem('admin_authed')
    ElMessage.success('已退出登录')
    router.replace('/login')
  }
}
</script>

<style scoped>
.layout {
  height: 100vh;
}
.aside {
  background-color: #304156;
  transition: width 0.2s;
  overflow: hidden;
}
.logo-area {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #2b3a4d;
}
.logo-area .logo {
  width: 32px;
  height: 32px;
}
.logo-area .logo-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}
.menu {
  border-right: none;
}
.menu:not(.el-menu--collapse) {
  width: 210px;
}
.header {
  height: 60px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 1;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
}
.collapse-btn:hover {
  color: #409eff;
}
.header-right .user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #303133;
}
.user-avatar {
  background: #409eff;
  color: #fff;
  font-weight: 600;
}
.main {
  background: #f0f2f5;
  padding: 16px;
  overflow: auto;
}
</style>