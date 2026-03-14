<template>
  <div class="workorder-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>工单列表</span>
          <el-button type="primary" size="small" @click="$router.push('/workorder/create')">创建工单</el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="工单编号">
          <el-input v-model="searchForm.id" placeholder="请输入工单编号" clearable />
        </el-form-item>
        <el-form-item label="工单标题">
          <el-input v-model="searchForm.title" placeholder="请输入工单标题" clearable />
        </el-form-item>
        <el-form-item label="所属部门">
          <el-select v-model="searchForm.department" placeholder="请选择部门" clearable>
            <el-option label="全部" value="" />
            <el-option label="安监部" value="安监部" />
            <el-option label="营销部" value="营销部" />
            <el-option label="配电部" value="配电部" />
            <el-option label="供指中心" value="供指中心" />
            <el-option label="运检部" value="运检部" />
          </el-select>
        </el-form-item>
        <el-form-item label="工单类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="全部" value="" />
            <el-option label="安监类" value="安监类" />
            <el-option label="营销类" value="营销类" />
            <el-option label="配电类" value="配电类" />
            <el-option label="供指类" value="供指类" />
            <el-option label="运检类" value="运检类" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="searchForm.priority" placeholder="请选择优先级" clearable>
            <el-option label="全部" value="" />
            <el-option label="一般" value="yellow" />
            <el-option label="严重" value="red" />
            <el-option label="特别严重" value="orange" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="全部" value="" />
            <el-option label="待接收" value="待接收" />
            <el-option label="执行中" value="执行中" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已验收" value="已验收" />
            <el-option label="已闭环" value="已闭环" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="filteredWorkOrders" stripe border>
        <el-table-column prop="id" label="工单编号" width="150" fixed="left" />
        <el-table-column prop="title" label="工单标题" width="250" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column label="优先级" width="100">
          <template #default="{ row }">
            <el-tag :type="getPriorityType(row.priority)" size="small">
              {{ getPriorityText(row.priority) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="部门" width="100" />
        <el-table-column prop="responsibilityUnit" label="责任单位" width="120" />
        <el-table-column prop="responsiblePerson" label="责任人" width="100" />
        <el-table-column label="进度" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" :color="getProgressColor(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="completionDeadline" label="完成时限" width="180" />
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
            <el-button type="primary" link size="small" @click="handleAssign(row)" v-if="row.status === '待接收'">分配</el-button>
            <el-button type="primary" link size="small" @click="handleExecute(row)" v-if="row.status === '执行中'">执行</el-button>
            <el-button type="primary" link size="small" @click="handleCheck(row)" v-if="row.status === '已完成'">核查</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        class="mt-20"
      />
    </el-card>

    <el-dialog v-model="detailDialogVisible" title="工单详情" width="1000px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="工单编号">{{ currentWorkOrder.id }}</el-descriptions-item>
        <el-descriptions-item label="工单标题">{{ currentWorkOrder.title }}</el-descriptions-item>
        <el-descriptions-item label="工单类型">{{ currentWorkOrder.type }}</el-descriptions-item>
        <el-descriptions-item label="优先级">
          <el-tag :type="getPriorityType(currentWorkOrder.priority)" size="small">
            {{ getPriorityText(currentWorkOrder.priority) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="所属部门">{{ currentWorkOrder.department }}</el-descriptions-item>
        <el-descriptions-item label="责任单位">{{ currentWorkOrder.responsibilityUnit }}</el-descriptions-item>
        <el-descriptions-item label="责任人">{{ currentWorkOrder.responsiblePerson }}</el-descriptions-item>
        <el-descriptions-item label="督办人">{{ currentWorkOrder.supervisor }}</el-descriptions-item>
        <el-descriptions-item label="督办部门">{{ currentWorkOrder.supervisorDepartment }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentWorkOrder.status)" size="small">{{ currentWorkOrder.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="进度">
          <el-progress :percentage="currentWorkOrder.progress" />
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentWorkOrder.createTime }}</el-descriptions-item>
        <el-descriptions-item label="完成时限">{{ currentWorkOrder.completionDeadline }}</el-descriptions-item>
      </el-descriptions>

      <el-divider>任务描述</el-divider>
      <div class="description-content">{{ currentWorkOrder.description }}</div>

      <el-divider>执行标准</el-divider>
      <div class="description-content">{{ currentWorkOrder.executionStandard }}</div>

      <el-divider>验收标准</el-divider>
      <div class="description-content">{{ currentWorkOrder.acceptanceStandard }}</div>

      <el-divider v-if="currentWorkOrder.materials && currentWorkOrder.materials.length > 0">佐证材料</el-divider>
      <el-table v-if="currentWorkOrder.materials && currentWorkOrder.materials.length > 0" :data="currentWorkOrder.materials" stripe border>
        <el-table-column prop="name" label="材料名称" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            {{ getMaterialTypeText(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="uploader" label="上传人" width="120" />
        <el-table-column prop="uploadTime" label="上传时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'approved' ? 'success' : row.status === 'rejected' ? 'danger' : 'warning'" size="small">
              {{ row.status === 'approved' ? '已通过' : row.status === 'rejected' ? '已拒绝' : '待审核' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { workOrders } from '@/data/workOrders'

const route = useRoute()

const searchForm = ref({
  id: '',
  title: '',
  type: '',
  priority: '',
  status: '',
  department: ''
})

onMounted(() => {
  if (route.query.department) {
    searchForm.value.department = route.query.department as string
  }
  if (route.query.status) {
    const status = route.query.status as string
    if (status === 'completed') {
      searchForm.value.status = '已闭环'
    } else if (status === 'overdue') {
      searchForm.value.status = '执行中'
    }
  }
  if (route.query.id) {
    searchForm.value.id = route.query.id as string
  }
})

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(workOrders.length)

const detailDialogVisible = ref(false)
const currentWorkOrder = ref<any>({})

const filteredWorkOrders = computed(() => {
  let result = workOrders

  if (searchForm.value.id) {
    result = result.filter(item => item.id.includes(searchForm.value.id))
  }

  if (searchForm.value.title) {
    result = result.filter(item => item.title.includes(searchForm.value.title))
  }

  if (searchForm.value.type) {
    result = result.filter(item => item.type === searchForm.value.type)
  }

  if (searchForm.value.priority) {
    result = result.filter(item => item.priority === searchForm.value.priority)
  }

  if (searchForm.value.status) {
    result = result.filter(item => item.status === searchForm.value.status)
  }

  if (searchForm.value.department) {
    result = result.filter(item => item.department === searchForm.value.department)
  }

  return result
})

const getPriorityType = (priority: string) => {
  const typeMap: Record<string, any> = {
    'yellow': 'warning',
    'red': 'danger',
    'orange': 'danger'
  }
  return typeMap[priority] || 'info'
}

const getPriorityText = (priority: string) => {
  const textMap: Record<string, string> = {
    'yellow': '一般',
    'red': '严重',
    'orange': '特别严重'
  }
  return textMap[priority] || '未知'
}

const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    '待接收': 'warning',
    '执行中': 'primary',
    '已完成': 'success',
    '已验收': 'info',
    '已闭环': 'success'
  }
  return typeMap[status] || 'info'
}

const getProgressColor = (row: any) => {
  if (row.status === '已闭环') return '#67c23a'
  if (row.status === '已验收') return '#409eff'
  if (row.status === '已完成') return '#e6a23c'
  return '#409eff'
}

const getMaterialTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    'photo': '照片',
    'video': '视频',
    'document': '文档',
    'audio': '音频'
  }
  return typeMap[type] || '其他'
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchForm.value = {
    id: '',
    title: '',
    type: '',
    priority: '',
    status: '',
    department: ''
  }
}

const handleView = (row: any) => {
  currentWorkOrder.value = row
  detailDialogVisible.value = true
}

const handleAssign = (row: any) => {
  console.log('分配工单', row.id)
}

const handleExecute = (row: any) => {
  console.log('执行工单', row.id)
}

const handleCheck = (row: any) => {
  console.log('核查工单', row.id)
}
</script>

<style scoped>
.workorder-list {
  padding: 0;
}

.search-form {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mt-20 {
  margin-top: 20px;
}

.description-content {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  line-height: 1.8;
  white-space: pre-wrap;
}
</style>
