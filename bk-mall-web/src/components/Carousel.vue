<template>
  <div class="bk-carousel" @mouseenter="stopAutoPlay" @mouseleave="startAutoPlay">
    <!-- 指示器 -->
    <div class="bk-carousel__dots" v-if="dots && slides.length > 1">
      <span
        v-for="(_, idx) in slides"
        :key="idx"
        class="dot"
        :class="{ active: idx === current }"
        @click="goTo(idx)"
      />
    </div>

    <!-- 箭头 -->
    <template v-if="arrows && slides.length > 1">
      <button class="bk-carousel__arrow left" @click="prev">
        <el-icon><ArrowLeft /></el-icon>
      </button>
      <button class="bk-carousel__arrow right" @click="next">
        <el-icon><ArrowRight /></el-icon>
      </button>
    </template>

    <!-- 幻灯片 -->
    <div class="bk-carousel__track" ref="trackRef" :style="trackStyle">
      <div
        v-for="(slide, idx) in slides"
        :key="idx"
        class="bk-carousel__slide"
        @click="handleClick(slide)"
      >
        <img
          v-if="slide.image || slide.pic"
          :src="slide.image || slide.pic"
          :alt="slide.title || slide.alt || ''"
          loading="lazy"
        />
        <div v-if="slide.title || slide.subtitle" class="slide-caption">
          <h3 v-if="slide.title">{{ slide.title }}</h3>
          <p v-if="slide.subtitle">{{ slide.subtitle }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  /** 轮播项数组 */
  slides: {
    type: Array,
    default: () => [],
  },
  /** 自动播放间隔(ms) */
  interval: {
    type: Number,
    default: 4000,
  },
  /** 是否显示指示器 */
  dots: {
    type: Boolean,
    default: true,
  },
  /** 是否显示箭头 */
  arrows: {
    type: Boolean,
    default: true,
  },
  /** 过渡动画时间(ms) */
  duration: {
    type: Number,
    default: 500,
  },
})

const emit = defineEmits(['change', 'click'])

const current = ref(0)
const trackRef = ref(null)
let timer = null

// 轨道样式 - 根据current偏移
const trackStyle = computed(() => ({
  transform: `translateX(-${current.value * 100}%)`,
  transition: `transform ${props.duration}ms ease-in-out`,
}))

// 前一张
function prev() {
  current.value = current.value === 0 ? props.slides.length - 1 : current.value - 1
  emit('change', current.value)
}

// 后一张
function next() {
  current.value = current.value === props.slides.length - 1 ? 0 : current.value + 1
  emit('change', current.value)
}

// 跳转到指定
function goTo(idx) {
  current.value = idx
  emit('change', idx)
}

// 点击轮播项
function handleClick(slide) {
  emit('click', slide)
}

// 自动播放
function startAutoPlay() {
  if (props.slides.length <= 1) return
  stopAutoPlay()
  timer = setInterval(next, props.interval)
}

function stopAutoPlay() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// 监听 slides 变化，重置 current
watch(() => props.slides, () => {
  current.value = 0
})

onMounted(startAutoPlay)
onUnmounted(stopAutoPlay)
</script>

<style scoped lang="scss">
.bk-carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
}

.bk-carousel__track {
  display: flex;
  height: 100%;
}

.bk-carousel__slide {
  flex: 0 0 100%;
  height: 100%;
  position: relative;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
}

.slide-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
  padding: 30px 24px 16px;
  color: #fff;

  h3 {
    font-size: 18px;
    margin-bottom: 4px;
  }

  p {
    font-size: 13px;
    opacity: 0.8;
  }
}

// 指示器
.bk-carousel__dots {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 5;

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: all 0.3s;

    &.active {
      background: #fff;
      width: 26px;
      border-radius: 5px;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.8);
    }
  }
}

// 箭头
.bk-carousel__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  opacity: 0;
  transition: all 0.3s;
  color: $text-regular;

  .bk-carousel:hover & {
    opacity: 1;
  }

  &:hover {
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  &.left { left: 12px; }
  &.right { right: 12px; }
}
</style>
