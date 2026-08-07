<template>
  <!-- 客服浮动按钮 -->
  <div class="cs-wrapper">
    <!-- 浮动按钮 -->
    <div class="cs-float-btn" @click="togglePanel">
      <el-icon :size="24"><ChatDotSquare /></el-icon>
      <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
    </div>

    <!-- 聊天面板 -->
    <transition name="cs-slide">
      <div v-if="panelVisible" class="cs-panel">
        <!-- 头部 -->
        <div class="cs-header">
          <div class="cs-header-left">
            <el-icon :size="20" color="#fff"><Headset /></el-icon>
            <span>AI 智能客服</span>
          </div>
          <div class="cs-header-right">
            <el-icon :size="16" color="rgba(255,255,255,0.7)" style="cursor:pointer" @click="minimizePanel">
              <Minus />
            </el-icon>
            <el-icon :size="16" color="rgba(255,255,255,0.7)" style="cursor:pointer" @click="closePanel">
              <Close />
            </el-icon>
          </div>
        </div>

        <!-- 消息区 -->
        <div class="cs-body" ref="messageListRef">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="cs-message"
            :class="msg.role === 'user' ? 'is-user' : 'is-assistant'"
          >
            <div class="cs-avatar">
              <el-icon v-if="msg.role === 'user'" :size="16"><User /></el-icon>
              <el-icon v-else :size="16" color="#409EFF"><Headset /></el-icon>
            </div>
            <div class="cs-bubble">
              <div class="cs-text">{{ msg.content }}</div>
              <div class="cs-time">{{ formatTime(msg.createdAt) }}</div>
            </div>
          </div>

          <!-- 输入中... -->
          <div v-if="isThinking" class="cs-message is-assistant">
            <div class="cs-avatar">
              <el-icon :size="16" color="#409EFF"><Headset /></el-icon>
            </div>
            <div class="cs-bubble cs-typing">
              <span class="cs-dot"></span>
              <span class="cs-dot"></span>
              <span class="cs-dot"></span>
            </div>
          </div>

          <!-- 快捷问题 -->
          <div v-if="showQuickReplies && messages.length <= 1" class="cs-quick-replies">
            <div class="cs-quick-title">💡 常见问题</div>
            <div
              v-for="q in quickQuestions"
              :key="q"
              class="cs-quick-item"
              @click="sendMessage(q)"
            >
              {{ q }}
            </div>
          </div>
        </div>

        <!-- 输入区 -->
        <div class="cs-footer">
          <el-input
            v-model="inputText"
            placeholder="输入您的问题..."
            :disabled="isThinking"
            size="large"
            @keyup.enter="sendMessage(inputText)"
          >
            <template #suffix>
              <el-button
                type="primary"
                :icon="Promotion"
                :disabled="!inputText.trim() || isThinking"
                :loading="isThinking"
                circle
                @click="sendMessage(inputText)"
              />
            </template>
          </el-input>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Promotion } from '@element-plus/icons-vue'
import request from '@/api/request'
import { getToken } from '@/utils/auth'

// ============= 状态 =============
const panelVisible = ref(false)
const minimized = ref(false)
const inputText = ref('')
const isThinking = ref(false)
const unreadCount = ref(0)
const messageListRef = ref(null)

// 消息列表
const messages = ref([
  {
    id: 1,
    role: 'assistant',
    content: '您好！👋 我是 BK商城的 AI 智能客服助手，可以为您解答以下问题：\n\n• 📦 订单查询（物流、状态）\n• 🛒 商品咨询（价格、库存）\n• 🔄 退换货政策\n• 💳 支付问题\n• 🚚 配送时效\n\n请描述您的问题，我会尽力帮您解决！',
    createdAt: Date.now(),
  },
])

// 快捷问题
const quickQuestions = [
  '我的订单到哪里了？',
  '怎么申请退货？',
  '发货后多久能到？',
  '支持哪些支付方式？',
  '如何联系人工客服？',
]

const showQuickReplies = ref(true)

// ============= 本地 FAQ 备选库（后端不可用时自动启用） =============
const localFaq = {
  '退货': '您好，BK商城支持7天无理由退换货（部分特殊商品除外）。退货流程：1. 在我的订单页面申请退货 → 2. 填写退货原因并提交 → 3. 等待审核（1-3个工作日）→ 4. 审核通过后寄回商品 → 5. 收到退货后3-5个工作日退款。',
  '退款': '退款会在我们收到退货后的3-5个工作日内原路返回。微信支付退回微信零钱，支付宝退回支付宝余额，银行卡支付退回原卡。',
  '发货': '现货商品一般在24小时内发货，预售商品按页面标注时间发货。发货后您会收到短信通知，也可以在「我的订单」查看物流信息。',
  '物流': '我们合作的快递公司包括顺丰、中通、圆通、韵达等。您可以在订单详情页查看实时物流轨迹。',
  '支付': '目前支持以下支付方式：1️⃣ 支付宝支付 2️⃣ 微信支付 3️⃣ 银行卡支付（储蓄卡/信用卡）4️⃣ 货到付款（部分商品支持）。',
  '人工客服': '如需转接人工客服，请拨打客服热线：400-888-6666（服务时间：周一至周日 9:00-22:00），或在工作时间留言，我们会尽快回复您。',
  '优惠券': '您可以在「个人中心-我的优惠券」查看已领取的优惠券。新用户注册即送100元优惠券礼包。部分商品还可叠加使用满减优惠。',
  '秒杀': '秒杀活动每日10:00/14:00/20:00准时开抢，数量有限先到先得。秒杀商品不支持使用优惠券，且不支持7天无理由退货，请您理解。',
  '保修': '所有在BK商城购买的商品均享受品牌官方保修服务。电子产品一般保修1年，具体以商品页面说明为准。如需维修请联系品牌售后。',
  '默认': '感谢您的咨询！如果您的问题涉及订单查询或商品搜索，建议您登录后使用「我的订单」或搜索功能。如需更多帮助，请拨打客服热线 400-888-6666。',
}

// ============= 方法 =============
function togglePanel() {
  panelVisible.value = !panelVisible.value
  if (panelVisible.value) {
    unreadCount.value = 0
    scrollToBottom()
  }
}

function minimizePanel() {
  minimized.value = !minimized.value
  panelVisible.value = false
  unreadCount.value = 1
}

function closePanel() {
  panelVisible.value = false
}

function formatTime(timestamp) {
  const d = new Date(timestamp)
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

function scrollToBottom() {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

// 本地 FAQ 匹配
function findLocalAnswer(text) {
  for (const [keyword, answer] of Object.entries(localFaq)) {
    if (keyword !== '默认' && text.includes(keyword)) {
      return answer
    }
  }
  return localFaq['默认']
}

// 发送消息
async function sendMessage(text) {
  const content = (text || inputText.value).trim()
  if (!content || isThinking.value) return

  // 添加用户消息
  messages.value.push({
    id: messages.value.length + 1,
    role: 'user',
    content,
    createdAt: Date.now(),
  })
  inputText.value = ''
  showQuickReplies.value = false
  scrollToBottom()

  // 开始请求
  isThinking.value = true

  try {
    const token = getToken()
    const res = await request({
      url: '/user/custcare/answer',
      method: 'get',
      params: { message: content },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      // 如果后端返回格式是 BaseResult，从 response.data 取
      // 否则 fallback 到本地
    })

    // 处理响应
    const answer = res?.data || (typeof res === 'string' ? res : null)
    if (answer) {
      messages.value.push({
        id: messages.value.length + 1,
        role: 'assistant',
        content: answer,
        createdAt: Date.now(),
      })
    } else {
      throw new Error('empty response')
    }
  } catch {
    // 后端不可用时 -> 本地 FAQ 匹配
    const localAnswer = findLocalAnswer(content)
    messages.value.push({
      id: messages.value.length + 1,
      role: 'assistant',
      content: localAnswer,
      createdAt: Date.now(),
    })
  } finally {
    isThinking.value = false
    scrollToBottom()
  }
}

// 全局事件：外部调用打开客服
function handleOpenEvent() {
  panelVisible.value = true
  unreadCount.value = 0
}

onMounted(() => {
  window.addEventListener('openCustomerService', handleOpenEvent)
})

onUnmounted(() => {
  window.removeEventListener('openCustomerService', handleOpenEvent)
})
</script>

<style scoped lang="scss">
.cs-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: $z-tooltip;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;
}

// ============ 浮动按钮 ============
.cs-float-btn {
  width: 56px;
  height: 56px;
  border-radius: $border-radius-round;
  background: linear-gradient(135deg, $primary-color, #66b1ff);
  color: #fff;
  @include flex-center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba($primary-color, 0.4);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 24px rgba($primary-color, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }
}

.unread-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  background: $danger-color;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 600;
  @include flex-center;
  padding: 0 4px;
}

// ============ 聊天面板 ============
.cs-panel {
  position: absolute;
  bottom: 68px;
  right: 0;
  width: 380px;
  height: 560px;
  background: #fff;
  border-radius: $border-radius-small;
  box-shadow: $shadow-dark;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

// 头部
.cs-header {
  background: linear-gradient(135deg, $primary-color, #337ecc);
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;

  &-left {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #fff;
    font-size: 15px;
    font-weight: 500;
  }

  &-right {
    display: flex;
    gap: 12px;
  }
}

// 消息区
.cs-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f8f9fb;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d0d0d0;
    border-radius: 2px;
  }
}

.cs-message {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  max-width: 85%;

  &.is-user {
    flex-direction: row-reverse;
    margin-left: auto;

    .cs-bubble {
      background: linear-gradient(135deg, $primary-color, #337ecc);
      color: #fff;
      border-radius: 16px 4px 16px 16px;
    }

    .cs-time {
      text-align: right;
    }
  }

  &.is-assistant {
    .cs-bubble {
      background: #fff;
      border: 1px solid #eee;
      border-radius: 4px 16px 16px 16px;
      color: $text-primary;
    }
  }
}

.cs-avatar {
  width: 32px;
  height: 32px;
  border-radius: $border-radius-round;
  background: rgba($primary-color, 0.1);
  @include flex-center;
  flex-shrink: 0;
  margin-top: 2px;

  .is-assistant & {
    background: rgba($primary-color, 0.08);
  }
}

.cs-bubble {
  padding: 10px 14px;
  max-width: 100%;
  position: relative;
}

.cs-text {
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.cs-time {
  font-size: 10px;
  color: $text-placeholder;
  margin-top: 4px;
}

// 输入中动画
.cs-typing {
  display: flex;
  gap: 4px;
  padding: 14px 18px !important;
}

.cs-dot {
  width: 7px;
  height: 7px;
  border-radius: $border-radius-round;
  background: #ccc;
  animation: cs-bounce 1.4s infinite ease-in-out;

  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
}

@keyframes cs-bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-8px); }
}

// 快捷问题
.cs-quick-replies {
  margin-top: 8px;

  .cs-quick-title {
    font-size: 12px;
    color: $text-secondary;
    margin-bottom: 8px;
    padding-left: 4px;
  }

  .cs-quick-item {
    display: inline-block;
    padding: 6px 14px;
    margin: 0 6px 8px 0;
    background: #fff;
    border: 1px solid $border-color;
    border-radius: 16px;
    font-size: 12px;
    color: $text-regular;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: $primary-color;
      color: $primary-color;
      background: rgba($primary-color, 0.04);
    }
  }
}

// 底部输入
.cs-footer {
  padding: 12px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;

  :deep(.el-input) {
    .el-input__wrapper {
      border-radius: 24px;
      padding-right: 4px;
    }

    .el-input__suffix {
      .el-button {
        --el-button-size: 34px;
      }
    }
  }
}

// ============ 面板滑入动画 ============
.cs-slide-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.cs-slide-leave-active {
  transition: all 0.25s ease-in;
}

.cs-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  transform-origin: bottom right;
}

.cs-slide-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.97);
}
</style>
