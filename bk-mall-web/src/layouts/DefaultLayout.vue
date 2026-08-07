<template>
  <div class="default-layout">
    <AppHeader />
    <main class="main-content">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '@/components/Header.vue'
import AppFooter from '@/components/Footer.vue'
</script>

<style scoped lang="scss">
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  width: 100%;

  // 平板/移动端：内容区铺满整个宽度
  @include respond-to('tablet') {
    width: 100%;
  }

  @include respond-to('mobile') {
    width: 100%;
  }
}

// 移动端：隐藏非必要的桌面端装饰元素
@include respond-to('mobile') {
  .desktop-only {
    display: none !important;
  }
}
</style>
