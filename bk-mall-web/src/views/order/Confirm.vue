<template>
  <DefaultLayout>
    <div class="order-confirm-page">
      <div class="section-inner">
        <h2 class="page-title">确认订单</h2>

        <div class="confirm-layout">
          <!-- 左侧：订单信息 -->
          <div class="main-col">
            <!-- 收货地址 -->
            <div class="block address-block">
              <div class="block-header">
                <h3><el-icon><Location /></el-icon> 收货地址</h3>
                <el-button type="primary" size="small" plain @click="openAddDialog">
                  <el-icon><Plus /></el-icon> 新增地址
                </el-button>
              </div>
              <div class="address-list" v-loading="addressLoading">
                <div
                  v-for="addr in addresses"
                  :key="addr.id"
                  class="address-card"
                  :class="{ active: selectedAddress?.id === addr.id }"
                  @click="selectedAddress = addr"
                >
                  <div class="address-info">
                    <span class="contact">{{ addr.contact }}</span>
                    <span class="phone">{{ addr.mobile }}</span>
                    <el-tag v-if="addr.isDefault" size="small" type="primary">默认</el-tag>
                  </div>
                  <p class="address-detail">{{ addr.provinceName }}{{ addr.cityName }}{{ addr.areaName }} {{ addr.address }}</p>
                  <div class="address-actions" @click.stop>
                    <el-button link size="small" @click="openEditDialog(addr)">编辑</el-button>
                    <el-button link size="small" type="danger" @click="handleDeleteAddress(addr)">删除</el-button>
                  </div>
                  <el-icon v-if="selectedAddress?.id === addr.id" class="check-icon" color="#409EFF">
                    <CircleCheckFilled />
                  </el-icon>
                </div>
                <div v-if="!addressLoading && addresses.length === 0" class="address-empty">
                  暂无收货地址，请点击"新增地址"添加
                </div>
              </div>
            </div>

            <!-- 新增/编辑地址弹窗 -->
            <el-dialog
              v-model="dialogVisible"
              :title="dialogMode === 'add' ? '新增收货地址' : '编辑收货地址'"
              width="560px"
              @closed="resetAddressForm"
            >
              <el-form ref="formRef" :model="addressForm" :rules="formRules" label-width="90px">
                <el-form-item label="收货人" prop="contact">
                  <el-input v-model="addressForm.contact" placeholder="请输入收货人姓名" maxlength="20" />
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                  <el-input v-model="addressForm.mobile" placeholder="请输入手机号" maxlength="11" />
                </el-form-item>
                <el-form-item label="所在地区" prop="provinceId">
                  <div class="region-selects">
                    <el-select
                      v-model="addressForm.provinceId"
                      placeholder="省份"
                      :loading="regionLoading"
                      @change="onProvinceChange"
                    >
                      <el-option v-for="p in provinces" :key="p.id" :label="p.provinceName" :value="p.id" />
                    </el-select>
                    <el-select
                      v-model="addressForm.cityId"
                      placeholder="城市"
                      :loading="regionLoading"
                      :disabled="!addressForm.provinceId"
                      @change="onCityChange"
                    >
                      <el-option v-for="c in cities" :key="c.id" :label="c.city" :value="c.id" />
                    </el-select>
                    <el-select
                      v-model="addressForm.areaId"
                      placeholder="区/县"
                      :loading="regionLoading"
                      :disabled="!addressForm.cityId"
                      @change="validateRegion"
                    >
                      <el-option v-for="a in areas" :key="a.id" :label="a.area" :value="a.id" />
                    </el-select>
                  </div>
                </el-form-item>
                <el-form-item label="详细地址" prop="address">
                  <el-input
                    v-model="addressForm.address"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入详细地址"
                    maxlength="100"
                    show-word-limit
                  />
                </el-form-item>
              </el-form>
              <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="submittingAddress" @click="submitAddressForm">保存</el-button>
              </template>
            </el-dialog>

            <!-- 商品清单 -->
            <div class="block goods-block">
              <div class="block-header">
                <h3><el-icon><Goods /></el-icon> 商品清单</h3>
              </div>
              <div class="goods-list">
                <div v-for="item in orderItems" :key="item.id" class="goods-item">
                  <img :src="item.mainImage || item.headerPic || placeholderImage" :alt="item.name" />
                  <div class="goods-info">
                    <p class="goods-name">{{ item.name || item.goodsName }}</p>
                    <p class="goods-spec" v-if="item.spec">规格：{{ item.spec }}</p>
                  </div>
                  <span class="goods-price">¥{{ formatPrice(item.price) }}</span>
                  <span class="goods-quantity">× {{ item.quantity }}</span>
                  <span class="goods-subtotal">¥{{ formatPrice(item.price * item.quantity) }}</span>
                </div>
              </div>
            </div>

            <!-- 支付方式 -->
            <div class="block payment-block">
              <div class="block-header">
                <h3><el-icon><Wallet /></el-icon> 支付方式</h3>
              </div>
              <div class="payment-options">
                <div
                  v-for="pay in paymentMethods"
                  :key="pay.value"
                  class="payment-option"
                  :class="{ active: payMethod === pay.value }"
                  @click="payMethod = pay.value"
                >
                  <el-icon :size="20"><component :is="pay.icon" /></el-icon>
                  <span>{{ pay.label }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：金额汇总 -->
          <div class="side-col">
            <div class="summary-card">
              <h4>订单汇总</h4>
              <div class="summary-rows">
                <div class="summary-row">
                  <span>商品总价</span>
                  <span>¥{{ formatPrice(totalAmount) }}</span>
                </div>
                <div class="summary-row">
                  <span>运费</span>
                  <span class="free-shipping">免运费</span>
                </div>
                <div class="summary-row discount" v-if="discount > 0">
                  <span>优惠减免</span>
                  <span>-¥{{ formatPrice(discount) }}</span>
                </div>
              </div>
              <div class="summary-total">
                <span>应付金额</span>
                <span class="total-amount">¥{{ formatPrice(totalAmount - discount) }}</span>
              </div>
              <el-button type="danger" size="large" class="submit-btn" :loading="submitting" @click="handleSubmitOrder">
                提交订单
              </el-button>
              <p class="agree-tip">
                提交订单即表示同意 <a href="#">《BK商城服务协议》</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import useCartStore from '@/stores/cart'
import useUserStore from '@/stores/user'
import { createOrder } from '@/api/order'
import { getProductDetail } from '@/api/product'
import {
  getAddressList,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllProvinces,
  getCitiesByProvince,
  getAreasByCity,
} from '@/api/address'
import { formatPrice } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const submitting = ref(false)
const payMethod = ref('alipay')
const placeholderImage = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">' +
  '<rect fill="#f5f5f5" width="60" height="60"/><text fill="#ccc" x="50%" y="50%" ' +
  'text-anchor="middle" dy=".3em" font-size="8">暂无</text></svg>'
)

const paymentMethods = [
  { label: '支付宝', value: 'alipay', icon: 'BankCard' },
  { label: '微信支付', value: 'wechat', icon: 'ChatDotSquare' },
  { label: '银行卡', value: 'bank', icon: 'CreditCard' },
]

// 收货地址
const FALLBACK_ADDRESSES = [
  { id: 1, contact: '张三', mobile: '138****8888', provinceName: '北京市', cityName: '朝阳区', areaName: '', address: '望京街道SOHO 3号楼 1806室', isDefault: true },
  { id: 2, contact: '李四', mobile: '139****6666', provinceName: '上海市', cityName: '浦东新区', areaName: '', address: '张江高科技园区 博云路2号', isDefault: false },
]
const addresses = ref([])
const selectedAddress = ref(null)
const addressLoading = ref(false)

async function loadAddresses() {
  addressLoading.value = true
  try {
    const res = await getAddressList()
    addresses.value = res.data || []
    selectedAddress.value = addresses.value.find(a => a.isDefault) || addresses.value[0] || null
  } catch (error) {
    if (error?.__offline) {
      // 离线降级到本地示例地址，保证页面可用
      addresses.value = FALLBACK_ADDRESSES
      selectedAddress.value = addresses.value[0]
    } else {
      ElMessage.error('获取收货地址失败')
    }
  } finally {
    addressLoading.value = false
  }
}

// 新增/编辑地址弹窗
const dialogVisible = ref(false)
const dialogMode = ref('add') // 'add' | 'edit'
const submittingAddress = ref(false)
const regionLoading = ref(false)
const formRef = ref(null)
const provinces = ref([])
const cities = ref([])
const areas = ref([])
const addressForm = ref({
  id: null,
  contact: '',
  mobile: '',
  provinceId: '',
  cityId: '',
  areaId: '',
  address: '',
})

const formRules = {
  contact: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
  ],
  provinceId: [
    {
      validator: (rule, value, cb) => {
        if (!addressForm.value.provinceId || !addressForm.value.cityId || !addressForm.value.areaId) {
          cb(new Error('请选择所在地区'))
        } else {
          cb()
        }
      },
      trigger: 'change',
    },
  ],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
}

function validateRegion() {
  formRef.value?.validateField('provinceId')
}

async function ensureProvinces() {
  if (provinces.value.length > 0) return
  const res = await getAllProvinces()
  provinces.value = res.data || []
}

async function onProvinceChange() {
  addressForm.value.cityId = ''
  addressForm.value.areaId = ''
  cities.value = []
  areas.value = []
  validateRegion()
  if (!addressForm.value.provinceId) return
  try {
    regionLoading.value = true
    const res = await getCitiesByProvince(addressForm.value.provinceId)
    cities.value = res.data || []
  } catch (error) {
    if (error?.__offline) ElMessage.warning('网络异常，城市加载失败')
    else ElMessage.error('城市加载失败')
  } finally {
    regionLoading.value = false
  }
}

async function onCityChange() {
  addressForm.value.areaId = ''
  areas.value = []
  validateRegion()
  if (!addressForm.value.cityId) return
  try {
    regionLoading.value = true
    const res = await getAreasByCity(addressForm.value.cityId)
    areas.value = res.data || []
  } catch (error) {
    if (error?.__offline) ElMessage.warning('网络异常，区县加载失败')
    else ElMessage.error('区县加载失败')
  } finally {
    regionLoading.value = false
  }
}

function resetAddressForm() {
  addressForm.value = { id: null, contact: '', mobile: '', provinceId: '', cityId: '', areaId: '', address: '' }
  cities.value = []
  areas.value = []
  formRef.value?.clearValidate()
}

async function openAddDialog() {
  dialogMode.value = 'add'
  resetAddressForm()
  dialogVisible.value = true
  try {
    await ensureProvinces()
  } catch (error) {
    if (error?.__offline) ElMessage.warning('网络异常，省份加载失败')
    else ElMessage.error('省份加载失败')
  }
}

async function openEditDialog(addr) {
  dialogMode.value = 'edit'
  resetAddressForm()
  addressForm.value = {
    id: addr.id,
    contact: addr.contact || '',
    mobile: addr.mobile || '',
    provinceId: '',
    cityId: '',
    areaId: '',
    address: addr.address || '',
  }
  dialogVisible.value = true
  try {
    await ensureProvinces()
    // 通过已保存的名称回填省/市/区
    const province = provinces.value.find(p => p.provinceName === addr.provinceName)
    if (province) {
      addressForm.value.provinceId = province.id
      const cityRes = await getCitiesByProvince(province.id)
      cities.value = cityRes.data || []
      const city = cities.value.find(c => c.city === addr.cityName)
      if (city) {
        addressForm.value.cityId = city.id
        const areaRes = await getAreasByCity(city.id)
        areas.value = areaRes.data || []
        const area = areas.value.find(a => a.area === addr.areaName)
        if (area) addressForm.value.areaId = area.id
      }
    }
    formRef.value?.clearValidate()
  } catch (error) {
    if (error?.__offline) ElMessage.warning('网络异常，地址信息加载失败')
    else ElMessage.error('地址信息加载失败')
  }
}

async function submitAddressForm() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  const province = provinces.value.find(p => p.id === addressForm.value.provinceId)
  const city = cities.value.find(c => c.id === addressForm.value.cityId)
  const area = areas.value.find(a => a.id === addressForm.value.areaId)
  const payload = {
    contact: addressForm.value.contact,
    mobile: addressForm.value.mobile,
    provinceName: province?.provinceName || '',
    cityName: city?.city || '',
    areaName: area?.area || '',
    address: addressForm.value.address,
  }
  submittingAddress.value = true
  try {
    if (dialogMode.value === 'add') {
      await addAddress(payload)
      ElMessage.success('地址添加成功')
    } else {
      await updateAddress({ ...payload, id: addressForm.value.id })
      ElMessage.success('地址更新成功')
    }
    dialogVisible.value = false
    await loadAddresses()
  } catch (error) {
    if (error?.__offline) ElMessage.warning('网络异常，请稍后重试')
    else ElMessage.error('操作失败')
  } finally {
    submittingAddress.value = false
  }
}

async function handleDeleteAddress(addr) {
  try {
    await ElMessageBox.confirm('确认删除该收货地址？', '提示', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }
  try {
    await deleteAddress(addr.id)
    ElMessage.success('删除成功')
    if (selectedAddress.value?.id === addr.id) selectedAddress.value = null
    await loadAddresses()
  } catch (error) {
    if (error?.__offline) ElMessage.warning('网络异常，请稍后重试')
    else ElMessage.error('操作失败')
  }
}

// 订单商品
const orderItems = computed(() => {
  // 从购物车获取已选中商品（字段映射：goodId/num → id/quantity）
  const selected = cartStore.items
    .filter(i => i.selected)
    .map(i => ({
      id: i.goodId || i.id,
      goodId: i.goodId,
      name: i.goodsName,
      goodsName: i.goodsName,
      price: Number(i.price) || 0,
      quantity: i.num || i.quantity || 1,
      mainImage: i.headerPic,
      headerPic: i.headerPic,
      spec: i.spec,
    }))
  if (selected.length > 0) return selected

  // 从URL参数获取（立即购买场景）—— 用已加载的商品信息
  const productId = route.query.productId
  if (productId && buyNowProduct.value) {
    return [{
      id: productId,
      goodId: productId,
      name: buyNowProduct.value.goodsName || buyNowProduct.value.name,
      goodsName: buyNowProduct.value.goodsName || buyNowProduct.value.name,
      price: Number(buyNowProduct.value.price) || 0,
      quantity: Number(route.query.quantity) || 1,
      mainImage: buyNowProduct.value.headerPic || buyNowProduct.value.mainImage,
      headerPic: buyNowProduct.value.headerPic || buyNowProduct.value.mainImage,
    }]
  }

  return []
})

// 立即购买场景：根据 URL productId 加载商品详情
const buyNowProduct = ref(null)
async function loadBuyNowProduct() {
  const productId = route.query.productId
  if (!productId) return
  // 如果购物车已有该商品且选中，无需重复加载
  const inCart = cartStore.items.some(i => i.selected && String(i.goodId) === String(productId))
  if (inCart) return
  try {
    const res = await getProductDetail(productId)
    buyNowProduct.value = res.data
  } catch (e) {
    console.error('加载立即购买商品失败', e)
  }
}

const totalAmount = computed(() =>
  orderItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

const discount = computed(() => Math.floor(totalAmount.value * 0.05)) // 模拟5%折扣

async function handleSubmitOrder() {
  if (!selectedAddress.value) {
    ElMessage.warning('请选择收货地址')
    return
  }

  ElMessageBox.confirm(
    `应付金额：¥${formatPrice(totalAmount.value - discount.value)}，确认提交订单？`,
    '确认订单',
    { confirmButtonText: '确认支付', cancelButtonText: '再看看', type: 'info' }
  ).then(async () => {
    submitting.value = true
    try {
      await createOrder({
        addressId: selectedAddress.value.id,
        items: orderItems.value.map(i => ({
          productId: i.id || i.goodsId || i.goodId,
          quantity: i.quantity,
          spec: i.spec,
        })),
        payMethod: payMethod.value,
      })
      ElMessage.success('订单提交成功！')

      // 清除已下单的商品
      cartStore.items
        .filter(i => i.selected)
        .forEach(i => cartStore.deleteItem([i.id]))

      router.push({ name: 'OrderList' })
    } catch (error) {
      // 离线时降级到本地，避免数据不一致；不再伪装成功
      if (error?.__offline) {
        ElMessage.warning('网络异常，订单未提交，请稍后重试')
      } else {
        ElMessage.error('订单提交失败')
      }
    } finally {
      submitting.value = false
    }
  }).catch(() => {})
}

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({ name: 'Login', query: { redirect: route.fullPath } })
    return
  }
  // 立即购买场景：根据 URL productId 加载商品详情
  await loadBuyNowProduct()
  // 购物车场景：加载购物车列表
  if (!route.query.productId) {
    await cartStore.fetchCartList()
  }
  loadAddresses()
})
</script>

<style scoped lang="scss">
.order-confirm-page {
  background: $bg-color;
  min-height: calc(100vh - 160px);
}

.section-inner {
  width: $layout-width;
  margin: 0 auto;
  padding: 0 20px 40px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: $text-primary;
  padding: 24px 0 16px;
}

.confirm-layout {
  display: flex;
  gap: 20px;
}

.main-col {
  flex: 1;
  min-width: 0;
}

// ============= 通用区块 =============
.block {
  background: #fff;
  border-radius: $border-radius-small;
  margin-bottom: 16px;
  overflow: hidden;
  border: 1px solid $border-color-light;
}

.block-header {
  padding: 16px 20px;
  border-bottom: 1px solid $border-color-light;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    display: flex;
    align-items: center;
    gap: 6px;
  }
}

// ============= 收货地址 =============
.address-list {
  padding: 16px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.address-card {
  border: 2px solid $border-color-light;
  border-radius: $border-radius-small;
  padding: 14px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;

  &:hover { border-color: rgba($primary-color, 0.3); }

  &.active {
    border-color: $primary-color;
    background: rgba($primary-color, 0.03);
  }

  .address-info {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;

    .contact { font-weight: 600; font-size: 14px; color: $text-primary; }
    .phone { font-size: 13px; color: $text-secondary; }
  }

  .address-detail {
    font-size: 13px;
    color: $text-regular;
    line-height: 1.5;
  }

  .check-icon {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 20px;
  }
}

// ============= 商品清单 =============
.goods-list {
  padding: 8px 20px;
}

.goods-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid $border-color-light;

  &:last-child { border-bottom: none; }

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: $border-radius-base;
    border: 1px solid $border-color-light;
  }

  .goods-info {
    flex: 1;

    .goods-name {
      font-size: 14px;
      color: $text-primary;
    }

    .goods-spec {
      font-size: 12px;
      color: $text-secondary;
      margin-top: 2px;
    }
  }

  .goods-price { color: $text-regular; font-size: 13px; width: 80px; text-align: right; }
  .goods-quantity { color: $text-secondary; font-size: 13px; width: 50px; text-align: center; }
  .goods-subtotal { color: $danger-color; font-weight: 600; font-size: 14px; width: 90px; text-align: right; }
}

// ============= 支付方式 =============
.payment-options {
  padding: 16px 20px;
  display: flex;
  gap: 16px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: 2px solid $border-color-light;
  border-radius: $border-radius-small;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;

  &:hover { border-color: rgba($primary-color, 0.3); }

  &.active {
    border-color: $primary-color;
    background: rgba($primary-color, 0.04);
    color: $primary-color;
    font-weight: 500;
  }
}

// ============= 侧边汇总 =============
.side-col {
  width: 320px;
  flex-shrink: 0;
}

.summary-card {
  background: #fff;
  border-radius: $border-radius-small;
  padding: 24px;
  position: sticky;
  top: 168px;
  border: 1px solid $border-color-light;

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid $border-color-light;
  }
}

.summary-rows {
  .summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: $text-regular;
    margin-bottom: 12px;

    &.discount { color: $danger-color; }
  }

  .free-shipping { color: $success-color; }
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 12px;
  border-top: 1px solid $border-color-light;
  margin-top: 12px;
  margin-bottom: 20px;

  .total-amount {
    font-size: 24px;
    font-weight: 700;
    color: $danger-color;
  }
}

.submit-btn {
  width: 100%;
  height: 46px;
  font-size: 16px;
}

.agree-tip {
  text-align: center;
  margin-top: 12px;
  font-size: 12px;
  color: $text-secondary;

  a { color: $primary-color; }
}

// ============= 地址区块扩展 =============
.address-block .block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.address-empty {
  grid-column: 1 / -1;
  text-align: center;
  color: $text-secondary;
  font-size: 13px;
  padding: 24px 0;
}

.address-actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}

// ============= 地址弹窗 =============
.region-selects {
  display: flex;
  gap: 8px;
  width: 100%;

  .el-select {
    flex: 1;
  }
}

// ========== 响应式适配 ==========
@include respond-to('tablet') {
  .section-inner {
    width: 100%;
  }
}

@include respond-to('mobile') {
  .section-inner {
    width: 100%;
    padding: 0 12px 40px;
  }

  .page-title {
    font-size: 18px;
    padding: 16px 0 12px;
  }

  // 双栏布局改为单栏纵向
  .confirm-layout {
    flex-direction: column;
    gap: 16px;
  }

  .side-col {
    width: 100%;
    flex-shrink: 1;

    .summary-card {
      position: static;
      padding: 16px;
    }
  }

  // 收货地址改为单列
  .address-list {
    grid-template-columns: 1fr;
  }

  // 商品清单改为可换行
  .goods-item {
    flex-wrap: wrap;
    gap: 8px;

    img {
      width: 56px;
      height: 56px;
    }

    .goods-info {
      flex: 1 1 calc(100% - 68px);
      min-width: 0;
    }

    .goods-price,
    .goods-quantity,
    .goods-subtotal {
      width: auto;
      flex: 1;
      text-align: left;
      font-size: 12px;
    }
  }

  // 区块标题与按钮换行
  .block-header {
    flex-wrap: wrap;
    gap: 8px;
  }

  // 支付方式换行
  .payment-options {
    flex-wrap: wrap;
    gap: 10px;
  }

  .payment-option {
    flex: 1 1 calc(50% - 5px);
    padding: 10px 14px;
    justify-content: center;
  }

  // 地址弹窗中的省市区选择换行
  .region-selects {
    flex-wrap: wrap;

    .el-select {
      flex: 1 1 calc(50% - 4px);
      min-width: 0;
    }
  }
}
</style>
