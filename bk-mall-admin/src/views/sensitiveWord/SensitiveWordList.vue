<template>
  <div class="page-container">
    <div class="page-card">
      <div class="search-bar">
        <el-input
          v-model="query.word"
          placeholder="敏感词"
          clearable
          style="width: 200px"
          @keyup.enter="handleSearch"
        />
        <el-select v-model="query.type" placeholder="类型" clearable style="width: 140px">
          <el-option label="禁止词" value="deny" />
          <el-option label="允许词" value="allow" />
        </el-select>
        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        <div style="flex: 1"></div>
        <el-button type="success" :icon="Plus" @click="openDialog()">新增敏感词</el-button>
      </div>

      <el-table :data="list" v-loading="loading" border stripe>
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="word" label="敏感词" min-width="200" />
        <el-table-column label="类型" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.type === 'deny' ? 'danger' : 'success'">
              {{ row.type === 'deny' ? '禁止词' : '允许词' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="danger" :icon="Delete" @click="handleDelete(row)">删除</el-button>
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

    <el-dialog v-model="dialogVisible" title="新增敏感词" width="440px" @closed="resetForm">
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="80px">
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio value="deny">禁止词</el-radio>
            <el-radio value="allow">允许词</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="敏感词" prop="word">
          <el-input v-model="form.word" placeholder="请输入敏感词" />
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
import { Search, Refresh, Plus, Delete } from '@element-plus/icons-vue'
import { searchSensitiveWords, addSensitiveWord, deleteSensitiveWord } from '@/api/sensitiveWord'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({ page: 1, size: 10, word: '', type: '' })

const dialogVisible = ref(false)
const saving = ref(false)
const formRef = ref()
const emptyForm = { word: '', type: 'deny' }
const form = reactive({ ...emptyForm })

const formRules = {
  word: [{ required: true, message: '请输入敏感词', trigger: 'blur' }],
}

async function loadData() {
  loading.value = true
  try {
    const params = { page: query.page, size: query.size }
    if (query.word) params.word = query.word
    if (query.type) params.type = query.type
    const res = await searchSensitiveWords(params)
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
  query.word = ''
  query.type = ''
  query.page = 1
  loadData()
}

function openDialog() {
  Object.assign(form, emptyForm)
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
    await addSensitiveWord(form)
    ElMessage.success('新增成功')
    dialogVisible.value = false
    loadData()
  } catch (e) {
    // 拦截器已提示
  } finally {
    saving.value = false
  }
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确定要删除敏感词「${row.word}」吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch (e) {
    return
  }
  try {
    await deleteSensitiveWord(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (e) {
    // 拦截器已提示
  }
}

onMounted(loadData)
</script>