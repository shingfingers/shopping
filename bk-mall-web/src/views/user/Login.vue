<template>
  <div class="login-page">
    <!-- 左侧品牌展示区 -->
    <AuthBrandPanel />

    <!-- 右侧登录表单 -->
    <div class="form-panel">
      <div class="form-container">
        <div class="form-header">
          <h2>欢迎回来</h2>
          <p>登录BK商城，开启品质购物之旅</p>
        </div>

        <!-- 登录方式切换 -->
        <div class="login-tabs">
          <span
            :class="{ active: loginType === 'password' }"
            @click="loginType = 'password'"
          >
            密码登录
          </span>
          <span
            :class="{ active: loginType === 'code' }"
            @click="loginType = 'code'"
          >
            验证码登录
          </span>
        </div>

        <!-- 密码登录表单 -->
        <el-form
          v-if="loginType === 'password'"
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          size="large"
          @keyup.enter="handlePasswordLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="passwordForm.username"
              placeholder="请输入用户名/邮箱"
              :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="passwordForm.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <div class="form-extra">
              <el-checkbox v-model="passwordForm.rememberMe">记住密码</el-checkbox>
              <a href="javascript:void(0)">忘记密码？</a>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="submit-btn"
              :loading="loginLoading"
              @click="handlePasswordLogin"
            >
              登 录
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 验证码登录表单 -->
        <el-form
          v-if="loginType === 'code'"
          ref="codeFormRef"
          :model="codeForm"
          :rules="codeRules"
          size="large"
          @keyup.enter="handleCodeLogin"
        >
          <el-form-item prop="email">
            <el-input
              v-model="codeForm.email"
              placeholder="请输入邮箱"
              :prefix-icon="Message"
            />
          </el-form-item>
          <el-form-item prop="code">
            <div class="code-input-wrapper">
              <el-input
                v-model="codeForm.code"
                placeholder="请输入验证码"
                :prefix-icon="Key"
                maxlength="6"
              />
              <el-button
                type="primary"
                class="send-code-btn"
                :disabled="codeCountdown > 0"
                @click="handleSendCode"
              >
                {{ codeCountdown > 0 ? `${codeCountdown}s后重发` : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="submit-btn"
              :loading="loginLoading"
              @click="handleCodeLogin"
            >
              登 录
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 第三方登录 -->
        <div class="social-login">
          <span class="social-divider">或使用第三方登录</span>
          <div class="social-icons">
            <div class="social-icon wechat" title="微信登录">
              <el-icon :size="22"><ChatDotSquare /></el-icon>
            </div>
            <div class="social-icon qq" title="QQ登录">
              <el-icon :size="22"><ChatLineSquare /></el-icon>
            </div>
            <div class="social-icon weibo" title="微博登录">
              <el-icon :size="22"><ChatRound /></el-icon>
            </div>
          </div>
        </div>

        <!-- 底部链接 -->
        <div class="form-footer">
          <p>
            还没有账号？
            <router-link to="/register">立即注册</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import useUserStore from '@/stores/user'
import { User, Lock, Message, Key } from '@element-plus/icons-vue'
import { sendLoginCheckCode } from '@/api/user'
import { getRememberedAccount } from '@/utils/auth'
import AuthBrandPanel from '@/components/AuthBrandPanel.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginType = ref('password')
const loginLoading = ref(false)
const passwordFormRef = ref(null)
const codeFormRef = ref(null)
const codeCountdown = ref(0)

// 密码登录表单
const passwordForm = reactive({
  username: '',
  password: '',
  rememberMe: false,
})

const passwordRules = {
  username: [{ required: true, message: '请输入用户名或邮箱', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
}

// 验证码登录表单
const codeForm = reactive({
  email: '',
  code: '',
})

const codeRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
}

// 加载记住的账号
onMounted(() => {
  const remembered = getRememberedAccount()
  if (remembered) {
    passwordForm.username = remembered
    passwordForm.rememberMe = true
  }
})

// 密码登录
async function handlePasswordLogin() {
  const valid = await passwordFormRef.value?.validate().catch(() => false)
  if (!valid) return

  loginLoading.value = true
  try {
    await userStore.login({
      username: passwordForm.username,
      password: passwordForm.password,
      rememberMe: passwordForm.rememberMe,
    })
    ElMessage.success('登录成功')
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch {
    ElMessage.error('用户名或密码错误')
  } finally {
    loginLoading.value = false
  }
}

// 发送验证码
async function handleSendCode() {
  if (!codeForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(codeForm.email)) {
    ElMessage.warning('请输入正确的邮箱')
    return
  }

  try {
    await sendLoginCheckCode(codeForm.email)
    ElMessage.success('验证码已发送至邮箱')
    // 仅在发送成功后启动倒计时，避免用户误以为已发送
    codeCountdown.value = 60
    const timer = setInterval(() => {
      codeCountdown.value--
      if (codeCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    // 发送失败不启动倒计时；不再伪装成"已发送"
    if (error?.__offline) {
      ElMessage.warning('网络异常，验证码未发送，请检查后端服务')
    } else {
      ElMessage.error('验证码发送失败')
    }
  }
}

// 验证码登录
async function handleCodeLogin() {
  const valid = await codeFormRef.value?.validate().catch(() => false)
  if (!valid) return

  loginLoading.value = true
  try {
    await userStore.loginByCode(codeForm.email, codeForm.code)
    ElMessage.success('登录成功')
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch {
    ElMessage.error('验证码错误或已过期')
  } finally {
    loginLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  display: flex;
  min-height: 100vh;
}

// ============= 右侧表单区 =============
.form-panel {
  width: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 40px;
}

.form-container {
  width: 100%;
  max-width: 380px;
}

.form-header {
  margin-bottom: 32px;

  h2 {
    font-size: 28px;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: $text-secondary;
  }
}

.login-tabs {
  display: flex;
  gap: 32px;
  margin-bottom: 28px;

  span {
    font-size: 15px;
    color: $text-secondary;
    cursor: pointer;
    padding-bottom: 8px;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;

    &.active {
      color: $primary-color;
      border-bottom-color: $primary-color;
      font-weight: 600;
    }

    &:hover {
      color: $primary-color;
    }
  }
}

.form-extra {
  @include flex-between;
  width: 100%;
  font-size: 13px;

  a { color: $primary-color; text-decoration: none; }
}

.code-input-wrapper {
  display: flex;
  gap: 10px;
  width: 100%;

  .el-input { flex: 1; }
  .send-code-btn {
    width: 130px;
    flex-shrink: 0;
  }
}

.submit-btn {
  width: 100%;
  height: 46px;
  font-size: 16px;
  letter-spacing: 4px;
}

// ============= 第三方登录 =============
.social-login {
  margin-top: 28px;
  text-align: center;
}

.social-divider {
  display: block;
  font-size: 13px;
  color: $text-secondary;
  margin-bottom: 16px;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 60px;
    height: 1px;
    background: $border-color;
  }

  &::before { left: 0; }
  &::after { right: 0; }
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.social-icon {
  width: 44px;
  height: 44px;
  border-radius: $border-radius-round;
  border: 1px solid $border-color;
  @include flex-center;
  cursor: pointer;
  transition: all 0.2s;
  color: $text-secondary;

  &.wechat:hover {
    border-color: #67C23A;
    color: #67C23A;
    background: rgba(103, 194, 58, 0.06);
  }

  &.qq:hover {
    border-color: $primary-color;
    color: $primary-color;
    background: rgba(64, 158, 255, 0.06);
  }

  &.weibo:hover {
    border-color: $danger-color;
    color: $danger-color;
    background: rgba(245, 108, 108, 0.06);
  }
}

.form-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: $text-secondary;

  a {
    color: $primary-color;
    text-decoration: none;
    font-weight: 500;
  }
}
</style>
