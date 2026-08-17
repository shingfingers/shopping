<template>
  <div class="page-container">
    <div class="page-card">
      <div class="table-toolbar">
        <span class="toolbar-title">秒杀商品</span>
        <el-button type="success" :icon="Plus" @click="openDialog()">新增秒杀商品</el-button>
      </div>

      <el-table :data="list" v-loading="loading" border stripe>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="goodsId" label="商品ID" width="90" />
        <el-table-column prop="title" label="标题" min-width="160" show-overflow-tooltip />
        <el-table-column label="原价" width="100">
          <template #default="{ row }">¥{{ row.price }}</template>
        </el-table-column>
        <el-table-column label="秒杀价" width="100">
          <template #default="{ row }">
            <span class="price">¥{{ row.costPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="165" />
        <el-table-column prop="endTime" label="结束时间" width="165" />
        <el-table-column label="库存" width="110" align="center">
          <template #default="{ row }">{{ row.stockCount }} / {{ row.num }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button size="small" :icon="Edit" @click="openDialog(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="query.page"
          v-model:page-size="query.size"
          :page-sizes="[10, 20, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px" @closed="resetForm">
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="90px">
        <el-form-item label="商品ID" prop="goodsId">
          <el-input-number v-model="form.goodsId" :min="1" :step="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="商品描述" prop="introduction">
          <el-input v-model="form.introduction" type="textarea" :rows="2" placeholder="请输入商品描述" />
        </el-form-item>
        <el-form-item label="原价" prop="price">
          <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="秒杀价" prop="costPrice">
          <el-input-number v-model="form.costPrice" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="选择结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="秒杀数量" prop="num">
          <el-input-number v-model="form.num" :min="1" :step="1" style="width: 100%" />
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
import { ElMessage } from 'element-plus'
import { Plus, Edit } from '@element-plus/icons-vue'
import { findSeckillPage, addSeckillGoods, updateSeckillGoods } from '@/api/seckill'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({ page: 1, size: 10 })

const dialogVisible = ref(false)
const saving = ref(false)
const formRef = ref()
const dialogTitle = ref('新增秒杀商品')
const emptyForm = {
  id: null, goodsId: null, title: '', introduction: '',
  price: 0, costPrice: 0, startTime: '', endTime: '', num: 1,
}
const form = reactive({ ...emptyForm })

const formRules = {
  goodsId: [{ required: true, message: '请输入商品ID', trigger: 'blur' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
}

async function loadData() {
  loading.value = true
  try {
    const res = await findSeckillPage({ page: query.page, size: query.size })
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

function openDialog(row) {
  if (row) {
    dialogTitle.value = '编辑秒杀商品'
    Object.assign(form, emptyForm, row)
  } else {
    dialogTitle.value = '新增秒杀商品'
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
      await updateSeckillGoods(form)
      ElMessage.success('修改成功')
    } else {
      await addSeckillGoods(form)
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

onMounted(loadData)
</script>

<style scoped>
.price {
  color: #f56c6c;
  font-weight: 600;
}
</style>