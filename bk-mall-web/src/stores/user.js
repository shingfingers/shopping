import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getUserInfo,
  login as loginApi,
  loginCheckCode as loginCheckCodeApi,
  register as registerApi,
  logout as logoutApi,
} from '@/api/user'
import { getToken, setToken, removeToken, setUserId, getUserId, removeUserId, parseUserIdFromToken } from '@/utils/auth'

/**
 * 用户状态管理
 * 使用 Pinia Setup 语法定义
 * 注意：不要在 store 的 setup 中调用 useRouter()，它只能在组件 setup 中使用
 */
const useUserStore = defineStore('user', () => {

  // ==================== 状态 ====================
  const id = ref(null)
  const username = ref('')
  const phone = ref('')
  const email = ref('')
  const avatar = ref('')
  const roles = ref([])
  const infoLoaded = ref(false)

  // ==================== 计算属性 ====================
  /** 是否已登录 - 基于 Token 是否存在（避免 token 过期但 id 残留导致误判） */
  const isLoggedIn = computed(() => !!getToken())

  /** 显示名 - 优先用户名，否则脱敏手机号 */
  const displayName = computed(() => {
    if (username.value) return username.value
    if (phone.value) return phone.value.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
    return '游客'
  })

  // ==================== 方法 ====================

  /**
   * 用户登录（用户名密码）
   * @param {Object} loginForm - 登录表单
   * @param {string} loginForm.username - 用户名
   * @param {string} loginForm.password - 密码
   * @param {boolean} [loginForm.rememberMe] - 是否记住密码
   */
  async function login(loginForm) {
    const res = await loginApi({
      username: loginForm.username,
      password: loginForm.password,
      rememberMe: loginForm.rememberMe || false,
    })

    // 保存 token（后端返回 data 字段直接是 token 字符串）
    setToken(res.data)
    // 从 JWT 中解析并保存 userId（后端接口需要 userId 请求头）
    setUserId(parseUserIdFromToken(res.data))

    // 登录后立即加载用户信息
    await fetchUserInfo()

    return res
  }

  /**
   * 邮箱验证码登录
   * @param {string} email - 邮箱
   * @param {string} checkCode - 验证码
   */
  async function loginByCode(email, checkCode) {
    const res = await loginCheckCodeApi(email, checkCode)
    setToken(res.data)
    setUserId(parseUserIdFromToken(res.data))
    await fetchUserInfo()
    return res
  }

  /**
   * 用户注册
   * @param {Object} registerForm - 注册表单
   */
  async function register(registerForm) {
    const res = await registerApi({
      email: registerForm.email,
      password: registerForm.password,
      username: registerForm.username,
    })
    return res
  }

  /**
   * 获取用户信息
   * 用于首次登录后加载，以及页面刷新后恢复
   * 后端 getName 接口返回登录用户名
   */
  async function fetchUserInfo() {
    try {
      const res = await getUserInfo()
      username.value = res.data || ''
      // 优先使用 JWT 解析出的真实 userId（后端接口依赖 userId 请求头）
      id.value = getUserId() || id.value || Date.now()
      infoLoaded.value = true

      return res
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  /**
   * 退出登录
   * 清除token、重置状态、跳转登录页
   * 注意：使用 window.location 跳转，因为 store 中不能使用 useRouter()
   */
  async function logout() {
    try {
      await logoutApi()
    } catch (error) {
      console.error('退出登录接口失败:', error)
    } finally {
      resetState()
      window.location.href = '/login'
    }
  }

  /**
   * 重置所有状态到初始值
   */
  function resetState() {
    id.value = null
    username.value = ''
    phone.value = ''
    email.value = ''
    avatar.value = ''
    roles.value = []
    infoLoaded.value = false
    removeToken()
    removeUserId()
  }

  // ==================== 导出 ====================
  return {
    // 状态
    id,
    username,
    phone,
    email,
    avatar,
    roles,
    infoLoaded,
    // 计算属性
    isLoggedIn,
    displayName,
    // 方法
    login,
    loginByCode,
    register,
    fetchUserInfo,
    logout,
    resetState,
  }
}, {
  // 持久化配置
  persist: {
    key: 'bk_mall_user',
    storage: localStorage,
    pick: ['id', 'username', 'phone', 'email', 'avatar', 'roles'],
  },
})

export default useUserStore
