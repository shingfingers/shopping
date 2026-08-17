/**
 * 头像预设工具
 * 头像使用 emoji + 渐变背景渲染（避免外部图片依赖）。
 * 存储值为 `preset:<key>`，解析后得到对应的渐变背景和 emoji。
 */

export const avatarPresets = [
  { name: '活力橙', emoji: '😀', bg: 'linear-gradient(135deg,#f97316,#f59e0b)', key: 'orange' },
  { name: '清新绿', emoji: '😊', bg: 'linear-gradient(135deg,#10b981,#34d399)', key: 'green' },
  { name: '天空蓝', emoji: '😎', bg: 'linear-gradient(135deg,#3b82f6,#60a5fa)', key: 'blue' },
  { name: '浪漫紫', emoji: '🤩', bg: 'linear-gradient(135deg,#8b5cf6,#a78bfa)', key: 'purple' },
  { name: '暖心粉', emoji: '🥰', bg: 'linear-gradient(135deg,#ec4899,#f472b6)', key: 'pink' },
  { name: '深邃靛', emoji: '🧐', bg: 'linear-gradient(135deg,#4f46e5,#6366f1)', key: 'indigo' },
]

const DEFAULT_STYLE = { background: 'linear-gradient(135deg,#3b82f6,#60a5fa)' }
const DEFAULT_EMOJI = '😎'

/**
 * 根据存储值解析头像背景样式
 * @param {string} avatar - 存储的头像值（preset:xxx 格式）
 * @returns {Object} 样式对象
 */
export function getAvatarStyle(avatar = '') {
  if (!avatar) return { ...DEFAULT_STYLE }
  const key = avatar.replace('preset:', '')
  const preset = avatarPresets.find(p => p.key === key)
  return preset ? { background: preset.bg } : { ...DEFAULT_STYLE }
}

/**
 * 根据存储值解析头像 emoji
 * @param {string} avatar - 存储的头像值（preset:xxx 格式）
 * @returns {string} emoji 字符
 */
export function getAvatarEmoji(avatar = '') {
  if (!avatar) return DEFAULT_EMOJI
  const key = avatar.replace('preset:', '')
  const preset = avatarPresets.find(p => p.key === key)
  return preset ? preset.emoji : DEFAULT_EMOJI
}