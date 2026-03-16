<template>
  <div class="workorder-track">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>进度跟踪</span>
        </div>
      </template>

      <el-row :gutter="20" class="status-cards">
        <el-col :span="8">
          <el-card shadow="hover" class="status-card">
            <div class="status-content">
              <div class="status-icon primary">
                <el-icon><Loading /></el-icon>
              </div>
              <div class="status-info">
                <div class="status-label">督办中</div>
                <div class="status-value">{{ inProgressCount }} 个</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="status-card">
            <div class="status-content">
              <div class="status-icon warning">
                <el-icon><Clock /></el-icon>
              </div>
              <div class="status-info">
                <div class="status-label">临期预警</div>
                <div class="status-value">{{ warningCount }} 个</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="status-card">
            <div class="status-content">
              <div class="status-icon danger">
                <el-icon><WarningFilled /></el-icon>
              </div>
              <div class="status-info">
                <div class="status-label">已超期</div>
                <div class="status-value">{{ overdueCount }} 个</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-form :inline="true" class="filter-form">
        <el-form-item label="状态">
          <el-select v-model="filterStatus" placeholder="全部状态" clearable>
            <el-option label="督办中" value="督办中" />
            <el-option label="临期预警" value="临期预警" />
            <el-option label="已超期" value="已超期" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="filterType" placeholder="全部类型" clearable>
            <el-option label="安监类" value="安监类" />
            <el-option label="营销类" value="营销类" />
            <el-option label="配电类" value="配电类" />
            <el-option label="运检类" value="运检类" />
            <el-option label="供指类" value="供指类" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="filterDepartment" placeholder="全部部门" clearable>
            <el-option label="安监部" value="安监部" />
            <el-option label="营销部" value="营销部" />
            <el-option label="配电部" value="配电部" />
            <el-option label="运检部" value="运检部" />
            <el-option label="供指中心" value="供指中心" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="filteredWorkOrders" stripe style="width: 100%" @row-click="handleRowClick">
        <el-table-column prop="id" label="督办编号" width="140" />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="进度" width="180">
          <template #default="{ row }">
            <div class="progress-cell">
              <el-progress :percentage="row.progress" :status="getProgressStatus(row)" :stroke-width="10" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row)">{{ getStatusText(row) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="supervisionPerson" label="责任人" width="100" />
        <el-table-column prop="deadline" label="时限" width="120">
          <template #default="{ row }">
            <span :class="{ 'deadline-warning': isWarning(row), 'deadline-overdue': isOverdue(row) }">
              {{ getDeadlineText(row) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click.stop="showDetail(row)">详情</el-button>
            <el-button type="success" link size="small" @click.stop="feedbackProgress(row)">反馈</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
      />
    </el-card>

    <el-dialog v-model="detailVisible" title="进度详情" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="督办编号">{{ currentWorkOrder.id }}</el-descriptions-item>
        <el-descriptions-item label="原工单编号">{{ currentWorkOrder.originalId }}</el-descriptions-item>
        <el-descriptions-item label="标题" :span="2">{{ currentWorkOrder.title }}</el-descriptions-item>
        <el-descriptions-item label="督办级别">{{ currentWorkOrder.supervisionLevel }}</el-descriptions-item>
        <el-descriptions-item label="当前状态">{{ currentWorkOrder.status }}</el-descriptions-item>
        <el-descriptions-item label="当前进度">{{ currentWorkOrder.progress }}%</el-descriptions-item>
        <el-descriptions-item label="进度同步时间">{{ currentWorkOrder.progressSyncTime }}</el-descriptions-item>
        <el-descriptions-item label="责任人">{{ currentWorkOrder.supervisionPerson }}</el-descriptions-item>
        <el-descriptions-item label="责任单位">{{ currentWorkOrder.supervisionUnit }}</el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">进度反馈记录</el-divider>
      <el-timeline>
        <el-timeline-item
          v-for="(record, index) in progressRecords"
          :key="index"
          :timestamp="record.time"
          placement="top"
        >
          <el-card>
            <h4>{{ record.action }}</h4>
            <p>{{ record.content }}</p>
            <p v-if="record.operator">操作人：{{ record.operator }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>

    <el-dialog v-model="feedbackVisible" title="进度反馈" width="600px">
      <el-form :model="feedbackForm" label-width="100px">
        <el-form-item label="当前进度">
          <el-slider v-model="feedbackForm.progress" :marks="{ 0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }" />
        </el-form-item>
        <el-form-item label="进度描述">
          <el-input v-model="feedbackForm.description" type="textarea" :rows="3" placeholder="请描述当前督办进展" />
        </el-form-item>
        <el-form-item label="存在问题">
          <el-input v-model="feedbackForm.problem" type="textarea" :rows="2" placeholder="如有问题请填写" />
        </el-form-item>
        <el-form-item label="上传材料">
          <el-upload
            class="upload-demo"
            drag
            action="#"
            :auto-upload="false"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              拖拽文件到此处或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">支持照片、视频、文档等格式</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="feedbackVisible = false">取消</el-button>
        <el-button type="primary" @click="submitFeedback">提交反馈</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading, Clock, WarningFilled, UploadFilled } from '@element-plus/icons-vue'

interface WorkOrder {
  id: string
  originalId: string
  title: string
  type: string
  progress: number
  status: string
  supervisionLevel: string
  supervisionPerson: string
  supervisionUnit: string
  deadline: string
  progressSyncTime: string
}

const inProgressCount = ref(12)
const warningCount = ref(3)
const overdueCount = ref(1)

const filterStatus = ref('')
const filterType = ref('')
const filterDepartment = ref('')

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(16)

const workOrders = ref<WorkOrder[]>([
  {
    id: 'GD202603160001',
    originalId: 'WO202603120001',
    title: '10kV龙口线树障清理督办',
    type: '配电类',
    progress: 60,
    status: '督办中',
    supervisionLevel: '重点督办',
    supervisionPerson: '王五',
    supervisionUnit: '城郊供电所',
    deadline: '2026-03-18',
    progressSyncTime: '2026-03-16 10:30:00'
  },
  {
    id: 'GD202603160002',
    originalId: 'WO202603120002',
    title: '客户联系方式异常清理督办',
    type: '营销类',
    progress: 30,
    status: '督办中',
    supervisionLevel: '一般督办',
    supervisionPerson: '李四',
    supervisionUnit: '营销部',
    deadline: '2026-03-17',
    progressSyncTime: '2026-03-16 09:00:00'
  },
  {
    id: 'GD202603160003',
    originalId: 'WO202603120003',
    title: '重点隐患整改督办',
    type: '安监类',
    progress: 80,
    status: '督办中',
    supervisionLevel: '专项督办',
    supervisionPerson: '张三',
    supervisionUnit: '安监部',
    deadline: '2026-03-16',
    progressSyncTime: '2026-03-16 11:00:00'
  },
  {
    id: 'GD202603160004',
    originalId: 'WO202603120004',
    title: '配电运维巡视消缺督办',
    type: '配电类',
    progress: 45,
    status: '督办中',
    supervisionLevel: '一般督办',
    supervisionPerson: '赵六',
    supervisionUnit: '配电部',
    deadline: '2026-03-15',
    progressSyncTime: '2026-03-15 16:00:00'
  }
])

const filteredWorkOrders = computed(() => {
  let result = workOrders.value
  if (filterStatus.value) {
    result = result.filter(item => getStatusText(item) === filterStatus.value)
  }
  if (filterType.value) {
    result = result.filter(item => item.type === filterType.value)
  }
  return result
})

const detailVisible = ref(false)
const feedbackVisible = ref(false)
const currentWorkOrder = ref<WorkOrder>({
  id: '',
  originalId: '',
  title: '',
  type: '',
  progress: 0,
  status: '',
  supervisionLevel: '',
  supervisionPerson: '',
  supervisionUnit: '',
  deadline: '',
  progressSyncTime: ''
})

const progressRecords = ref([
  { time: '2026-03-16 10:00', action: '进度更新', content: '已完成现场勘察，正在制定清理方案', operator: '王五' },
  { time: '2026-03-15 15:00', action: '进度更新', content: '已到达现场，开始勘察', operator: '王五' },
  { time: '2026-03-15 09:00', action: '任务接收', content: '已接收督办任务', operator: '王五' }
])

const feedbackForm = ref({
  progress: 60,
  description: '',
  problem: ''
})

const getTypeTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    '安监类': 'danger',
    '营销类': 'warning',
    '配电类': 'primary',
    '运检类': 'success',
    '供指类': 'info'
  }
  return typeMap[type] || ''
}

const getProgressStatus = (row: WorkOrder) => {
  if (isOverdue(row)) return 'exception'
  if (isWarning(row)) return 'warning'
  if (row.progress === 100) return 'success'
  return ''
}

const getStatusTagType = (row: WorkOrder) => {
  if (isOverdue(row)) return 'danger'
  if (isWarning(row)) return 'warning'
  return 'primary'
}

const getStatusText = (row: WorkOrder) => {
  if (isOverdue(row)) return '已超期'
  if (isWarning(row)) return '临期预警'
  return row.status
}

const isWarning = (row: WorkOrder) => {
  const deadline = new Date(row.deadline)
  const now = new Date()
  const diff = deadline.getTime() - now.getTime()
  const days = diff / (1000 * 60 * 60 * 24)
  return days > 0 && days <= 1
}

const isOverdue = (row: WorkOrder) => {
  const deadline = new Date(row.deadline)
  const now = new Date()
  return deadline.getTime() < now.getTime()
}

const getDeadlineText = (row: WorkOrder) => {
  const deadline = new Date(row.deadline)
  const now = new Date()
  const diff = deadline.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days < 0) return `超期${Math.abs(days)}天`
  if (days === 0) return '今日到期'
  return `剩余${days}天`
}

const handleFilter = () => {
  ElMessage.success('筛选条件已更新')
}

const resetFilter = () => {
  filterStatus.value = ''
  filterType.value = ''
  filterDepartment.value = ''
}

const handleRowClick = (row: WorkOrder) => {
  showDetail(row)
}

const showDetail = (row: WorkOrder) => {
  currentWorkOrder.value = { ...row }
  detailVisible.value = true
}

const feedbackProgress = (row: WorkOrder) => {
  currentWorkOrder.value = { ...row }
  feedbackForm.value.progress = row.progress
  feedbackVisible.value = true
}

const submitFeedback = () => {
  ElMessage.success('进度反馈已提交')
  feedbackVisible.value = false
}
</script>

<style scoped>
.workorder-track {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-cards {
  margin-bottom: 20px;
}

.status-card {
  height: 100px;
}

.status-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.status-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.status-icon .el-icon {
  font-size: 28px;
  color: #fff;
}

.status-icon.primary {
  background: linear-gradient(135deg, #409eff, #66b1ff);
}

.status-icon.warning {
  background: linear-gradient(135deg, #e6a23c, #ebb563);
}

.status-icon.danger {
  background: linear-gradient(135deg, #f56c6c, #f78989);
}

.status-info {
  flex: 1;
}

.status-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.status-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.filter-form {
  margin-bottom: 20px;
}

.progress-cell {
  padding: 0 10px;
}

.deadline-warning {
  color: #e6a23c;
  font-weight: bold;
}

.deadline-overdue {
  color: #f56c6c;
  font-weight: bold;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.upload-demo {
  width: 100%;
}
</style>
