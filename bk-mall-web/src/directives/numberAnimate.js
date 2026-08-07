/**
 * 数字滚动动画指令 v-number-animate
 * 基于 countup.js，用于价格、数量等数字变化时的滚动动画
 *
 * 用法:
 * <span v-number-animate="price" />
 * <span v-number-animate="{ value: price, duration: 2, prefix: '¥', suffix: '元' }" />
 *
 * 注意：需要通过 transition 触发动画，或手动调用 el.start()
 */

import { CountUp } from 'countup.js'

export default {
  mounted(el, binding) {
    const config = parseBinding(binding.value)
    el._countUp = null
    el._targetValue = config.value
    el._config = config
    el.start = startCountUp
  },

  updated(el, binding) {
    const config = parseBinding(binding.value)
    if (config.value !== el._targetValue) {
      el._targetValue = config.value
      el._config = config
      startCountUp(el)
    }
  },

  unmounted(el) {
    if (el._countUp) {
      el._countUp.reset()
      el._countUp = null
    }
  },
}

function parseBinding(value) {
  if (typeof value === 'number') {
    return { value, duration: 1, prefix: '', suffix: '' }
  }
  if (typeof value === 'object' && value !== null) {
    return {
      value: value.value || 0,
      duration: value.duration || 1,
      prefix: value.prefix || '',
      suffix: value.suffix || '',
      decimals: value.decimals !== undefined ? value.decimals : 0,
    }
  }
  return { value: 0, duration: 1, prefix: '', suffix: '' }
}

function startCountUp(el) {
  const config = el._config
  if (config.value === undefined || config.value === null) return

  const options = {
    duration: config.duration,
    prefix: config.prefix,
    suffix: config.suffix,
    decimals: config.decimals,
    useEasing: true,
    useGrouping: true,
    separator: ',',
    decimal: '.',
    enableScrollSpy: true,
  }

  if (el._countUp) {
    el._countUp.update(config.value)
  } else {
    el._countUp = new CountUp(el, config.value, options)
    if (!el._countUp.error) {
      el._countUp.start()
    } else {
      el.textContent = config.prefix + config.value + config.suffix
    }
  }
}
