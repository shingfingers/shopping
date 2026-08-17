<template>
  <div class="page-container">
    <div class="page-card">
      <div class="table-toolbar">
        <span class="toolbar-title">商品分类（最多三级）</span>
        <el-button type="success" :icon="Plus" @click="openDialog()">新增一级分类</el-button>
      </div>

      <el-table
        :data="treeData"
        v-loading="loading"
        border
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="name" label="分类名称" min-width="240" />
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="level" label="级别" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="levelTagType(row.level)">第{{ row.level }}级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.level < 3"
              size="small"
              type="primary"
              :icon="Plus"
              @click="openDialog(null, row)"
            >
              新增子级
            </el-button>
            <el-button size="small" :icon="Edit" @click="openDialog(row)">编辑</el-button>
            <el-button size="small" type="danger" :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="440px" @closed="resetForm">
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="90px">
        <el-form-item label="上级分类" prop="parentId">
          <el-input :model-value="parentName" :disabled="true" placeholder="无（一级分类）" />
        </el-form-item>
        <el-form-item :label="`第${form.level}级名称`" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
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
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { searchProductTypes, addProductType, updateProductType, deleteProductType } from '@/api/productType'

const loading = ref(false)
const treeData = ref([])

const dialogVisible = ref(false)
const saving = ref(false)
const formRef = ref()
const dialogTitle = ref('新增分类')
const parentName = ref('')
const emptyForm = { id: null, name: '', level: 1, parentId: 0 }
const form = reactive({ ...emptyForm })

const formRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
}

function levelTagType(level) {
  return level === 1 ? 'success' : level === 2 ? 'warning' : 'info'
}

// 将扁平列表转为树形结构
function buildTree(items) {
  const map = {}
  items.forEach((item) => {
    map[item.id] = { ...item, children: [] }
  })
  const roots = []
  items.forEach((item) => {
    const node = map[item.id]
    if (item.parentId && item.parentId !== 0 && map[item.parentId]) {
      map[item.parentId].children.push(node)
    } else {
      roots.push(node)
    }
  })
  return roots
}

async function loadData() {
  loading.value = true
  try {
    // 取足够大的分页，一次拉全量用于构建树
    const res = await searchProductTypes({ page: 1, size: 1000 })
    if (res && res.data) {
      treeData.value = buildTree(res.data.records || [])
    }
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

function openDialog(row, parent) {
  if (row) {
    dialogTitle.value = '编辑分类'
    Object.assign(form, emptyForm, row)
    parentName.value = row.level === 1 ? '无（一级分类）' : `父级ID: ${row.parentId}`
  } else if (parent) {
    dialogTitle.value = `新增第${parent.level + 1}级分类`
    Object.assign(form, emptyForm, { level: parent.level + 1, parentId: parent.id })
    parentName.value = parent.name
  } else {
    dialogTitle.value = '新增一级分类'
    Object.assign(form, emptyForm, { level: 1, parentId: 0 })
    parentName.value = '无（一级分类）'
  }
  dialogVisible.value = true
}

function resetForm() {
  formRef.value?.clearValidate()
  Object.assign(form, emptyForm)
  parentName.value = ''
}

async function handleSave() {
  await formRef.value.validate()
  saving.value = true
  try {
    if (form.id) {
      await updateProductType(form)
      ElMessage.success('修改成功')
    } else {
      await addProductType(form)
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

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类「${row.name}」吗？其下所有子分类将无法通过该分类查询。`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
  } catch (e) {
    return
  }
  try {
    await deleteProductType(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (e) {
    // 拦截器已提示
  }
}

onMounted(loadData)
</script>