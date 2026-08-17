import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// NProgress 配置
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3,
})

// 路由配置 - 按模块懒加载
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/Index.vue'),
    meta: { title: 'BK商城 - 品质生活，尽在BK' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/Login.vue'),
    meta: { title: '登录 - BK商城', guest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/user/Register.vue'),
    meta: { title: '注册 - BK商城', guest: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/user/Profile.vue'),
    meta: { title: '个人中心 - BK商城', auth: true },
  },
  {
    path: '/profile/address',
    name: 'UserAddress',
    component: () => import('@/views/user/Address.vue'),
    meta: { title: '收货地址管理 - BK商城', auth: true },
  },
  {
    path: '/products',
    name: 'ProductList',
    component: () => import('@/views/product/List.vue'),
    meta: { title: '商品列表 - BK商城' },
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('@/views/product/Detail.vue'),
    meta: { title: '商品详情 - BK商城' },
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/cart/Index.vue'),
    meta: { title: '购物车 - BK商城', auth: true },
  },
  {
    path: '/order/confirm',
    name: 'OrderConfirm',
    component: () => import('@/views/order/Confirm.vue'),
    meta: { title: '确认订单 - BK商城', auth: true },
  },
  {
    path: '/orders',
    name: 'OrderList',
    component: () => import('@/views/order/List.vue'),
    meta: { title: '我的订单 - BK商城', auth: true },
  },
  {
    path: '/order/:id',
    name: 'OrderDetail',
    component: () => import('@/views/order/Detail.vue'),
    meta: { title: '订单详情 - BK商城', auth: true },
  },
  {
    path: '/seckill',
    name: 'Seckill',
    component: () => import('@/views/seckill/Index.vue'),
    meta: { title: '秒杀专区 - BK商城' },
  },
  {
    path: '/seckill/:id',
    name: 'SeckillDetail',
    component: () => import('@/views/seckill/Detail.vue'),
    meta: { title: '秒杀商品 - BK商城' },
  },
  {
    // 404 页面
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '404 - BK商城' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // 路由切换后回到顶部
    return { top: 0 }
  },
})

// 全局前置守卫 - 路由鉴权 + 进度条
router.beforeEach((to, from, next) => {
  // 开始 NProgress
  NProgress.start()

  // 设置页面标题
  document.title = to.meta.title || 'BK商城'

  // 需要认证的页面
  if (to.meta.auth) {
    const token = getToken()
    if (!token) {
      ElMessage.warning('请先登录')
      next({ name: 'Login', query: { redirect: to.fullPath } })
      NProgress.done()
      return
    }
  }

  // 已登录用户访问登录/注册页，重定向到首页
  if (to.meta.guest) {
    const token = getToken()
    if (token) {
      next({ name: 'Home' })
      NProgress.done()
      return
    }
  }

  next()
})

// 全局后置守卫 - 结束进度条
router.afterEach(() => {
  NProgress.done()
})

export default router
