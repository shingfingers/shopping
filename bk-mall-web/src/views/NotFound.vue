<template>
  <div class="not-found-page">
    <div class="not-found-bg">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>
    <div class="not-found-content">
      <div class="error-code">
        <span class="digit">4</span>
        <span class="digit zero">
          <el-icon :size="100"><WarningFilled /></el-icon>
        </span>
        <span class="digit">4</span>
      </div>
      <h1>页面未找到</h1>
      <p>抱歉，您访问的页面不存在或已被移除</p>
      <div class="actions">
        <el-button type="primary" size="large" @click="$router.push('/')">
          <el-icon><HomeFilled /></el-icon>
          返回首页
        </el-button>
        <el-button size="large" @click="$router.go(-1)">
          <el-icon><Back /></el-icon>
          返回上一页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { WarningFilled, HomeFilled, Back } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.not-found-page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(160deg, #f8fafc 0%, #eef2ff 40%, #f0f5ff 100%);
  overflow: hidden;
}

// 装饰性背景光晕
.not-found-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;

  &-1 {
    width: 420px;
    height: 420px;
    background: rgba($primary-color, 0.12);
    top: -120px;
    right: -80px;
    animation: float-orb 8s ease-in-out infinite;
  }

  &-2 {
    width: 300px;
    height: 300px;
    background: rgba($warning-color, 0.08);
    bottom: -100px;
    left: -60px;
    animation: float-orb 10s ease-in-out infinite reverse;
  }

  &-3 {
    width: 200px;
    height: 200px;
    background: rgba($success-color, 0.08);
    top: 50%;
    left: 50%;
    animation: float-orb 12s ease-in-out infinite 2s;
  }
}

@keyframes float-orb {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

.not-found-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 40px;
}

.error-code {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;

  .digit {
    font-size: 140px;
    font-weight: 900;
    line-height: 1;
    color: $text-primary;
    opacity: 0.15;
    user-select: none;
  }

  .zero {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 140px;
    color: $primary-color;
    opacity: 0.35;
    animation: pulse-icon 2s ease-in-out infinite;
  }
}

@keyframes pulse-icon {
  0%, 100% { opacity: 0.35; transform: scale(1); }
  50% { opacity: 0.55; transform: scale(1.05); }
}

h1 {
  font-size: 26px;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 10px;
}

p {
  font-size: 15px;
  color: $text-secondary;
  margin-bottom: 36px;
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;

  .el-button {
    min-width: 140px;
    border-radius: $border-radius-small;
    font-weight: 500;
  }
}

// 移动端适配
@include respond-to('mobile') {
  .error-code {
    gap: 4px;
    .digit { font-size: 90px; }
    .zero { width: 80px; height: 90px; }
  }

  h1 { font-size: 22px; }
  p { font-size: 14px; margin-bottom: 28px; }

  .actions {
    flex-direction: column;
    align-items: center;
    gap: 12px;
    .el-button { width: 200px; }
  }
}
</style>
