/**
 * 格式化金额为两位小数字符串
 * @param {number|string} price - 金额
 * @returns {string} 格式化后的金额，如 "99.00"
 */
export function formatPrice(price) {
  if (price === null || price === undefined || price === '') return '0.00'
  const num = Number(price)
  if (isNaN(num)) return '0.00'
  return num.toFixed(2)
}

/**
 * 格式化金额带货币符号
 * @param {number|string} price - 金额
 * @returns {string} 如 "¥99.00"
 */
export function formatCurrency(price) {
  return `¥${formatPrice(price)}`
}

/**
 * 格式化日期时间
 * @param {string|Date|number} date - 日期
 * @param {string} fmt - 格式，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string}
 */
export function formatDateTime(date, fmt = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'
  const pad = (n) => String(n).padStart(2, '0')
  return fmt
    .replace('YYYY', d.getFullYear())
    .replace('MM', pad(d.getMonth() + 1))
    .replace('DD', pad(d.getDate()))
    .replace('HH', pad(d.getHours()))
    .replace('mm', pad(d.getMinutes()))
    .replace('ss', pad(d.getSeconds()))
}

/**
 * 生成简单的占位 SVG data URI（用于购物车、订单等小图占位）
 * @param {string} text - 占位文字
 * @param {number} w - 宽
 * @param {number} h - 高
 * @returns {string} data:image/svg+xml URI
 */
export function generateSimplePlaceholder(text = '暂无', w = 80, h = 80) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <rect fill="#f5f5f5" width="${w}" height="${h}"/>
    <text fill="#ccc" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="${Math.floor(w / 8)}">${text}</text>
  </svg>`
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
}
