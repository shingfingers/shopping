/**
 * BK商城 - 商品图片方案
 *
 * 图片优先级：真实图片URL > 品类SVG占位图 > 默认占位
 *
 * 内置商品→品类/品牌映射，确保每件商品的占位图与其名称/品类匹配。
 * 所有 SVG 渲染为优雅的磨砂玻璃风格（Glassmorphism）。
 */

// ===== 品牌色体系 =====
const BRAND_COLORS = {
  '苹果': { bg: '#1a1a2e', light: '#2d2d44', accent: '#555' },
  'iphone': { bg: '#1a1a2e', light: '#2d2d44', accent: '#555' },
  'iwatch': { bg: '#1a1a2e', light: '#2d2d44', accent: '#555' },
  'apple': { bg: '#1a1a2e', light: '#2d2d44', accent: '#555' },
  '华为': { bg: '#cf0a2c', light: '#e8304f', accent: '#a00822' },
  'huawei': { bg: '#cf0a2c', light: '#e8304f', accent: '#a00822' },
  '小米': { bg: '#ff6700', light: '#ff8533', accent: '#cc5200' },
  'mi': { bg: '#ff6700', light: '#ff8533', accent: '#cc5200' },
  '联想': { bg: '#0078d7', light: '#3399ff', accent: '#005a9e' },
  '三星': { bg: '#1428a0', light: '#1a3eb7', accent: '#0f1f7a' },
  '海尔': { bg: '#00a0e9', light: '#33b8ff', accent: '#0080c0' },
  '飞利浦': { bg: '#0b5ed7', light: '#3d84e8', accent: '#0945a8' },
  '魅族': { bg: '#00c3ff', light: '#33d4ff', accent: '#0099cc' },
}

// ===== 品类映射（按优先级排列：更具体的放前面，避免品牌名误匹配） =====
const CATEGORY_MAP = [
  { keywords: ['平板', 'ipad', 'pad', 'matepad', 'tab'], icon: '📟', cat: '平板电脑', bg: '#337ecc' },
  { keywords: ['手表', 'watch', 'iwatch', '手环', 'band', '腕表', '钟表', 'g-shock', '卡西欧', '天梭', '浪琴'], icon: '⌚', cat: '智能穿戴', bg: '#555' },
  { keywords: ['电脑', '笔记本', 'thinkpad', 'legion', 'macbook', 'x1', '台式机', '一体机', '显示器'], icon: '💻', cat: '电脑办公', bg: '#67C23A' },
  { keywords: ['手机', 'iphone', 'redmi', 'vivo', 'meizu', '魅族', '三星', 'samsung', '一加', 'oppo', 'pura', 'nova', 'zuk', 'mate', '小米', '华为'], icon: '📱', cat: '手机数码', bg: '#409EFF' },
  { keywords: ['电视', '电视机', '智慧屏', '投影', '幕布'], icon: '📺', cat: '电视影音', bg: '#E6A23C' },
  { keywords: ['空调', '冷暖', '变频', '新一级能效'], icon: '❄️', cat: '空调', bg: '#56c0e0' },
  { keywords: ['冰箱', '对开门', '冷柜', '冰柜'], icon: '🧊', cat: '冰箱', bg: '#78909c' },
  { keywords: ['洗衣机', '滚筒', '烘干', '干衣机'], icon: '🧺', cat: '洗衣机', bg: '#5c6f7a' },
  { keywords: ['耳机', '音箱', '音响', 'airpods', 'xm5', '降噪豆', '扬声器'], icon: '🎧', cat: '音频设备', bg: '#673ab7' },
  { keywords: ['相机', '索尼a7', '微单', '单反', '镜头', '摄像头', 'gopro', 'dji', '大疆', '无人机', '稳定器', '航拍'], icon: '📷', cat: '数码产品', bg: '#00bcd4' },
  { keywords: ['电饭煲', '微波炉', '空气炸锅', '破壁', '烤箱', '电磁炉', '榨汁', '净水', '吸尘', '扫地', '电风扇', '取暖', '加湿', '净化', '戴森'], icon: '🔌', cat: '家用电器', bg: '#E6A23C' },
  { keywords: ['服装', '服饰', '男装', '女装', '衬衫', 't恤', 't恤', '连衣裙', '内衣', '袜子', '羽绒', '保暖', '文胸', '内裤', '短袖', '裤子', '针织', '纯棉', '法兰绒', '冰丝'], icon: '👕', cat: '服饰鞋包', bg: '#F56C6C' },
  { keywords: ['鞋', '跑鞋', '篮球鞋', '板鞋', '帆布鞋', '高跟鞋', '靴', '运动鞋', 'nike', 'adidas', '阿迪', '耐克', '安踏', '李宁', '特步', '回力', '斯凯奇', 'ugg', 'clarks', 'new balance'], icon: '👟', cat: '鞋靴', bg: '#3F51B5' },
  { keywords: ['美妆', '护肤', '化妆品', '面膜', '口红', '精华', '面霜', '眼霜', '神仙水', '香水', '粉底', '隔离', '乳液', '洁面', '卸妆', '防晒', '小棕瓶', '小黑瓶', '红腰子', '紫熨斗', 'mac', 'ysl', '圣罗兰', '阿玛尼', 'sk-ii', '科颜氏', '资生堂', '兰蔻', '雅诗兰黛', '欧莱雅'], icon: '💄', cat: '美妆护肤', bg: '#e040fb' },
  { keywords: ['食品', '零食', '饮料', '水果', '生鲜', '坚果', '面包', '肉松', '拉面', '方便面', '矿泉水', '气泡水', '咖啡', '茶叶', '茶', '龙井', '月饼', '鸡爪', '大米', '牛奶', '酸奶', '巧克力', '糖果', '饼干', '瓜子'], icon: '🍜', cat: '食品生鲜', bg: '#ff6e40' },
  { keywords: ['奶粉', '纸尿裤', '拉拉裤', '奶瓶', '婴儿', '宝宝', '幼儿', '儿童', '辅食', '推车', '湿巾', '抚触', '睡袋', '玩具', '积木', '芭比', '乐高', '高达', '变形金刚', '遥控', '电子琴', '木琴', '摇铃', 'lego', 'hape', '费雪', '帮宝适', '美赞臣', '飞鹤', '贝亲', 'babycare', '布鲁可', '万代', '孩之宝', '奥迪双钻', '得力'], icon: '🍼', cat: '母婴玩具', bg: '#FF9800' },
  { keywords: ['家居', '家具', '家装', '床上', '窗帘', '四件套', '床品', '天丝', '办公椅', '台灯', '收纳', '盖毯', '抽纸', '拖把', '装饰画', '猫粮', '狗粮', '地毯', '沙发', '被子', '枕头', '罗莱', '富安娜', '宜家', '南极人', '水星', '心相印', '茶花', '佳帮手', '网易严选'], icon: '🛋️', cat: '家居家装', bg: '#795548' },
  { keywords: ['图书', '书', '教材', '小说', '文学', '编程', 'java', 'python', 'spring', '人类简史', '三体', '活着', '小王子', '明朝', '穷查理', '红楼梦', '资治通鉴'], icon: '📚', cat: '图书文娱', bg: '#26c6da' },
  { keywords: ['厨具', '炒锅', '汤锅', '珐琅', '菜刀', '保鲜盒', '水杯', '餐具', '茶具', '不粘锅', '双立人', '苏泊尔', '九阳', '爱仕达', '张小泉', '乐扣', '特百惠', '康宁', '唯瓷', '万仟堂'], icon: '🍳', cat: '厨具', bg: '#FF7043' },
  { keywords: ['箱包', '背包', '双肩', '钱包', '手提包', '斜挎', '旅行', '收纳袋', '新秀丽', '蔻驰', '古驰', 'gucci', 'lv', '路易威登', '途明', 'tumi', '皮尔卡丹', '凌美', 'lamy', 'zippo', '潘多拉', '施华洛世奇'], icon: '🎁', cat: '箱包礼品', bg: '#F44336' },
  { keywords: ['珠宝', '黄金', '足金', '铂金', '钻石', '珍珠', '项链', '手镯', '耳钉', '戒指', '对戒', '玉', '翡翠', '周大福', '老凤祥', '六福', '周生生', '谢瑞麟', '潮宏基', '京润', '明牌', '中国黄金'], icon: '💎', cat: '珠宝', bg: '#E91E63' },
  { keywords: ['运动', '健身', '瑜伽', '跑步', '哑铃', '单车', '羽毛球', '乒乓球', '篮球', '足球', '帐篷', '游泳', '露营', '骑行', 'spalding', '斯伯丁', '尤尼克斯', 'yonex', '红双喜', 'keep', '迪卡侬', 'decathlon'], icon: '⚽', cat: '运动健康', bg: '#4CAF50' },
  { keywords: ['汽车', '贴膜', '雨刮', '机油', '脚垫', '充气泵', '车蜡', '充电器', '空调滤', '3m', '博世', 'bosch', '嘉实多', 'castrol', '车仆', '龟牌', '70迈', '倍思', '龙膜'], icon: '🚗', cat: '汽车用品', bg: '#789262' },
  { keywords: ['充电宝', '移动电源', '固态硬盘', 'ssd', 'u盘', '硬盘', '数据线', '转换器', '扩展坞', '鼠标', '键盘', '路由器', '打印机', '安克', 'anker', '三星t7', '罗技', 'logitech', '惠普', 'hp'], icon: '🔧', cat: '电脑配件', bg: '#5C6BC0' },
]

// ===== 默认占位 =====
const DEFAULT = { icon: '📦', cat: '商品', bg: '#e0e0e0' }

/**
 * 匹配商品对应的品类配置
 */
function matchCategory(name = '') {
  const n = name.toLowerCase()
  for (const c of CATEGORY_MAP) {
    if (c.keywords.some(k => n.includes(k))) {
      return c
    }
  }
  return DEFAULT
}

/**
 * 匹配商品对应的品牌色
 */
function matchBrand(name = '') {
  const n = name.toLowerCase()
  for (const [brand, colors] of Object.entries(BRAND_COLORS)) {
    if (n.includes(brand)) {
      return colors
    }
  }
  return null
}

/**
 * 生成玻璃拟态风格的商品占位 SVG
 * @param {string} name - 商品名称
 * @param {number} w - 宽度
 * @param {number} h - 高度
 * @returns {string} data:image/svg+xml URI
 */
export function generatePlaceholder(name = '', w = 400, h = 400) {
  const cat = matchCategory(name)
  const brand = matchBrand(name)

  // 颜色：优先品牌色，其次品类色，最后默认
  const bg = brand ? brand.bg : cat.bg
  const lightBg = brand ? brand.light : cat.bg
  const icon = cat.icon
  const label = cat.cat

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${bg};stop-opacity:0.12"/>
        <stop offset="100%" style="stop-color:${lightBg};stop-opacity:0.03"/>
      </linearGradient>
      <linearGradient id="g2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:${bg};stop-opacity:0.08"/>
        <stop offset="100%" style="stop-color:${lightBg};stop-opacity:0.01"/>
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="${bg}" flood-opacity="0.15"/>
      </filter>
    </defs>
    <rect fill="url(#g)" width="${w}" height="${h}"/>
    <!-- 装饰性半透明圆 -->
    <circle cx="${w * 0.2}" cy="${h * 0.15}" r="${w * 0.15}" fill="${bg}" opacity="0.06"/>
    <circle cx="${w * 0.85}" cy="${h * 0.85}" r="${w * 0.2}" fill="${bg}" opacity="0.05"/>
    <rect x="${w * 0.12}" y="${h * 0.12}" width="${w * 0.76}" height="${h * 0.54}" rx="16" fill="rgba(255,255,255,0.5)" stroke="${bg}" stroke-opacity="0.15" stroke-width="1"/>
    <!-- 商品大图标 -->
    <text x="${w * 0.5}" y="${h * 0.42}" font-size="${w * 0.25}" text-anchor="middle" dominant-baseline="central" filter="url(#shadow)">${icon}</text>
    <!-- 分类标签 -->
    <rect x="${w * 0.5 - 50}" y="${h * 0.64}" width="100" height="26" rx="13" fill="${bg}" opacity="0.12"/>
    <text x="${w * 0.5}" y="${h * 0.70}" font-size="${w * 0.045}" fill="${bg}" text-anchor="middle" dominant-baseline="central" font-weight="600">${label}</text>
    <!-- 商品名（截断） -->
    <text x="${w * 0.5}" y="${h * 0.82}" font-size="${w * 0.035}" fill="#bbb" text-anchor="middle" dominant-baseline="central">${name.length > 12 ? name.slice(0, 10) + '...' : name || '商品图片'}</text>
  </svg>`

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/**
 * 智能获取商品图片
 * 优先使用真实图片，否则生成品类匹配的占位图
 */
export function getProductImage(product) {
  if (!product) return generatePlaceholder('', 400, 400)

  // 从多个可能的字段取图片
  const url = product.mainImage || product.headerPic || product.image || product.pic || ''

  // 本地 public 目录下的真实商品图片（/product-images/ 开头）直接使用
  if (url && url.startsWith('/product-images/')) {
    return url
  }

  // 前端本地静态资源（localhost:3000 指向 public 目录）放行
  if (url && url.includes('localhost:3000') && url.includes('/product-images/')) {
    return url
  }

  // 其他可访问的 http/https 图片，直接使用
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    // 内网地址（192.168.开头）无法访问，用占位图
    if (url.includes('192.168.') || url.includes('127.0.0.1')) {
      return generatePlaceholder(product.name || product.goodsName || '', 400, 400)
    }
    return url
  }

  // 无有效图片，用占位图
  return generatePlaceholder(product.name || product.goodsName || '', 400, 400)
}

/**
 * 获取商品多图
 */
export function getProductImages(product, count = 4) {
  const name = product?.name || product?.goodsName || ''
  return Array.from({ length: count }, (_, i) =>
    generatePlaceholder(`${name} - 展示图${i + 1}`, 400, 400)
  )
}

/**
 * 获取品牌对应的品牌色
 */
export function getBrandColor(brandName) {
  const n = brandName?.toLowerCase() || ''
  for (const [brand, colors] of Object.entries(BRAND_COLORS)) {
    if (n.includes(brand)) return colors.bg
  }
  return '#409EFF'
}

// ===== 分类图标映射 =====
// 关键字匹配分类名，返回对应的 emoji + 主题色
const CATEGORY_ICON_MAP = [
  { keywords: ['图书', '音像', '电子书'], emoji: '📚', color: '#4A90E2' },
  { keywords: ['家用电器'], emoji: '🔌', color: '#00B8D4' },
  { keywords: ['电脑', '办公'], emoji: '💻', color: '#5C6BC0' },
  { keywords: ['个护', '化妆'], emoji: '💄', color: '#E91E63' },
  { keywords: ['钟表'], emoji: '⌚', color: '#607D8B' },
  { keywords: ['母婴'], emoji: '🍼', color: '#FF9800' },
  { keywords: ['食品', '饮料', '保健'], emoji: '🍱', color: '#8BC34A' },
  { keywords: ['汽车'], emoji: '🚗', color: '#789262' },
  { keywords: ['玩具', '乐器'], emoji: '🎮', color: '#9C27B0' },
  { keywords: ['手机'], emoji: '📱', color: '#2196F3' },
  { keywords: ['数码'], emoji: '📷', color: '#00BCD4' },
  { keywords: ['家居', '家装'], emoji: '🛋️', color: '#795548' },
  { keywords: ['厨具'], emoji: '🍳', color: '#FF7043' },
  { keywords: ['服饰', '内衣'], emoji: '👕', color: '#E91E63' },
  { keywords: ['鞋靴'], emoji: '👟', color: '#3F51B5' },
  { keywords: ['礼品', '箱包'], emoji: '🎁', color: '#F44336' },
  { keywords: ['珠宝'], emoji: '💎', color: '#00BCD4' },
  { keywords: ['运动', '健康'], emoji: '⚽', color: '#4CAF50' },
  { keywords: ['彩票', '旅行', '充值', '票务'], emoji: '🎫', color: '#FFC107' },
  { keywords: ['大数据'], emoji: '📊', color: '#3F51B5' },
  { keywords: ['测试'], emoji: '🧪', color: '#9E9E9E' },
]

/**
 * 获取分类对应的图标（SVG data URI）
 * @param {string} categoryName 分类名称
 * @returns {string} SVG data URI，可直接用于 <img :src>
 */
export function getCategoryIcon(categoryName) {
  const name = categoryName || ''
  let emoji = '🏷️'
  let color = '#909399'

  for (const item of CATEGORY_ICON_MAP) {
    if (item.keywords.some(kw => name.includes(kw))) {
      emoji = item.emoji
      color = item.color
      break
    }
  }

  // 生成圆形彩色背景 + emoji 的 SVG 图标
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="16" fill="${color}" opacity="0.15"/>
    <circle cx="16" cy="16" r="13" fill="${color}" opacity="0.25"/>
    <text x="16" y="16" font-size="16" text-anchor="middle" dominant-baseline="central">${emoji}</text>
  </svg>`

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
