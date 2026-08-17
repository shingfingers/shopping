<template>
  <div class="page-container">
    <div class="page-card">
      <div class="search-bar">
        <el-input
          v-model="query.goodsName"
          placeholder="商品名称"
          clearable
          style="width: 220px"
          @keyup.enter="handleSearch"
        />
        <el-select v-model="query.isMarketable" placeholder="上架状态" clearable style="width: 140px">
          <el-option label="已上架" :value="true" />
          <el-option label="已下架" :value="false" />
        </el-select>
        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        <div style="flex: 1"></div>
        <el-button type="success" :icon="Plus" @click="openDialog()">新增商品</el-button>
      </div>

      <el-table :data="list" v-loading="loading" border stripe>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="goodsName" label="商品名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="price" label="价格" width="110">
          <template #default="{ row }">
            <span class="price">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="brandId" label="品牌ID" width="90" />
        <el-table-column prop="caption" label="副标题" min-width="160" show-overflow-tooltip />
        <el-table-column label="上架状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.isMarketable ? 'success' : 'info'">
              {{ row.isMarketable ? '已上架' : '已下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button size="small" :icon="Edit" @click="openDialog(row)">编辑</el-button>
            <el-button
              size="small"
              :type="row.isMarketable ? 'warning' : 'success'"
              @click="handlePutAway(row)"
            >
              {{ row.isMarketable ? '下架' : '上架' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="query.page"
          v-model:page-size="query.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="560px"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="90px">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="form.goodsName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="副标题" prop="caption">
          <el-input v-model="form.caption" placeholder="请输入副标题" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :precision="2" :step="10" style="width: 100%" />
        </el-form-item>
        <el-form-item label="品牌ID" prop="brandId">
          <el-input-number v-model="form.brandId" :min="0" :step="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="一级分类" prop="productType1Id">
          <el-input-number v-model="form.productType1Id" :min="0" :step="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="二级分类" prop="productType2Id">
          <el-input-number v-model="form.productType2Id" :min="0" :step="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="三级分类" prop="productType3Id">
          <el-input-number v-model="form.productType3Id" :min="0" :step="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="商品介绍" prop="introduction">
          <el-input v-model="form.introduction" type="textarea" :rows="3" placeholder="请输入商品介绍" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Edit } from '@element-plus/icons-vue'
import { searchGoods, addGoods, updateGoods, putAwayGoods } from '@/api/goods'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({
  page: 1,
  size: 10,
  goodsName: '',
  isMarketable: undefined,
})

const dialogVisible = ref(false)
const saving = ref(false)
const formRef = ref()
const dialogTitle = ref('新增商品')
const emptyForm = {
  id: null,
  goodsName: '',
  caption: '',
  price: 0,
  brandId: null,
  productType1Id: null,
  productType2Id: null,
  productType3Id: null,
  introduction: '',
}
const form = reactive({ ...emptyForm })

const formRules = {
  goodsName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
}

async function loadData() {
  loading.value = true
  try {
    const params = { page: query.page, size: query.size }
    if (query.goodsName) params.goodsName = query.goodsName
    if (query.isMarketable !== undefined && query.isMarketable !== null) {
      params.isMarketable = query.isMarketable
    }
    const res = await searchGoods(params)
    if (res && res.data) {
      list.value = res.data.records || []
      total.value = res.data.total || 0
    }
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  query.page = 1
  loadData()
}

function handleReset() {
  query.goodsName = ''
  query.isMarketable = undefined
  query.page = 1
  loadData()
}

function openDialog(row) {
  if (row) {
    dialogTitle.value = '编辑商品'
    Object.assign(form, emptyForm, row)
  } else {
    dialogTitle.value = '新增商品'
    Object.assign(form, emptyForm)
  }
  dialogVisible.value = true
}

function resetForm() {
  formRef.value?.clearValidate()
  Object.assign(form, emptyForm)
}

async function handleSave() {
  await formRef.value.validate()
  saving.value = true
  try {
    if (form.id) {
      await updateGoods(form)
      ElMessage.success('修改成功')
    } else {
      await addGoods(form)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    loadData()
  } catch (e) {
    // 拦截器已提示
  } finally {
    saving.value = false
  }
}

async function handlePutAway(row) {
  const action = row.isMarketable ? '下架' : '上架'
  try {
    await ElMessageBox.confirm(`确定要${action}商品「${row.goodsName}」吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch (e) {
    return
  }
  try {
    await putAwayGoods(row.id, !row.isMarketable)
    ElMessage.success(`${action}成功`)
    loadData()
  } catch (e) {
    // 拦截器已提示
  }
}

onMounted(loadData)
</script>

<style scoped>
.price {
  color: #f56c6c;
  font-weight: 600;
}
</style>