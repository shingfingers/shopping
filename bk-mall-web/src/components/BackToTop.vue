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

<style scoped>
.back-to-top {
  position: fixed;
  right: 40px;
  bottom: 60px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #606266;
  z-index: 999;
  transition: all 0.3s ease;
}

.back-to-top:hover {
  background: #409EFF;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
}

/* 过渡动画 */
.back-top-fade-enter-active,
.back-top-fade-leave-active {
  transition: all 0.3s ease;
}

.back-top-fade-enter-from,
.back-top-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
