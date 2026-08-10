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
  background: linear-gradient(160deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #1a1a2e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  // 装饰性网格图案
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  // 主光晕 - 蓝
  .bg-orb {
    display: none;
  }
}

// 动态光晕装饰
.brand-panel {
  &::after {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba($primary-color, 0.15) 0%, transparent 70%);
    top: -120px;
    right: -80px;
    animation: brand-orb-1 10s ease-in-out infinite;
  }
}

// 额外光晕用 wrapper
.brand-overlay::before {
  content: '';
  position: absolute;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba($danger-color, 0.08) 0%, transparent 70%);
  bottom: -100px;
  left: -60px;
  animation: brand-orb-2 12s ease-in-out infinite reverse;
  z-index: 0;
}

.brand-overlay::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba($warning-color, 0.06) 0%, transparent 70%);
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: brand-orb-3 8s ease-in-out infinite 2s;
  z-index: 0;
}

@keyframes brand-orb-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-30px, 30px) scale(1.1); }
}

@keyframes brand-orb-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, -20px) scale(1.08); }
}

@keyframes brand-orb-3 {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.15); }
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
  margin-bottom: 36px;

  .logo-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, $primary-color, $primary-light);
    border-radius: 14px;
    @include flex-center;
    color: #fff;
    font-weight: 800;
    font-size: 24px;
    box-shadow: 0 8px 24px rgba($primary-color, 0.3);
  }

  .logo-text {
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 2px;
  }
}

.brand-panel h1 {
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: 600;
  letter-spacing: 1px;
}

.brand-panel p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 40px;
}

.brand-features {
  display: flex;
  gap: 36px;
  justify-content: center;

  .feature-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.65);
    font-size: 14px;
    padding: 10px 18px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: $transition-base;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.85);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .el-icon {
      color: $primary-light;
      font-size: 18px;
    }
  }
}

// 移动端适配
@include respond-to('mobile') {
  .brand-panel {
    flex: none;
    padding: 50px 20px;
    min-height: auto;
  }

  .brand-panel h1 {
    font-size: 22px;
  }

  .brand-panel p {
    font-size: 13px;
    margin-bottom: 28px;
  }

  .brand-features {
    flex-wrap: wrap;
    gap: 12px;

    .feature-item {
      font-size: 12px;
      padding: 8px 14px;
    }
  }

  .brand-logo {
    margin-bottom: 24px;

    .logo-icon {
      width: 44px;
      height: 44px;
      font-size: 20px;
      border-radius: 12px;
    }

    .logo-text {
      font-size: 22px;
    }
  }
}
</style>
