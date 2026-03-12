<template>
  <div class="department-workorder">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>工单跟踪</span>
              <el-select v-model="selectedDepartment" placeholder="请选择部门" style="width: 200px">
                <el-option label="安监部" value="安监部" />
                <el-option label="营销部" value="营销部" />
                <el-option label="配电部" value="配电部" />
                <el-option label="供指中心" value="供指中心" />
                <el-option label="运检部" value="运检部" />
              </el-select>
            </div>
          </template>

          <el-row :gutter="20" class="mb-20">
            <el-col :span="6">
              <div class="status-card pending">
                <div class="status-icon">⏳</div>
                <div class="status-value">{{ pendingCount }}</div>
                <div class="status-label">待接收</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="status-card executing">
                <div class="status-icon">🔄</div>
                <div class="status-value">{{ executingCount }}</div>
                <div class="status-label">执行中</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="status-card completed">
                <div class="status-icon">✅</div>
                <div class="status-value">{{ completedCount }}</div>
                <div class="status-label">已完成</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="status-card closed">
                <div class="status-icon">🎯</div>
                <div class="status-value">{{ closedCount }}</div>
                <div class="status-label">已闭环</div>
              </div>
            </el-col>
          </el-row>

          <el-tabs v-model="activeTab">
            <el-tab-pane label="全部工单" name="all">
              <el-table :data="departmentWorkOrders" stripe border>
                <el-table-column prop="id" label="工单编号" width="150" />
                <el-table-column prop="title" label="工单标题" width="250" />
                <el-table-column label="优先级" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getPriorityType(row.priority)" size="small">
                      {{ getPriorityText(row.priority) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="responsiblePerson" label="责任人" width="100" />
                <el-table-column label="进度" width="150">
                  <template #default="{ row }">
                    <el-progress :percentage="row.progress" />
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getStatusType(row.status)" size="small">{{ row.status }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column prop="completionDeadline" label="完成时限" width="180" />
                <el-table-column label="操作" width="150">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
                    <el-button type="primary" link size="small" @click="handleTrack(row)">跟踪</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="待接收" name="pending">
              <el-table :data="pendingWorkOrders" stripe border>
                <el-table-column prop="id" label="工单编号" width="150" />
                <el-table-column prop="title" label="工单标题" width="250" />
                <el-table-column label="优先级" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getPriorityType(row.priority)" size="small">
                      {{ getPriorityText(row.priority) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column prop="completionDeadline" label="完成时限" width="180" />
                <el-table-column label="操作" width="150">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
                    <el-button type="primary" link size="small" @click="handleReceive(row)">接收</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="执行中" name="executing">
              <el-table :data="executingWorkOrders" stripe border>
                <el-table-column prop="id" label="工单编号" width="150" />
                <el-table-column prop="title" label="工单标题" width="250" />
                <el-table-column prop="responsiblePerson" label="责任人" width="100" />
                <el-table-column label="进度" width="150">
                  <template #default="{ row }">
                    <el-progress :percentage="row.progress" />
                  </template>
                </el-table-column>
                <el-table-column prop="receiveTime" label="接收时间" width="180" />
                <el-table-column prop="completionDeadline" label="完成时限" width="180" />
                <el-table-column label="操作" width="150">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
                    <el-button type="primary" link size="small" @click="handleTrack(row)">跟踪</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="已闭环" name="closed">
              <el-table :data="closedWorkOrders" stripe border>
                <el-table-column prop="id" label="工单编号" width="150" />
                <el-table-column prop="title" label="工单标题" width="250" />
                <el-table-column prop="responsiblePerson" label="责任人" width="100" />
                <el-table-column prop="completeTime" label="完成时间" width="180" />
                <el-table-column prop="closeTime" label="闭环时间" width="180" />
                <el-table-column label="操作" width="150">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
                    <el-button type="primary" link size="small" @click="handleTrack(row)">跟踪</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="trackDialogVisible" title="工单跟踪" width="1000px">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in trackData"
          :key="index"
          :timestamp="item.time"
          :type="item.type"
          :color="item.color"
        >
          <div class="track-content">
            <div class="track-title">{{ item.title }}</div>
            <div class="track-desc">{{ item.description }}</div>
            <div class="track-user">{{ item.user }}</div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { workOrders } from '@/data/workOrders'

const activeTab = ref('all')
const selectedDepartment = ref('安监部')
const trackDialogVisible = ref(false)

const departmentWorkOrders = computed(() => {
  return workOrders.filter(item => item.department === selectedDepartment.value)
})

const pendingWorkOrders = computed(() => {
  return departmentWorkOrders.value.filter(item => item.status === '待接收')
})

const executingWorkOrders = computed(() => {
  return departmentWorkOrders.value.filter(item => item.status === '执行中')
})

const completedWorkOrders = computed(() => {
  return departmentWorkOrders.value.filter(item => item.status === '已完成')
})

const closedWorkOrders = computed(() => {
  return departmentWorkOrders.value.filter(item => item.status === '已闭环')
})

const pendingCount = computed(() => pendingWorkOrders.value.length)
const executingCount = computed(() => executingWorkOrders.value.length)
const completedCount = computed(() => completedWorkOrders.value.length)
const closedCount = computed(() => closedWorkOrders.value.length)

const trackData = ref([
  {
    title: '工单创建',
    description: '部门领导创建督办工单',
    time: '2026-03-12 09:00:00',
    user: '李四',
    type: 'primary',
    color: '#409eff'
  },
  {
    title: '任务分配',
    description: '系统智能分配给责任单位负责人',
    time: '2026-03-12 09:30:00',
    user: '系统',
    type: 'success',
    color: '#67c23a'
  },
  {
    title: '任务接收',
    description: '责任人确认接收任务',
    time: '2026-03-12 10:30:00',
    user: '张三',
    type: 'success',
    color: '#67c23a'
  },
  {
    title: '进度更新',
    description: '责任人更新执行进度至60%',
    time: '2026-03-12 14:00:00',
    user: '张三',
    type: 'warning',
    color: '#e6a23c'
  }
])

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

const handleView = (_row: any) => {
  console.log('查看工单')
}

const handleTrack = (_row: any) => {
  trackDialogVisible.value = true
}

const handleReceive = (_row: any) => {
  ElMessage.success('工单接收成功')
}
</script>

<style scoped>
.department-workorder {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mb-20 {
  margin-bottom: 20px;
}

.status-card {
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  color: #fff;
}

.status-card.pending {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.status-card.executing {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.status-card.completed {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.status-card.closed {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.status-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.status-value {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 8px;
}

.status-label {
  font-size: 14px;
  opacity: 0.9;
}

.track-content {
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.track-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.track-desc {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.track-user {
  font-size: 12px;
  color: #909399;
}
</style>
