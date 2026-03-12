<template>
  <div class="workorder-assign">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>工单分配</span>
          <el-button type="primary" size="small" @click="$router.back()">返回</el-button>
        </div>
      </template>

      <el-table :data="pendingWorkOrders" stripe border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="工单编号" width="150" />
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
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="completionDeadline" label="完成时限" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleAssign(row)">分配</el-button>
            <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="batch-actions" v-if="selectedWorkOrders.length > 0">
        <el-button type="primary" @click="handleBatchAssign">批量分配</el-button>
        <el-button @click="handleBatchReject">批量拒绝</el-button>
      </div>
    </el-card>

    <el-dialog v-model="assignDialogVisible" title="分配工单" width="600px">
      <el-form :model="assignForm" label-width="120px">
        <el-form-item label="工单编号">
          <el-input v-model="assignForm.id" disabled />
        </el-form-item>
        <el-form-item label="工单标题">
          <el-input v-model="assignForm.title" disabled />
        </el-form-item>
        <el-form-item label="责任单位">
          <el-select v-model="assignForm.responsibilityUnit" placeholder="请选择责任单位">
            <el-option label="城区供电所" value="城区供电所" />
            <el-option label="城郊供电所" value="城郊供电所" />
            <el-option label="客户服务中心" value="客户服务中心" />
            <el-option label="检修班" value="检修班" />
            <el-option label="网格一" value="网格一" />
          </el-select>
        </el-form-item>
        <el-form-item label="责任人">
          <el-select v-model="assignForm.responsiblePerson" placeholder="请选择责任人">
            <el-option label="张三" value="张三" />
            <el-option label="王五" value="王五" />
            <el-option label="孙七" value="孙七" />
            <el-option label="吴九" value="吴九" />
            <el-option label="钱十一" value="钱十一" />
          </el-select>
        </el-form-item>
        <el-form-item label="分配说明">
          <el-input v-model="assignForm.assignRemark" type="textarea" :rows="3" placeholder="请输入分配说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmAssign">确认分配</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailDialogVisible" title="工单详情" width="800px">
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
        <el-descriptions-item label="创建时间">{{ currentWorkOrder.createTime }}</el-descriptions-item>
        <el-descriptions-item label="完成时限" :span="2">{{ currentWorkOrder.completionDeadline }}</el-descriptions-item>
      </el-descriptions>
      <el-divider>任务描述</el-divider>
      <div class="description-content">{{ currentWorkOrder.description }}</div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { workOrders } from '@/data/workOrders'

const pendingWorkOrders = computed(() => workOrders.filter(item => item.status === '待接收'))

const selectedWorkOrders = ref<any[]>([])
const assignDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const currentWorkOrder = ref<any>({})

const assignForm = ref({
  id: '',
  title: '',
  responsibilityUnit: '',
  responsiblePerson: '',
  assignRemark: ''
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

const handleSelectionChange = (selection: any[]) => {
  selectedWorkOrders.value = selection
}

const handleAssign = (row: any) => {
  assignForm.value = {
    id: row.id,
    title: row.title,
    responsibilityUnit: row.responsibilityUnit,
    responsiblePerson: row.responsiblePerson,
    assignRemark: ''
  }
  assignDialogVisible.value = true
}

const handleConfirmAssign = () => {
  ElMessage.success('分配成功')
  assignDialogVisible.value = false
}

const handleBatchAssign = () => {
  ElMessage.success(`已批量分配 ${selectedWorkOrders.value.length} 个工单`)
}

const handleBatchReject = () => {
  ElMessage.success(`已批量拒绝 ${selectedWorkOrders.value.length} 个工单`)
}

const handleView = (row: any) => {
  currentWorkOrder.value = row
  detailDialogVisible.value = true
}
</script>

<style scoped>
.workorder-assign {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.batch-actions {
  margin-top: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.description-content {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  line-height: 1.8;
  white-space: pre-wrap;
}
</style>
