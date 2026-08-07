<template>
  <div class="error-state">
    <el-icon :size="56" color="#F56C6C"><CircleCloseFilled /></el-icon>
    <p class="error-message">{{ message }}</p>
    <el-button type="primary" :icon="Refresh" @click="handleRetry">重试</el-button>
  </div>
</template>

<script setup>
import { CircleCloseFilled, Refresh } from '@element-plus/icons-vue'

const props = defineProps({
  message: {
    type: String,
    default: '加载失败，请稍后重试',
  },
  onRetry: {
    type: Function,
    default: null,
  },
})

function handleRetry() {
  props.onRetry?.()
}
</script>

<style scoped lang="scss">
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 20px;
  text-align: center;

  .error-message {
    font-size: 14px;
    color: $text-secondary;
    margin: 0;
  }
}
</style>
