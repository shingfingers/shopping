<template>
  <div class="dashboard">
    <el-row :gutter="16">
      <el-col :xs="12" :sm="12" :md="6" v-for="card in statCards" :key="card.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-inner">
            <div class="stat-icon" :style="{ background: card.bg }">
              <el-icon :size="26"><component :is="card.icon" /></el-icon>
            </div>
            <div>
              <div class="stat-value">{{ card.value }}</div>
              <div class="stat-title">{{ card.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="welcome-card">
      <template #header>
        <span class="card-title"><el-icon><Info /></el-icon> 欢迎使用</span>
      </template>
      <div class="welcome-body">
        <p>欢迎进入 <strong>BK 商城管理后台</strong>，当前登录管理员：<strong>{{ username }}</strong>。</p>
        <p>您可以通过左侧菜单管理商品、品牌、分类、秒杀活动、敏感词以及管理员账号。</p>
        <p class="tip">提示：所有修改操作会实时同步到商城前台，请谨慎操作。</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getUsername } from '@/api/auth'

const username = ref('管理员')

const statCards = ref([
  { title: '商品管理', value: 'Goods', icon: 'Goods', bg: '#409eff' },
  { title: '品牌管理', value: 'Brand', icon: 'CollectionTag', bg: '#67c23a' },
  { title: '分类管理', value: 'Type', icon: 'Menu', bg: '#e6a23c' },
  { title: '管理员管理', value: 'Admin', icon: 'User', bg: '#f56c6c' },
])

onMounted(async () => {
  try {
    const res = await getUsername()
    if (res && res.code === 200 && res.data) {
      username.value = res.data
    }
  } catch (e) {
    // 忽略
  }
})
</script>

<style scoped>
.stat-card {
  margin-bottom: 16px;
}
.stat-inner {
  display: flex;
  align-items: center;
  gap: 14px;
}
.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
}
.stat-title {
  font-size: 13px;
  color: #909399;
  margin-top: 2px;
}
.welcome-card {
  margin-top: 8px;
}
.card-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}
.welcome-body p {
  line-height: 2;
  color: #606266;
}
.welcome-body .tip {
  color: #909399;
  font-size: 13px;
}
</style>