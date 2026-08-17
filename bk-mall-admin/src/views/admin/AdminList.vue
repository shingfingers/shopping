<template>
  <div class="page-container">
    <div class="page-card">
      <div class="table-toolbar">
        <span class="toolbar-title">管理员账号</span>
        <el-button type="success" :icon="Plus" @click="openDialog()">新增管理员</el-button>
      </div>

      <el-table :data="list" v-loading="loading" border stripe>
        <el-table-column prop="aid" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" min-width="160" />
        <el-table-column label="角色" min-width="200">
          <template #default="{ row }">
            <el-tag v-for="role in row.roles" :key="role.rid" size="small" class="role-tag">
              {{ role.roleName }}
            </el-tag>
            <span v-if="!row.roles || row.roles.length === 0" class="no-role">无角色</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template #default="{ row }">
            <el-button size="small" :icon="Edit" @click="openDialog(row)">编辑</el-button>
            <el-button size="small" :icon="Setting" @click="openRoleDialog(row)">分配角色</el-button>
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

    <!-- 新增/编辑管理员 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="440px" @closed="resetForm">
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" :disabled="!!form.aid" />
        </el-form-item>
        <el-form-item label="密码" :prop="form.aid ? '' : 'password'">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            :placeholder="form.aid ? '留空则不修改密码' : '请输入密码'"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog v-model="roleDialogVisible" title="分配角色" width="440px">
      <el-checkbox-group v-model="selectedRids">
        <el-checkbox v-for="role in roles" :key="role.rid" :value="role.rid" class="role-checkbox">
          {{ role.roleName }}
        </el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="roleSaving" @click="handleSaveRole">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Setting } from '@element-plus/icons-vue'
import { searchAdmins, addAdmin, updateAdmin, deleteAdmin, updateAdminRole } from '@/api/admin'
import { findAllRoles } from '@/api/role'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({ page: 1, size: 10 })

const dialogVisible = ref(false)
const saving = ref(false)
const formRef = ref()
const dialogTitle = ref('新增管理员')
const emptyForm = { aid: null, username: '', password: '' }
const form = reactive({ ...emptyForm })

const formRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const roleDialogVisible = ref(false)
const roleSaving = ref(false)
const roles = ref([])
const selectedRids = ref([])
const currentAdminId = ref(null)

async function loadData() {
  loading.value = true
  try {
    const res = await searchAdmins({ page: query.page, size: query.size })
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
    dialogTitle.value = '编辑管理员'
    Object.assign(form, emptyForm, { aid: row.aid, username: row.username, password: '' })
  } else {
    dialogTitle.value = '新增管理员'
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
    if (form.aid) {
      await updateAdmin({ aid: form.aid, username: form.username, password: form.password })
      ElMessage.success('修改成功')
    } else {
      await addAdmin(form)
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
    await ElMessageBox.confirm(`确定要删除管理员「${row.username}」吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch (e) {
    return
  }
  try {
    await deleteAdmin(row.aid)
    ElMessage.success('删除成功')
    loadData()
  } catch (e) {
    // 拦截器已提示
  }
}

async function openRoleDialog(row) {
  currentAdminId.value = row.aid
  selectedRids.value = (row.roles || []).map((r) => r.rid)
  if (roles.value.length === 0) {
    try {
      const res = await findAllRoles()
      if (res && res.data) {
        roles.value = res.data || []
      }
    } catch (e) {
      // 拦截器已提示
    }
  }
  roleDialogVisible.value = true
}

async function handleSaveRole() {
  roleSaving.value = true
  try {
    await updateAdminRole(currentAdminId.value, selectedRids.value)
    ElMessage.success('角色分配成功')
    roleDialogVisible.value = false
    loadData()
  } catch (e) {
    // 拦截器已提示
  } finally {
    roleSaving.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.role-tag {
  margin-right: 6px;
}
.no-role {
  color: #c0c4cc;
  font-size: 13px;
}
.role-checkbox {
  display: block;
  margin-left: 0;
  margin-bottom: 10px;
}
</style>