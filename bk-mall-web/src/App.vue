<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade-slide" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
  <!-- 全局回到顶部按钮 -->
  <BackToTop />
  <!-- 全局 AI 在线客服 -->
  <CustomerService />
</template>

<script setup>
import BackToTop from '@/components/BackToTop.vue'
import CustomerService from '@/components/CustomerService.vue'
</script>

<style>
/* 路由切换动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
</style>
