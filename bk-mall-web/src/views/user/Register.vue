<template>
  <div class="register-page">
    <!-- 左侧品牌展示区 -->
    <AuthBrandPanel />

    <!-- 右侧注册表单 -->
    <div class="form-panel">
      <div class="form-container">
        <div class="form-header">
          <h2>创建账号</h2>
          <p>注册BK商城，发现更多精彩</p>
        </div>

        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="rules"
          size="large"
          @keyup.enter="handleRegister"
        >
          <!-- 邮箱 -->
          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱"
              :prefix-icon="Message"
            />
          </el-form-item>

          <!-- 验证码 -->
          <el-form-item prop="code">
            <div class="code-input-wrapper">
              <el-input
                v-model="registerForm.code"
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

          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请设置用户名"
              :prefix-icon="User"
              maxlength="20"
            />
          </el-form-item>

          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请设置密码 (6-20位字母和数字)"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>

          <!-- 确认密码 -->
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>

          <!-- 协议 -->
          <el-form-item prop="agreement">
            <el-checkbox v-model="registerForm.agreement">
              我已阅读并同意
              <a href="#">《BK商城用户协议》</a>
              和
              <a href="#">《隐私政策》</a>
            </el-checkbox>
          </el-form-item>

          <!-- 注册按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              class="submit-btn"
              :loading="registerLoading"
              @click="handleRegister"
            >
              注 册
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 底部链接 -->
        <div class="form-footer">
          <p>
            已有账号？
            <router-link to="/login">立即登录</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import useUserStore from '@/stores/user'
import { User, Lock, Message, Key } from '@element-plus/icons-vue'
import { sendEmailCode, registerCheckCode } from '@/api/user'
import AuthBrandPanel from '@/components/AuthBrandPanel.vue'

const router = useRouter()
const userStore = useUserStore()
const registerFormRef = ref(null)
const registerLoading = ref(false)
const codeCountdown = ref(0)

const registerForm = reactive({
  email: '',
  code: '',
  username: '',
  password: '',
  confirmPassword: '',
  agreement: false,
})

// 自定义校验：确认密码
const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 自定义校验：协议
const validateAgreement = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请阅读并同意用户协议'))
  } else {
    callback()
  }
}

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  username: [
    { required: true, message: '请设置用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在2-20个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请设置密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20位之间', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
  agreement: [{ validator: validateAgreement, trigger: 'change' }],
}

// 发送验证码
async function handleSendCode() {
  if (!registerForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
    ElMessage.warning('请输入正确的邮箱')
    return
  }

  try {
    await sendEmailCode(registerForm.email)
    ElMessage.success('验证码已发送至邮箱')
  } catch (error) {
    if (error?.__offline) {
      // 后端不可用时的离线降级（模拟发送）
      ElMessage.success('验证码已发送（模拟）')
    } else {
      ElMessage.error('验证码发送失败，请检查邮箱后重试')
    }
  }

  codeCountdown.value = 60
  const timer = setInterval(() => {
    codeCountdown.value--
    if (codeCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 提交注册
async function handleRegister() {
  const valid = await registerFormRef.value?.validate().catch(() => false)
  if (!valid) return

  registerLoading.value = true
  try {
    // 1.验证邮箱验证码
    await registerCheckCode(registerForm.email, registerForm.code)
    // 2.提交注册
    await userStore.register({
      email: registerForm.email,
      username: registerForm.username,
      password: registerForm.password,
    })
    ElMessage.success('注册成功，即将跳转到登录页')
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch {
    ElMessage.error('注册失败，请检查验证码或稍后重试')
  } finally {
    registerLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.register-page {
  display: flex;
  min-height: 100vh;
}

// 右侧表单区
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
