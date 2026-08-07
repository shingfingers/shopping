<template>
  <div class="brand-panel">
    <div class="brand-overlay">
      <router-link to="/" class="brand-logo">
        <span class="logo-icon">BK</span>
        <span class="logo-text">BK商城</span>
      </router-link>
      <h1>品质生活，尽在BK</h1>
      <p>百万品质好物，尽享超值优惠</p>
      <div class="brand-features">
        <div class="feature-item">
          <el-icon :size="20"><CircleCheckFilled /></el-icon>
          <span>正品保障</span>
        </div>
        <div class="feature-item">
          <el-icon :size="20"><Van /></el-icon>
          <span>极速物流</span>
        </div>
        <div class="feature-item">
          <el-icon :size="20"><Headset /></el-icon>
          <span>售后无忧</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CircleCheckFilled, Van, Headset } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.brand-panel {
  flex: 1;
  background: linear-gradient(135deg, $bg-color-dark 0%, #2d1b3d 40%, $bg-color-dark 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: $border-radius-round;
    background: radial-gradient(circle, rgba(64, 158, 255, 0.1) 0%, transparent 70%);
    top: -100px;
    right: -100px;
  }

  &::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: $border-radius-round;
    background: radial-gradient(circle, rgba(245, 108, 108, 0.08) 0%, transparent 70%);
    bottom: -80px;
    left: -80px;
  }
}

.brand-overlay {
  text-align: center;
  color: #fff;
  position: relative;
  z-index: 1;
}

.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  margin-bottom: 32px;

  .logo-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, $primary-color, #66b1ff);
    border-radius: 14px;
    @include flex-center;
    color: #fff;
    font-weight: 800;
    font-size: 24px;
  }

  .logo-text {
    font-size: 28px;
    font-weight: 700;
    color: #fff;
  }
}

.brand-panel h1 {
  font-size: 28px;
  margin-bottom: 8px;
}

.brand-panel p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 36px;
}

.brand-features {
  display: flex;
  gap: 32px;
  justify-content: center;

  .feature-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;

    .el-icon { color: rgba(255, 255, 255, 0.8); }
  }
}
</style>
