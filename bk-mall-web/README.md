# BK商城 (BK Mall)

基于 **Vue 3 + Vite + Element Plus** 的综合性B2C电商平台前端项目。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.4+ | 前端框架，使用 Composition API |
| Vite | 5.1+ | 构建工具 |
| Pinia | 2.1+ | 状态管理 |
| Vue Router | 4.3+ | 路由管理 |
| Element Plus | 2.5+ | UI 组件库 |
| Axios | 1.6+ | HTTP 请求 |
| SCSS | - | CSS 预处理器 |
| Day.js | 1.11+ | 日期处理 |
| Swiper | 11+ | 轮播组件 |

## 项目结构

```
bk-mall-web/
├── public/                    # 静态资源
├── src/
│   ├── api/                   # API 接口层
│   │   ├── request.js         # Axios 封装（拦截器）
│   │   ├── user.js            # 用户接口
│   │   ├── product.js         # 商品接口
│   │   ├── cart.js            # 购物车接口
│   │   ├── order.js           # 订单接口
│   │   └── seckill.js         # 秒杀接口
│   ├── assets/styles/         # 全局样式
│   ├── components/            # 公共组件
│   │   ├── Header.vue         # 顶部导航
│   │   ├── Footer.vue         # 页脚
│   │   ├── ProductCard.vue    # 商品卡片
│   │   ├── Carousel.vue       # 轮播图
│   │   ├── BackToTop.vue      # 回到顶部
│   │   └── Skeleton.vue       # 骨架屏
│   ├── layouts/               # 布局组件
│   ├── router/                # 路由配置
│   ├── stores/                # Pinia 状态管理
│   ├── utils/                 # 工具函数
│   └── views/                 # 页面视图
│       ├── home/              # 首页
│       ├── product/           # 商品（列表/详情）
│       ├── cart/              # 购物车
│       ├── order/             # 订单（确认/列表）
│       ├── seckill/           # 秒杀（专区/详情）
│       └── user/              # 用户（登录/注册）
├── .env.development           # 开发环境变量
├── .env.production            # 生产环境变量
├── vite.config.js             # Vite 配置
└── package.json
```

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:3000）
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 后端对接

- **开发环境**: `http://localhost:8080`
- **生产环境**: `https://api.bkmall.com`
- Vite 已配置代理，开发时 `/api` 请求自动代理到后端
- Token 存储在 `localStorage`，key 为 `bk_mall_token`
- 所有接口返回格式：`{ code: 200, message: 'success', data: {} }`

## 功能模块

### 用户端
- ✅ 用户登录/注册（手机号 + 密码 / 验证码）
- ✅ JWT Token 认证（请求拦截器自动携带）
- ✅ 路由守卫（未登录拦截）
- ✅ 首页（轮播图、分类导航、秒杀、推荐商品、品牌专区）
- ✅ 商品列表（分类筛选、排序、分页）
- ✅ 商品详情（图片轮播、SKU选择、加入购物车）
- ✅ 购物车（数量管理、单选全选、总价计算）
- ✅ 订单确认（地址选择、商品清单、支付方式）
- ✅ 订单列表（状态筛选、取消/支付/确认收货）
- ✅ 秒杀专区（场次切换、倒计时、进度条）
- ✅ 秒杀详情（立即抢购、结果弹窗）
- ✅ 页面路由切换动画
- ✅ 回到顶部按钮
- ✅ 404 页面

## 页面路由

| 路径 | 页面 | 需要登录 |
|------|------|----------|
| `/` | 首页 | ❌ |
| `/login` | 登录 | ❌ |
| `/register` | 注册 | ❌ |
| `/products` | 商品列表 | ❌ |
| `/product/:id` | 商品详情 | ❌ |
| `/cart` | 购物车 | ✅ |
| `/order/confirm` | 确认订单 | ✅ |
| `/orders` | 订单列表 | ✅ |
| `/seckill` | 秒杀专区 | ❌ |
| `/seckill/:id` | 秒杀详情 | ❌ |
