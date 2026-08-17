<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <img src="/favicon.svg" class="logo" alt="logo" />
        <h2>BK商城管理后台</h2>
        <p>欢迎回来，请输入管理员账号登录</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        size="large"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <el-link type="info" href="http://localhost:3000" target="_blank">
          返回商城前台 →
        </el-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { login } from '@/api/auth'

const router = useRouter()
const route = useRoute()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  await formRef.value.validate()
  loading.value = true
  try {
    const res = await login({
      username: form.username,
      password: form.password,
    })
    if (res.code === 200) {
      sessionStorage.setItem('admin_authed', '1')
      ElMessage.success('登录成功')
      router.replace(route.query.redirect || '/')
    }
  } catch (e) {
    // 登录失败：后端返回 BaseResult(402, 用户名或密码错误)，已在拦截器提示
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1f2d3d 0%, #3a4a63 50%, #409eff 130%);
  position: relative;
  overflow: hidden;
}
.login-page::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
  top: -150px;
  right: -150px;
}
.login-card {
  width: 400px;
  background: #fff;
  border-radius: 12px;
  padding: 40px 36px 28px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  position: relative;
  z-index: 1;
}
.login-header {
  text-align: center;
  margin-bottom: 28px;
}
.login-header .logo {
  width: 56px;
  height: 56px;
  margin-bottom: 12px;
}
.login-header h2 {
  font-size: 22px;
  color: #303133;
  margin-bottom: 6px;
}
.login-header p {
  font-size: 13px;
  color: #909399;
}
.login-btn {
  width: 100%;
  letter-spacing: 4px;
}
.login-footer {
  text-align: center;
  margin-top: 8px;
}
</style>