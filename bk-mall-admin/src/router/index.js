import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false, trickleSpeed: 200 })

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录 - BK商城管理后台', public: true },
  },
  {
    path: '/',
    component: () => import('@/layout/AdminLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '工作台', icon: 'Odometer' },
      },
      {
        path: 'goods',
        name: 'Goods',
        component: () => import('@/views/goods/GoodsList.vue'),
        meta: { title: '商品管理', icon: 'Goods' },
      },
      {
        path: 'brand',
        name: 'Brand',
        component: () => import('@/views/brand/BrandList.vue'),
        meta: { title: '品牌管理', icon: 'CollectionTag' },
      },
      {
        path: 'productType',
        name: 'ProductType',
        component: () => import('@/views/productType/ProductTypeList.vue'),
        meta: { title: '分类管理', icon: 'Menu' },
      },
      {
        path: 'seckill',
        name: 'Seckill',
        component: () => import('@/views/seckill/SeckillList.vue'),
        meta: { title: '秒杀管理', icon: 'Timer' },
      },
      {
        path: 'sensitiveWord',
        name: 'SensitiveWord',
        component: () => import('@/views/sensitiveWord/SensitiveWordList.vue'),
        meta: { title: '敏感词管理', icon: 'Warning' },
      },
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/admin/AdminList.vue'),
        meta: { title: '管理员管理', icon: 'User' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  document.title = to.meta.title ? `${to.meta.title} - BK商城管理后台` : 'BK商城管理后台'
  if (to.meta.public) {
    next()
    return
  }
  // 会话认证：若本地标记未登录，跳转登录页
  const authed = sessionStorage.getItem('admin_authed')
  if (!authed) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    NProgress.done()
    return
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router