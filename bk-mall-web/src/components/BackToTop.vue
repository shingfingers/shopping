<template>
  <Transition name="back-top-fade">
    <div v-show="visible" class="back-to-top" @click="scrollToTop">
      <el-icon :size="22"><Top /></el-icon>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  /** 滚动超过多少像素显示按钮 */
  threshold: {
    type: Number,
    default: 400,
  },
  /** 滚动目标选择器 */
  target: {
    type: String,
    default: '',
  },
})

const visible = ref(false)

function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  visible.value = scrollTop > props.threshold
}

function scrollToTop() {
  const el = props.target ? document.querySelector(props.target) : window
  if (el) {
    el.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.back-to-top {
  position: fixed;
  right: 40px;
  bottom: 60px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #fff;
  box-shadow: $shadow-md;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: $text-regular;
  z-index: 999;
  transition: $transition-base;

  &:hover {
    background: $primary-color;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba($primary-color, 0.3);
  }
}

/* 过渡动画 */
.back-top-fade-enter-active,
.back-top-fade-leave-active {
  transition: $transition-base;
}

.back-top-fade-enter-from,
.back-top-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
