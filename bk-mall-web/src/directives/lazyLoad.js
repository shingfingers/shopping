/**
 * 图片懒加载指令 v-lazy
 * 基于 IntersectionObserver 实现
 *
 * 用法:
 * <img v-lazy="'https://example.com/image.jpg'" />
 * <img v-lazy="{ src: '...', loading: '...', error: '...' }" />
 */

// SVG 转 base64 data URI
function svgToDataUri(svg) {
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
}

// 默认占位图（轻量 SVG）
const DEFAULT_LOADING = svgToDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">' +
  '<rect fill="#f5f5f5" width="100" height="100"/>' +
  '<circle fill="#e0e0e0" cx="50" cy="38" r="12"/>' +
  '<path fill="#e0e0e0" d="M20 70 Q50 55 80 70 L80 85 L20 85 Z"/>' +
  '</svg>'
)

const DEFAULT_ERROR = svgToDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">' +
  '<rect fill="#fafafa" width="100" height="100"/>' +
  '<text fill="#ccc" x="50" y="50" text-anchor="middle" dominant-baseline="central" font-size="12">加载失败</text>' +
  '</svg>'
)

let observer = null

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            const src = img.dataset.lazySrc
            if (src) {
              // 开始加载真实图片
              const tempImg = new Image()
              tempImg.onload = () => {
                img.src = src
                img.classList.add('lazy-loaded')
                observer.unobserve(img)
              }
              tempImg.onerror = () => {
                img.src = img.dataset.lazyError || DEFAULT_ERROR
                img.classList.add('lazy-error')
                observer.unobserve(img)
              }
              tempImg.src = src
            } else {
              observer.unobserve(img)
            }
          }
        })
      },
      {
        rootMargin: '200px 0px', // 提前 200px 开始加载
        threshold: 0.01,
      }
    )
  }
  return observer
}

export default {
  mounted(el, binding) {
    const value = binding.value
    const src = typeof value === 'string' ? value : value.src
    const loadingImg = (typeof value === 'object' && value.loading) || DEFAULT_LOADING
    const errorImg = (typeof value === 'object' && value.error) || DEFAULT_ERROR

    // 设置默认占位图
    el.src = loadingImg
    el.dataset.lazySrc = src
    el.dataset.lazyError = errorImg
    el.classList.add('lazy-pending')

    // 开始观察
    getObserver().observe(el)
  },

  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      const src = typeof binding.value === 'string' ? binding.value : binding.value.src
      if (src && src !== el.dataset.lazySrc) {
        el.dataset.lazySrc = src
        el.classList.remove('lazy-loaded', 'lazy-error')
        el.classList.add('lazy-pending')
        el.src = (typeof binding.value === 'object' && binding.value.loading) || DEFAULT_LOADING
        getObserver().unobserve(el)
        getObserver().observe(el)
      }
    }
  },

  unmounted(el) {
    if (observer) {
      observer.unobserve(el)
    }
  },
}
