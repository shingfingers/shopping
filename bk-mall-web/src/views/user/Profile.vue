<template>
  <DefaultLayout>
    <div class="profile-page">
      <div class="page-banner">
        <div class="banner-inner">
          <div class="banner-text">
            <span class="banner-tag">MEMBERSHIP</span>
            <h2>个人中心</h2>
            <p>管理你的账户信息与商城服务</p>
          </div>
          <div class="banner-visual">👤</div>
        </div>
      </div>

      <div class="section-inner">
        <!-- 用户资料卡片 -->
        <div class="user-card">
          <div class="avatar-wrap">
            <div class="main-avatar" :style="avatarStyle">
              <span class="avatar-emoji">{{ avatarEmoji }}</span>
            </div>
            <div class="avatar-edit" @click="openAvatarEdit">
              <el-icon><Camera /></el-icon>
            </div>
          </div>
          <div class="user-meta">
            <div class="name-row">
              <h3 class="nickname">{{ userStore.username || userStore.displayName }}</h3>
              <el-button text type="primary" size="small" @click="openProfileEdit">
                <el-icon><Edit /></el-icon> 编辑资料
              </el-button>
            </div>
            <p class="account-tip">
              {{ userStore.isLoggedIn ? '已登录会员' : '未登录' }}
            </p>
            <div class="meta-grid">
              <div class="meta-item">
                <span class="meta-label">手机号</span>
                <span class="meta-value">{{ maskedPhone }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">邮箱</span>
                <span class="meta-value">{{ userStore.email || '未绑定' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 快捷服务 -->
        <div class="service-grid">
          <div class="service-card" @click="go('/orders')">
            <div class="service-icon order"><el-icon :size="26"><Tickets /></el-icon></div>
            <span class="service-name">我的订单</span>
          </div>
          <div class="service-card" @click="go('/cart')">
            <div class="service-icon cart"><el-icon :size="26"><ShoppingCart /></el-icon></div>
            <span class="service-name">购物车</span>
          </div>
          <div class="service-card" @click="go('/seckill')">
            <div class="service-icon seckill"><el-icon :size="26"><Timer /></el-icon></div>
            <span class="service-name">限时秒杀</span>
          </div>
          <div class="service-card" @click="go('/products')">
            <div class="service-icon goods"><el-icon :size="26"><Goods /></el-icon></div>
            <span class="service-name">全部商品</span>
          </div>
        </div>

        <!-- 账户设置 -->
        <div class="settings-block">
          <h3 class="block-title">账户设置</h3>
          <div class="settings-list">
            <div class="setting-row" @click="go('/orders')">
              <div class="setting-info">
                <el-icon><Tickets /></el-icon>
                <span>我的订单</span>
              </div>
              <el-icon class="arrow"><ArrowRight /></el-icon>
            </div>
            <div class="setting-row" @click="go('/profile/address')">
              <div class="setting-info">
                <el-icon><Location /></el-icon>
                <span>收货地址管理</span>
              </div>
              <el-icon class="arrow"><ArrowRight /></el-icon>
            </div>
            <div class="setting-row" @click="openProfileEdit">
              <div class="setting-info">
                <el-icon><EditPen /></el-icon>
                <span>编辑个人资料</span>
              </div>
              <el-icon class="arrow"><ArrowRight /></el-icon>
            </div>
            <div class="setting-row" @click="openAvatarEdit">
              <div class="setting-info">
                <el-icon><Camera /></el-icon>
                <span>更换头像</span>
              </div>
              <el-icon class="arrow"><ArrowRight /></el-icon>
            </div>
            <div class="setting-row logout" @click="handleLogout">
              <div class="setting-info">
                <el-icon><SwitchButton /></el-icon>
                <span>退出登录</span>
              </div>
              <el-icon class="arrow"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>

        <!-- 编辑资料弹窗 -->
        <el-dialog v-model="profileDialog" title="编辑个人资料" width="440px" append-to-body>
          <el-form ref="profileFormRef" :model="profileForm" :rules="profileRules" label-width="80px">
            <el-form-item label="昵称" prop="username">
              <el-input v-model="profileForm.username" placeholder="请输入昵称" maxlength="20" show-word-limit />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="profileForm.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="profileForm.phone" placeholder="请输入手机号" maxlength="11" />
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="profileDialog = false">取消</el-button>
            <el-button type="primary" @click="saveProfile">保存</el-button>
          </template>
        </el-dialog>

        <!-- 更换头像弹窗 -->
        <el-dialog v-model="avatarDialog" title="更换头像" width="440px" append-to-body>
          <div class="avatar-presets">
            <div
              v-for="preset in avatarPresets"
              :key="preset.key"
              class="preset-item"
              :class="{ active: selectedAvatar === `preset:${preset.key}` }"
              @click="selectedAvatar = `preset:${preset.key}`"
            >
              <div class="preset-avatar" :style="{ background: preset.bg }">
                <span class="preset-emoji">{{ preset.emoji }}</span>
              </div>
              <span class="preset-name">{{ preset.name }}</span>
            </div>
          </div>
          <template #footer>
            <el-button @click="avatarDialog = false">取消</el-button>
            <el-button type="primary" @click="saveAvatar">确定</el-button>
          </template>
        </el-dialog>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import useUserStore from '@/stores/user'
import { avatarPresets, getAvatarStyle, getAvatarEmoji } from '@/utils/avatar'

const router = useRouter()
const userStore = useUserStore()

// 当前头像样式解析（基于存储值找到对应预设）
const avatarStyle = computed(() => getAvatarStyle(userStore.avatar))

// 当前头像 emoji
const avatarEmoji = computed(() => getAvatarEmoji(userStore.avatar))

const maskedPhone = computed(() => {
  const p = userStore.phone
  if (!p) return '未绑定'
  return p.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
})

// 编辑资料弹窗
const profileDialog = ref(false)
const profileFormRef = ref(null)
const profileForm = reactive({ username: '', email: '', phone: '' })
const profileRules = {
  username: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
}

function openProfileEdit() {
  profileForm.username = userStore.username || ''
  profileForm.email = userStore.email || ''
  profileForm.phone = userStore.phone || ''
  profileDialog.value = true
}

async function saveProfile() {
  if (!profileFormRef.value) return
  try {
    await profileFormRef.value.validate()
  } catch {
    return
  }
  userStore.updateProfile({
    username: profileForm.username.trim(),
    email: profileForm.email.trim(),
    phone: profileForm.phone.trim(),
  })
  profileDialog.value = false
  ElMessage.success('资料已更新')
}

// 更换头像弹窗
const avatarDialog = ref(false)
const selectedAvatar = ref('')

function openAvatarEdit() {
  selectedAvatar.value = userStore.avatar || `preset:${avatarPresets[2].key}`
  avatarDialog.value = true
}

function saveAvatar() {
  userStore.updateProfile({ avatar: selectedAvatar.value })
  avatarDialog.value = false
  ElMessage.success('头像已更新')
}

function go(path) {
  router.push(path)
}

function handleLogout() {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '退出',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    userStore.logout()
  }).catch(() => {})
}

onMounted(() => {
  if (userStore.isLoggedIn && !userStore.infoLoaded) {
    userStore.fetchUserInfo().catch(() => {})
  }
})
</script>

<style scoped lang="scss">
.profile-page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: $spacing-xxxl;
}

// 顶部渐变横幅
.page-banner {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 45%, #60a5fa 100%);
  padding: $spacing-xxxl 0;
  color: #fff;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    right: 8%;
    top: -40px;
    width: 260px;
    height: 260px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
  }

  .banner-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 $spacing-xl;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 1;
  }

  .banner-tag {
    display: inline-block;
    font-size: 12px;
    letter-spacing: 2px;
    background: rgba(255, 255, 255, 0.2);
    padding: 3px 10px;
    border-radius: 20px;
    margin-bottom: $spacing-sm;
  }

  h2 {
    font-size: 30px;
    font-weight: 700;
    margin: 0 0 $spacing-xs;
  }

  p {
    font-size: 14px;
    opacity: 0.85;
    margin: 0;
  }

  .banner-visual {
    font-size: 72px;
    background: rgba(255, 255, 255, 0.15);
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: $shadow-dark;
  }
}

.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-xl;
}

// 用户资料卡片
.user-card {
  display: flex;
  align-items: center;
  gap: $spacing-xxl;
  background: $bg-white;
  border-radius: $border-radius-large;
  padding: $spacing-xxl;
  margin-top: -40px;
  position: relative;
  z-index: 2;
  box-shadow: $shadow-card;

  .avatar-wrap {
    position: relative;
    flex-shrink: 0;

    .main-avatar {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      border: 4px solid #fff;
      box-shadow: $shadow-md;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #3b82f6, #60a5fa);

      .avatar-emoji {
        font-size: 48px;
        line-height: 1;
      }
    }

    .avatar-edit {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: $primary-color;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 2px solid #fff;
      transition: $transition-fast;

      &:hover {
        background: $primary-dark;
        transform: scale(1.1);
      }
    }
  }

  .user-meta {
    flex: 1;

    .name-row {
      display: flex;
      align-items: center;
      gap: $spacing-sm;

      .nickname {
        font-size: 22px;
        font-weight: 700;
        color: $text-primary;
        margin: 0;
      }
    }

    .account-tip {
      color: $success-color;
      font-size: 13px;
      margin: $spacing-xs 0 $spacing-lg;
    }

    .meta-grid {
      display: flex;
      gap: $spacing-xxl;

      .meta-item {
        display: flex;
        flex-direction: column;
        gap: $spacing-xs;

        .meta-label {
          font-size: 12px;
          color: $text-secondary;
        }

        .meta-value {
          font-size: 15px;
          color: $text-primary;
          font-weight: 500;
        }
      }
    }
  }
}

// 快捷服务
.service-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
  margin-top: $spacing-xxl;

  .service-card {
    background: $bg-white;
    border-radius: $border-radius-large;
    padding: $spacing-xl;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-md;
    cursor: pointer;
    transition: $transition-base;
    box-shadow: $shadow-sm;

    &:hover {
      transform: translateY(-4px);
      box-shadow: $shadow-hover;
    }

    .service-icon {
      width: 56px;
      height: 56px;
      border-radius: $border-radius-large;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;

      &.order { background: linear-gradient(135deg, #3b82f6, #60a5fa); }
      &.cart { background: linear-gradient(135deg, #f97316, #fbbf24); }
      &.seckill { background: linear-gradient(135deg, #ef4444, #f87171); }
      &.goods { background: linear-gradient(135deg, #10b981, #34d399); }
    }

    .service-name {
      font-size: 14px;
      color: $text-primary;
      font-weight: 500;
    }
  }
}

// 账户设置
.settings-block {
  background: $bg-white;
  border-radius: $border-radius-large;
  padding: $spacing-xl;
  margin-top: $spacing-xxl;
  box-shadow: $shadow-sm;

  .block-title {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    margin: 0 0 $spacing-lg;
    padding-bottom: $spacing-md;
    border-bottom: 1px solid $border-color-light;
  }

  .settings-list {
    .setting-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $spacing-md 0;
      cursor: pointer;
      transition: $transition-fast;
      border-radius: $border-radius-base;

      &:hover {
        background: $primary-bg;
        padding-left: $spacing-sm;
      }

      &:not(:last-child) {
        border-bottom: 1px solid $border-color-light;
      }

      &.logout .setting-info { color: $danger-color; }

      .setting-info {
        display: flex;
        align-items: center;
        gap: $spacing-md;
        font-size: 14px;
        color: $text-primary;
      }

      .arrow {
        color: $text-secondary;
      }
    }
  }
}

// 头像预设
.avatar-presets {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;

  .preset-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-md;
    border-radius: $border-radius-small;
    cursor: pointer;
    transition: $transition-fast;
    border: 2px solid transparent;

    &:hover {
      background: $bg-color-grey;
    }

    &.active {
      border-color: $primary-color;
      background: $primary-bg;
    }

    .preset-avatar {
      width: 64px;
      height: 64px;
      border-radius: $border-radius-small;
      display: flex;
      align-items: center;
      justify-content: center;

      .preset-emoji {
        font-size: 32px;
        line-height: 1;
      }
    }

    .preset-name {
      font-size: 12px;
      color: $text-regular;
    }
  }
}

@include respond-to('mobile') {
  .user-card {
    flex-direction: column;
    text-align: center;
    gap: $spacing-lg;

    .user-meta {
      .name-row {
        justify-content: center;
      }

      .meta-grid {
        flex-direction: column;
        gap: $spacing-sm;
      }
    }
  }

  .service-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .banner-visual {
    display: none;
  }
}
</style>