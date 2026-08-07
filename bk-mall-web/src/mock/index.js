/**
 * BK商城 - Mock 数据层
 *
 * 基于 baizhanshopping 数据库 SQL 生成。
 * 在后端未运行时自动启用，确保前端可以独立展示。
 *
 * 说明：
 * - 拥有真实图片的商品会在对象中设置 mainImage 字段（值为 /product-images/xxx.jpg），
 *   对应 public/product-images 目录下的真实商品图片。
 * - 未设置 mainImage 的商品，由 utils/placeholders.js 自动生成品类匹配的 SVG 占位图。
 */

import { generatePlaceholder } from '@/utils/placeholders'

function getBannerImage(index = 0) {
  const banners = [
    { text: '618年中大促', icon: '🎉' },
    { text: '数码新品季', icon: '📱' },
    { text: '家电焕新节', icon: '🏠' },
    { text: '夏日清凉购', icon: '🍉' },
  ]
  const b = banners[index % banners.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="360" viewBox="0 0 800 360">
    <defs>
      <linearGradient id="bannerBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1a1a2e" />
        <stop offset="100%" style="stop-color:#2d1b3d" />
      </linearGradient>
    </defs>
    <rect fill="url(#bannerBg)" width="800" height="360"/>
    <text x="50%" y="40%" font-size="80" text-anchor="middle" dominant-baseline="central">${b.icon}</text>
    <text x="50%" y="62%" font-size="36" fill="#fff" text-anchor="middle" dominant-baseline="central" font-weight="700">${b.text}</text>
    <text x="50%" y="76%" font-size="16" fill="rgba(255,255,255,0.5)" text-anchor="middle" dominant-baseline="central">BK商城 - 品质生活，尽在BK</text>
  </svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

// ==================== 分类数据（来自 bz_product_type） ====================
export const categories = [
  {
    id: 1,
    name: '手机数码',
    children: [
      { id: 558, name: '手机通讯', children: [
        { id: 559, name: '智能手机', children: [] },
        { id: 560, name: '手机配件', children: [] },
      ]},
      { id: 161, name: '电脑办公', children: [
        { id: 162, name: '笔记本', children: [{ id: 163, name: '轻薄本' }] },
      ]},
    ],
  },
  { id: 74, name: '家用电器', children: [
    { id: 75, name: '大家电', children: [
      { id: 76, name: '平板电视' }, { id: 77, name: '空调' },
      { id: 78, name: '冰箱' }, { id: 79, name: '洗衣机' },
    ]},
  ]},
  { id: 785, name: '服饰鞋包', children: [] },
  { id: 920, name: '美妆护肤', children: [] },
  { id: 1045, name: '食品生鲜', children: [] },
  { id: 1170, name: '家居家装', children: [] },
  { id: 1, name: '图书音像', children: [
    { id: 2, name: '电子书刊', children: [
      { id: 3, name: '电子书' }, { id: 4, name: '网络原创' },
    ]},
    { id: 18, name: '文艺', children: [
      { id: 19, name: '小说' }, { id: 20, name: '文学' },
    ]},
  ]},
]

// ==================== 商品列表（来自 bz_goods + bz_goods_image） ====================
// mainImage 字段指向 public/product-images 下的真实商品图片；
// 未设置 mainImage 的商品由 placeholders.js 生成 SVG 占位图。
export const goods = [
  // ---------- 手机数码 - 智能手机（含真实图片） ----------
  {
    id: 149187842867962,
    goodsName: 'iPhone 14',
    caption: '苹果6.1英寸OLED全面屏手机 A15仿生芯片 1200万像素',
    price: 5999.00,
    brandId: 9,
    brandName: '苹果',
    sales: 2899,
    stockCount: 500,
    tag: '热卖',
    isMarketable: true,
  },
  {
    id: 149187842867963,
    goodsName: 'HUAWEI MATE 40',
    caption: '华为旗舰手机 麒麟9000E处理器 徕卡双影像单元',
    price: 4000.00,
    brandId: 2,
    brandName: '华为',
    sales: 15678,
    stockCount: 328,
    tag: '热卖',
    isMarketable: true,
    mainImage: '/product-images/huawei-mate40.jpg',
  },
  {
    id: 149187842867986,
    goodsName: 'iPhone 15',
    caption: '苹果灵动岛设计 A16芯片 4800万像素主摄 USB-C接口',
    price: 9999.00,
    originalPrice: 10999.00,
    brandId: 9,
    brandName: '苹果',
    sales: 23456,
    stockCount: 200,
    tag: '新品',
    isMarketable: true,
    mainImage: '/product-images/iphone13-blue.jpg',
  },
  {
    id: 149187842867987,
    goodsName: 'iPhone 14 Pro',
    caption: '苹果动态岛旗舰 A16芯片 4800万像素主摄 多色可选',
    price: 12000.00,
    originalPrice: 13999.00,
    brandId: 9,
    brandName: '苹果',
    sales: 12888,
    stockCount: 328,
    tag: '热卖',
    isMarketable: true,
    mainImage: '/product-images/iphone13-pro-colors.jpg',
  },
  {
    id: 149187842867990,
    goodsName: 'iWatch',
    caption: '苹果智能手表 健康心率监测 运动追踪 长续航',
    price: 1000.00,
    brandId: 9,
    brandName: '苹果',
    sales: 8999,
    stockCount: 100,
    tag: '秒杀',
    isMarketable: true,
  },
  {
    id: 149187842867991,
    goodsName: 'iPhone 15 Pro',
    caption: '苹果钛金属旗舰 A17 Pro芯片 4800万像素专业影像',
    price: 8999.00,
    originalPrice: 9999.00,
    brandId: 9,
    brandName: '苹果',
    sales: 3456,
    stockCount: 150,
    tag: '新品',
    isMarketable: true,
    mainImage: '/product-images/iphone13-pro-colors.jpg',
  },
  {
    id: 149187842867992,
    goodsName: 'iWatch S7',
    caption: '苹果智能手表 全天候视网膜显示屏 血氧检测',
    price: 2000.00,
    brandId: 9,
    brandName: '苹果',
    sales: 5678,
    stockCount: 0,
    tag: '特惠',
    isMarketable: false,
  },
  {
    id: 149187842867993,
    goodsName: 'iPhone 13 Pro',
    caption: '苹果旗舰智能手机 A15仿生芯片 超视网膜XDR显示屏 远峰蓝',
    price: 8999.00,
    originalPrice: 9799.00,
    brandId: 9,
    brandName: '苹果',
    sales: 45678,
    stockCount: 85,
    tag: '特惠',
    isMarketable: true,
    mainImage: '/product-images/iphone13-pro-blue.jpg',
  },
  {
    id: 149187842867994,
    goodsName: 'iPhone 16',
    caption: '苹果跨时代智能手机 A18芯片 个性化相机控制按键',
    price: 7000.00,
    originalPrice: 8999.00,
    brandId: 9,
    brandName: '苹果',
    sales: 1234,
    stockCount: 0,
    tag: '新品',
    isMarketable: false,
  },
  {
    id: 149187842867971,
    goodsName: '小米14 Ultra',
    caption: '徕卡光学全焦段四摄 骁龙8Gen3 专业影像旗舰',
    price: 5999,
    originalPrice: 6999,
    brandId: 4,
    brandName: '小米',
    sales: 12888,
    stockCount: 230,
    tag: '热卖',
    isMarketable: true,
    mainImage: '/product-images/xiaomi6.jpg',
  },
  {
    id: 1001001,
    goodsName: '华为P50',
    caption: '华为原色双影像单元 骁龙888 曜石黑 6.5英寸直屏',
    price: 4488.00,
    originalPrice: 4988.00,
    brandId: 2,
    brandName: '华为',
    sales: 9876,
    stockCount: 168,
    tag: '新品',
    isMarketable: true,
    mainImage: '/product-images/huawei-p50-black.jpg',
  },
  {
    id: 1001002,
    goodsName: '华为P50 Pro',
    caption: '华为原色双影像单元 麒麟9000 陶瓷白 120Hz曲面屏',
    price: 6488.00,
    originalPrice: 6988.00,
    brandId: 2,
    brandName: '华为',
    sales: 11223,
    stockCount: 142,
    tag: '热卖',
    isMarketable: true,
    mainImage: '/product-images/huawei-p50-pro-white.jpg',
  },
  {
    id: 1001003,
    goodsName: 'ZUK Z1',
    caption: '联想ZUK旗舰手机 骁龙801处理器 指纹识别 U-Touch',
    price: 1799.00,
    brandId: 28,
    brandName: 'ZUK',
    sales: 3456,
    stockCount: 260,
    tag: '特惠',
    isMarketable: true,
    mainImage: '/product-images/zuk-z1.jpg',
  },

  // ---------- 家用电器 ----------
  {
    id: 1002001,
    goodsName: '海尔变频空调挂机 1.5匹',
    caption: '海尔一级能效变频冷暖空调 快速制冷静音省电',
    price: 2599.00,
    originalPrice: 2999.00,
    brandId: 14,
    brandName: '海尔',
    sales: 6543,
    stockCount: 320,
    tag: '特惠',
    isMarketable: true,
  },
  {
    id: 1002002,
    goodsName: '美的对开门冰箱 446L风冷无霜',
    caption: '美的大容量对开门冰箱 风冷无霜智能变频 双开门',
    price: 3299.00,
    brandId: 20,
    brandName: '美的',
    sales: 4321,
    stockCount: 180,
    tag: '热卖',
    isMarketable: true,
  },
  {
    id: 1002003,
    goodsName: '海尔滚筒洗衣机 10KG变频',
    caption: '海尔大容量滚筒洗衣机 BLDC变频电机 除菌洗 16种洗涤程序',
    price: 2199.00,
    brandId: 14,
    brandName: '海尔',
    sales: 3890,
    stockCount: 210,
    tag: '新品',
    isMarketable: true,
  },

  // ---------- 电脑办公 ----------
  {
    id: 1003001,
    goodsName: '联想ThinkPad X1 Carbon 笔记本电脑',
    caption: '联想商务轻薄笔记本 14英寸 酷睿i7 16G内存 512G固态',
    price: 9999.00,
    originalPrice: 10999.00,
    brandId: 1,
    brandName: '联想',
    sales: 1234,
    stockCount: 96,
    tag: '热卖',
    isMarketable: true,
  },
  {
    id: 1003002,
    goodsName: '华为MateBook 14s 笔记本电脑',
    caption: '华为触控屏轻薄本 2.5K高色域 酷睿i5 16G内存',
    price: 6999.00,
    brandId: 2,
    brandName: '华为',
    sales: 2345,
    stockCount: 120,
    tag: '新品',
    isMarketable: true,
  },

  // ---------- 服饰鞋包 ----------
  {
    id: 1004001,
    goodsName: '耐克Air Jordan 1 男子运动鞋',
    caption: '耐克经典篮球鞋 透气缓震 街头潮流百搭',
    price: 1299.00,
    originalPrice: 1499.00,
    brandId: 21,
    brandName: '耐克',
    sales: 8765,
    stockCount: 300,
    tag: '热卖',
    isMarketable: true,
  },
  {
    id: 1004002,
    goodsName: '阿迪达斯连帽羽绒服 男士保暖外套',
    caption: '阿迪达斯90%白鸭绒 轻量保暖防风 连帽设计',
    price: 899.00,
    originalPrice: 1199.00,
    brandId: 22,
    brandName: '阿迪达斯',
    sales: 5432,
    stockCount: 240,
    tag: '特惠',
    isMarketable: true,
  },

  // ---------- 美妆护肤 ----------
  {
    id: 1005001,
    goodsName: '兰蔻小黑瓶肌底液面膜套装',
    caption: '兰蔻精华面膜 补水保湿提亮修护 10片装',
    price: 680.00,
    brandId: 23,
    brandName: '兰蔻',
    sales: 7654,
    stockCount: 500,
    tag: '热卖',
    isMarketable: true,
  },
  {
    id: 1005002,
    goodsName: '雅诗兰黛倾慕丝绒唇膏口红',
    caption: '雅诗兰黛丝绒雾感哑光 持久显色滋润 3.5g',
    price: 320.00,
    brandId: 24,
    brandName: '雅诗兰黛',
    sales: 6543,
    stockCount: 380,
    tag: '新品',
    isMarketable: true,
  },

  // ---------- 食品生鲜 ----------
  {
    id: 1006001,
    goodsName: '每日坚果礼盒 混合干果零食大礼包',
    caption: '7种坚果混合独立包装 营养健康年货送礼礼盒',
    price: 128.00,
    originalPrice: 168.00,
    brandId: 25,
    brandName: '良品铺子',
    sales: 19876,
    stockCount: 800,
    tag: '特惠',
    isMarketable: true,
  },
  {
    id: 1006002,
    goodsName: '智利进口车厘子 JJ级大果2斤',
    caption: '智利空运车厘子 新鲜采摘 顺丰冷链配送',
    price: 168.00,
    brandId: 26,
    brandName: '佳沛',
    sales: 11223,
    stockCount: 150,
    tag: '秒杀',
    isMarketable: true,
  },

  // ---------- 家居家装 ----------
  {
    id: 1007001,
    goodsName: '西昊人体工学椅 电脑办公椅',
    caption: '人体工学设计 3D仿生腰托 网布透气可后躺',
    price: 899.00,
    originalPrice: 1099.00,
    brandId: 27,
    brandName: '西昊',
    sales: 4321,
    stockCount: 200,
    tag: '新品',
    isMarketable: true,
  },
  {
    id: 1007002,
    goodsName: '小米米家LED智能台灯Pro',
    caption: '米家智能调光台灯 无频闪护眼 语音控制 可调色温',
    price: 199.00,
    brandId: 4,
    brandName: '小米',
    sales: 9876,
    stockCount: 600,
    tag: '特惠',
    isMarketable: true,
  },
]

// ==================== 品牌列表（来自 bz_brand） ====================
export const brands = [
  { id: 1, name: '联想' }, { id: 2, name: '华为' }, { id: 3, name: '三星' },
  { id: 4, name: '小米' }, { id: 8, name: '魅族' }, { id: 9, name: '苹果' },
  { id: 10, name: 'VIVO' }, { id: 14, name: '海尔' }, { id: 15, name: '飞利浦' },
  { id: 16, name: 'TCL' }, { id: 17, name: '海信' }, { id: 18, name: '夏普' },
  { id: 20, name: '美的' }, { id: 21, name: '耐克' }, { id: 22, name: '阿迪达斯' },
  { id: 23, name: '兰蔻' }, { id: 24, name: '雅诗兰黛' }, { id: 25, name: '良品铺子' },
  { id: 26, name: '佳沛' }, { id: 27, name: '西昊' }, { id: 28, name: 'ZUK' },
]

// ==================== 轮播广告（来自 bz_category 表，实际是广告数据） ====================
export const banners = [
  { image: getBannerImage(0), title: '618年中大促', subtitle: '全场低至5折 限时特惠' },
  { image: getBannerImage(1), title: '数码新品季', subtitle: '最新旗舰手机 震撼上市' },
  { image: getBannerImage(2), title: '家电焕新节', subtitle: '以旧换新 最高补贴2000元' },
  { image: getBannerImage(3), title: '夏日清凉购', subtitle: '空调冰箱 冰点价格' },
]

// ==================== 秒杀商品（来自 bz_seckill_goods） ====================
export const seckillGoods = [
  {
    id: 22,
    goodsId: 149187842867993,
    title: 'iPhone 13 Pro 秒杀',
    price: 8999.00,
    seckillPrice: 6999.00,
    num: 100,
    stockCount: 98,
    tag: '秒杀',
  },
  {
    id: 23,
    goodsId: 149187842867962,
    title: 'iPhone 14 秒杀',
    price: 5999.00,
    seckillPrice: 4999.00,
    num: 10,
    stockCount: 10,
    tag: '秒杀',
  },
  {
    id: 24,
    goodsId: 149187842867963,
    title: 'HUAWEI MATE 40 秒杀',
    price: 4000.00,
    seckillPrice: 3000.00,
    num: 5,
    stockCount: 5,
    tag: '秒杀',
  },
  {
    id: 26,
    goodsId: 1001002,
    title: '华为P50 Pro 秒杀',
    price: 6488.00,
    seckillPrice: 5288.00,
    num: 20,
    stockCount: 18,
    tag: '秒杀',
  },
]

// ==================== 用户地址（来自 bz_address） ====================
export const addresses = [
  { id: 1, userId: 17, provinceName: '山西省', cityName: '太原市', areaName: '迎泽区', mobile: '13835110526', address: '青年路26号', contact: '火炎', zipCode: '030000', isDefault: true },
  { id: 2, userId: 17, provinceName: '山西省', cityName: '太原市', areaName: '晋源区', mobile: '13835110526', address: '西峪东街10号', contact: '火炎', zipCode: '030000' },
  { id: 8, userId: 27, provinceName: '北京市', cityName: '市辖区', areaName: '海淀区', mobile: '13812345678', address: '百战程序员', contact: '火老师', zipCode: '010000' },
]

// ==================== 帮助函数 ====================

/**
 * 根据商品名获取主图：有真实图片用真实图，否则生成占位图
 */
function imageOf(goodsName, size = 200) {
  const g = goods.find(item => item.goodsName === goodsName)
  return (g && g.mainImage) || generatePlaceholder(goodsName, size, size)
}

/**
 * 获取模拟的商品列表
 */
export function getMockProducts(params = {}) {
  let list = [...goods].filter(g => g.isMarketable !== false)

  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    list = list.filter(g => g.goodsName.toLowerCase().includes(kw) || (g.caption || '').toLowerCase().includes(kw))
  }
  if (params.categoryId) {
    list = list.filter(g => g.brandId === Number(params.categoryId) || g.id.toString().includes(params.categoryId))
  }
  if (params.brand) {
    list = list.filter(g => g.brandName === params.brand)
  }
  if (params.sort === 'price') {
    list.sort((a, b) => params.order === 'asc' ? a.price - b.price : b.price - a.price)
  } else if (params.sort === 'sales') {
    list.sort((a, b) => (b.sales || 0) - (a.sales || 0))
  }

  const page = params.page || 1
  const size = params.size || 20
  const start = (page - 1) * size
  const paged = list.slice(start, start + size)

  return {
    records: paged.map(g => {
      // 优先使用商品自身的真实图片，没有才生成占位图
      const img = g.mainImage || generatePlaceholder(g.goodsName, 400, 400)
      return {
        ...g,
        mainImage: img,
        name: g.goodsName,
        image: img,
      }
    }),
    total: list.length,
    pages: Math.ceil(list.length / size),
  }
}

/**
 * 获取模拟的商品详情
 */
export function getMockProductDetail(id) {
  const g = goods.find(item => item.id === Number(id) || item.id === id)
  if (!g) return null

  // 主图：有真实图片用真实图，否则生成占位图
  const mainImage = g.mainImage || generatePlaceholder(g.goodsName, 600, 600)
  // 图片列表：如果有真实图片，images 数组包含 mainImage + 其余用 generatePlaceholder；
  // 否则全部用 generatePlaceholder
  const restCount = g.mainImage ? 3 : 4
  const otherImages = Array.from({ length: restCount }, (_, i) =>
    generatePlaceholder(`${g.goodsName} ${i + 1}`, 600, 600)
  )
  const images = g.mainImage ? [mainImage, ...otherImages] : otherImages

  return {
    ...g,
    name: g.goodsName,
    mainImage,
    images,
    specifications: [
      { specName: '颜色', specificationOptions: [
        { id: 1, optionName: '陶瓷白' }, { id: 2, optionName: '陶瓷黑' }, { id: 3, optionName: '龙晶蓝' },
      ]},
      { specName: '版本', specificationOptions: [
        { id: 4, optionName: '128GB' }, { id: 5, optionName: '256GB' }, { id: 6, optionName: '512GB' },
      ]},
    ],
    descriptionImages: Array.from({ length: 3 }, (_, i) => generatePlaceholder(`详情${i + 1}`, 800, 800)),
  }
}

/**
 * 获取模拟的秒杀列表
 */
export function getMockSeckillList() {
  return seckillGoods.map(sg => {
    const g = goods.find(item => item.id === sg.goodsId)
    // 秒杀商品优先使用对应商品的真实图片，没有才生成占位图
    const mainImage = (g && g.mainImage) || generatePlaceholder(sg.title, 400, 400)
    return {
      ...sg,
      ...(g || {}),
      name: sg.title,
      goodsName: sg.title,
      mainImage,
      seckillPrice: sg.seckillPrice,
      endTime: new Date(Date.now() + 7200000).toISOString(),
    }
  })
}

/**
 * 获取模拟的订单列表
 */
export function getMockOrders() {
  return [
    {
      id: 'ORD202406150001',
      orderNo: 'ORD202406150001',
      status: 'pending_ship',
      createdAt: '2024-06-15 10:30:00',
      payAmount: 14000.00,
      items: [
        { id: 1, name: 'iWatch', price: 1000.00, quantity: 2, mainImage: imageOf('iWatch', 200) },
        { id: 2, name: 'iPhone 14 Pro', price: 12000.00, quantity: 1, mainImage: imageOf('iPhone 14 Pro', 200) },
      ],
    },
    {
      id: 'ORD202406150002',
      orderNo: 'ORD202406150002',
      status: 'pending_pay',
      createdAt: '2024-06-16 14:20:00',
      payAmount: 6999.00,
      items: [
        { id: 1, name: 'iPhone 13 Pro', price: 6999.00, quantity: 1, mainImage: imageOf('iPhone 13 Pro', 200) },
      ],
    },
    {
      id: 'ORD202406150003',
      orderNo: 'ORD202406150003',
      status: 'completed',
      createdAt: '2024-06-10 09:15:00',
      payAmount: 4000.00,
      items: [
        { id: 1, name: 'HUAWEI MATE 40', price: 4000.00, quantity: 1, mainImage: imageOf('HUAWEI MATE 40', 200) },
      ],
    },
  ]
}

/**
 * 获取模拟的购物车数据
 */
export function getMockCartItems() {
  return goods.filter(g => g.isMarketable !== false).slice(0, 3).map(g => ({
    id: g.id,
    goodId: g.id,
    goodsName: g.goodsName,
    name: g.goodsName,
    price: g.price,
    quantity: Math.ceil(Math.random() * 2),
    num: Math.ceil(Math.random() * 2),
    mainImage: g.mainImage || generatePlaceholder(g.goodsName, 200, 200),
    selected: true,
    spec: '标准版',
  }))
}
