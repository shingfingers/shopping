<template>
  <DefaultLayout>
    <div class="address-page">
      <div class="section-inner">
        <div class="page-head">
          <h2 class="page-title">收货地址管理</h2>
          <el-button type="primary" @click="openAddDialog">
            <el-icon><Plus /></el-icon> 新增地址
          </el-button>
        </div>

        <!-- 地址列表 -->
        <div class="address-list" v-loading="addressLoading">
          <div v-for="addr in addresses" :key="addr.id" class="address-card">
            <div class="address-info">
              <span class="contact">{{ addr.contact }}</span>
              <span class="phone">{{ addr.mobile }}</span>
              <el-tag v-if="addr.isDefault" size="small" type="primary">默认</el-tag>
            </div>
            <p class="address-detail">{{ addr.provinceName }}{{ addr.cityName }}{{ addr.areaName }} {{ addr.address }}</p>
            <div class="address-actions">
              <el-button link @click="openEditDialog(addr)">
                <el-icon><Edit /></el-icon> 编辑
              </el-button>
              <el-button link type="danger" @click="handleDeleteAddress(addr)">
                <el-icon><Delete /></el-icon> 删除
              </el-button>
            </div>
          </div>
          <el-empty v-if="!addressLoading && addresses.length === 0" description="暂无收货地址，点击上方【新增地址】添加" />
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
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import {
  getAddressList,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllProvinces,
  getCitiesByProvince,
  getAreasByCity,
} from '@/api/address'

// 省市区离线降级数据（后端 order_customer_api 未启动时使用）
const FALLBACK_REGION = {
  provinces: [
    { id: 1, provinceName: '北京市' },
    { id: 2, provinceName: '上海市' },
    { id: 3, provinceName: '广东省' },
    { id: 4, provinceName: '浙江省' },
    { id: 5, provinceName: '江苏省' },
    { id: 6, provinceName: '四川省' },
  ],
  cities: [
    { id: 101, city: '北京市', provinceId: 1 },
    { id: 201, city: '上海市', provinceId: 2 },
    { id: 301, city: '广州市', provinceId: 3 },
    { id: 302, city: '深圳市', provinceId: 3 },
    { id: 401, city: '杭州市', provinceId: 4 },
    { id: 402, city: '宁波市', provinceId: 4 },
    { id: 501, city: '南京市', provinceId: 5 },
    { id: 502, city: '苏州市', provinceId: 5 },
    { id: 601, city: '成都市', provinceId: 6 },
  ],
  areas: [
    { id: 1001, area: '东城区', cityId: 101 },
    { id: 1002, area: '西城区', cityId: 101 },
    { id: 1003, area: '海淀区', cityId: 101 },
    { id: 2001, area: '黄浦区', cityId: 201 },
    { id: 2002, area: '浦东新区', cityId: 201 },
    { id: 3001, area: '天河区', cityId: 301 },
    { id: 3002, area: '越秀区', cityId: 301 },
    { id: 3003, area: '南山区', cityId: 302 },
    { id: 3004, area: '福田区', cityId: 302 },
    { id: 4001, area: '西湖区', cityId: 401 },
    { id: 4002, area: '滨江区', cityId: 401 },
    { id: 4003, area: '海曙区', cityId: 402 },
    { id: 5001, area: '玄武区', cityId: 501 },
    { id: 5002, area: '鼓楼区', cityId: 501 },
    { id: 5003, area: '吴中区', cityId: 502 },
    { id: 6001, area: '锦江区', cityId: 601 },
    { id: 6002, area: '武侯区', cityId: 601 },
  ],
}

const addresses = ref([])
const addressLoading = ref(false)

const dialogVisible = ref(false)
const dialogMode = ref('add')
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

async function loadAddresses() {
  addressLoading.value = true
  try {
    const res = await getAddressList()
    addresses.value = res.data || []
  } catch (error) {
    if (error?.__offline) {
      ElMessage.warning('网络异常，地址加载失败')
    } else {
      ElMessage.error('获取收货地址失败')
    }
  } finally {
    addressLoading.value = false
  }
}

function validateRegion() {
  formRef.value?.validateField('provinceId')
}

async function ensureProvinces() {
  if (provinces.value.length > 0) return
  try {
    const res = await getAllProvinces()
    if (res.data && res.data.length > 0) {
      provinces.value = res.data || []
    } else {
      provinces.value = FALLBACK_REGION.provinces
    }
  } catch (error) {
    provinces.value = FALLBACK_REGION.provinces
  }
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
    if (res.data && res.data.length > 0) {
      cities.value = res.data || []
    } else {
      cities.value = FALLBACK_REGION.cities.filter(c => c.provinceId === addressForm.value.provinceId)
    }
  } catch (error) {
    cities.value = FALLBACK_REGION.cities.filter(c => c.provinceId === addressForm.value.provinceId)
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
    if (res.data && res.data.length > 0) {
      areas.value = res.data || []
    } else {
      areas.value = FALLBACK_REGION.areas.filter(a => a.cityId === addressForm.value.cityId)
    }
  } catch (error) {
    areas.value = FALLBACK_REGION.areas.filter(a => a.cityId === addressForm.value.cityId)
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
    /* 内部已降级，忽略 */
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
    const province = provinces.value.find(p => p.provinceName === addr.provinceName)
    if (province) {
      addressForm.value.provinceId = province.id
      let cityList
      try {
        const cityRes = await getCitiesByProvince(province.id)
        cityList = (cityRes.data && cityRes.data.length > 0) ? cityRes.data : FALLBACK_REGION.cities.filter(c => c.provinceId === province.id)
      } catch {
        cityList = FALLBACK_REGION.cities.filter(c => c.provinceId === province.id)
      }
      cities.value = cityList
      const city = cityList.find(c => c.city === addr.cityName)
      if (city) {
        addressForm.value.cityId = city.id
        let areaList
        try {
          const areaRes = await getAreasByCity(city.id)
          areaList = (areaRes.data && areaRes.data.length > 0) ? areaRes.data : FALLBACK_REGION.areas.filter(a => a.cityId === city.id)
        } catch {
          areaList = FALLBACK_REGION.areas.filter(a => a.cityId === city.id)
        }
        areas.value = areaList
        const area = areaList.find(a => a.area === addr.areaName)
        if (area) addressForm.value.areaId = area.id
      }
    }
    formRef.value?.clearValidate()
  } catch (error) {
    /* 内部已降级，忽略 */
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
    await loadAddresses()
  } catch (error) {
    if (error?.__offline) ElMessage.warning('网络异常，请稍后重试')
    else ElMessage.error('操作失败')
  }
}

onMounted(() => {
  loadAddresses()
})
</script>

<style scoped lang="scss">
.address-page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: $spacing-xxxl;
}

.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-xl;
}

.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-xxl 0 $spacing-lg;
}

.address-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;

  .address-card {
    background: $bg-white;
    border-radius: $border-radius-large;
    padding: $spacing-xl;
    box-shadow: $shadow-sm;
    transition: $transition-base;

    &:hover {
      box-shadow: $shadow-md;
    }

    .address-info {
      display: flex;
      align-items: center;
      gap: $spacing-md;

      .contact {
        font-size: 16px;
        font-weight: 600;
        color: $text-primary;
      }

      .phone {
        color: $text-regular;
        font-size: 14px;
      }
    }

    .address-detail {
      color: $text-regular;
      font-size: 14px;
      line-height: 1.6;
      margin: $spacing-md 0;
    }

    .address-actions {
      display: flex;
      justify-content: flex-end;
      gap: $spacing-sm;
      border-top: 1px solid $border-color-light;
      padding-top: $spacing-sm;
    }
  }
}

.region-selects {
  display: flex;
  gap: $spacing-sm;
  width: 100%;

  :deep(.el-select) {
    flex: 1;
  }
}

@include respond-to('mobile') {
  .address-list {
    grid-template-columns: 1fr;
  }
}
</style>