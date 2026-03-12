<template>
  <div class="indicator-monitor">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>实时监测</span>
              <el-button type="primary" size="small" @click="handleRefresh">刷新</el-button>
            </div>
          </template>

          <el-row :gutter="20" class="mb-20">
            <el-col :span="6">
              <div class="monitor-card normal">
                <div class="monitor-icon">✓</div>
                <div class="monitor-value">{{ normalCount }}</div>
                <div class="monitor-label">正常指标</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="monitor-card warning">
                <div class="monitor-icon">!</div>
                <div class="monitor-value">{{ warningCount }}</div>
                <div class="monitor-label">预警指标</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="monitor-card danger">
                <div class="monitor-icon">×</div>
                <div class="monitor-value">{{ dangerCount }}</div>
                <div class="monitor-label">危险指标</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="monitor-card total">
                <div class="monitor-icon">∑</div>
                <div class="monitor-value">{{ totalCount }}</div>
                <div class="monitor-label">总指标数</div>
              </div>
            </el-col>
          </el-row>

          <el-tabs v-model="activeTab">
            <el-tab-pane label="全部指标" name="all">
              <el-table :data="indicators" stripe border>
                <el-table-column prop="name" label="指标名称" width="180" />
                <el-table-column prop="department" label="部门" width="100" />
                <el-table-column prop="value" label="当前值" width="120">
                  <template #default="{ row }">
                    <span :style="{ color: row.status === 'danger' ? '#f56c6c' : row.status === 'warning' ? '#e6a23c' : '#67c23a' }">
                      {{ row.value }}{{ row.unit }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="target" label="目标值" width="120">
                  <template #default="{ row }">
                    {{ row.target }}{{ row.unit }}
                  </template>
                </el-table-column>
                <el-table-column label="完成率" width="120">
                  <template #default="{ row }">
                    <el-progress :percentage="getCompletionRate(row)" :color="getProgressColor(row)" />
                  </template>
                </el-table-column>
                <el-table-column label="状态" width="100">
                  <template #default="{ row }">
                    <el-tag :type="row.status === 'normal' ? 'success' : row.status === 'warning' ? 'warning' : 'danger'" size="small">
                      {{ row.status === 'normal' ? '正常' : row.status === 'warning' ? '预警' : '危险' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="lastUpdateTime" label="更新时间" width="180" />
                <el-table-column label="操作" width="150">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" @click="handleDetail(row)">详情</el-button>
                    <el-button type="primary" link size="small" @click="handleTrend(row)">趋势</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="预警指标" name="warning">
              <el-table :data="warningIndicators" stripe border>
                <el-table-column prop="name" label="指标名称" width="180" />
                <el-table-column prop="department" label="部门" width="100" />
                <el-table-column prop="value" label="当前值" width="120">
                  <template #default="{ row }">
                    <span style="color: #e6a23c">{{ row.value }}{{ row.unit }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="target" label="目标值" width="120">
                  <template #default="{ row }">
                    {{ row.target }}{{ row.unit }}
                  </template>
                </el-table-column>
                <el-table-column label="预警级别" width="100">
                  <template #default="{ row }">
                    <el-tag :type="row.warningLevel === 'red' ? 'danger' : 'warning'" size="small">
                      {{ row.warningLevel === 'red' ? '红色' : '黄色' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="lastUpdateTime" label="更新时间" width="180" />
                <el-table-column label="操作" width="150">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" @click="handleDetail(row)">详情</el-button>
                    <el-button type="primary" link size="small" @click="handleCreateWorkOrder(row)">创建工单</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="危险指标" name="danger">
              <el-table :data="dangerIndicators" stripe border>
                <el-table-column prop="name" label="指标名称" width="180" />
                <el-table-column prop="department" label="部门" width="100" />
                <el-table-column prop="value" label="当前值" width="120">
                  <template #default="{ row }">
                    <span style="color: #f56c6c">{{ row.value }}{{ row.unit }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="target" label="目标值" width="120">
                  <template #default="{ row }">
                    {{ row.target }}{{ row.unit }}
                  </template>
                </el-table-column>
                <el-table-column label="预警级别" width="100">
                  <template #default="{ row }">
                    <el-tag type="danger" size="small">红色</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="lastUpdateTime" label="更新时间" width="180" />
                <el-table-column label="操作" width="150">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" @click="handleDetail(_row)">详情</el-button>
                    <el-button type="danger" link size="small" @click="handleCreateWorkOrder(_row)">立即创建工单</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="detailDialogVisible" title="指标详情" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="指标名称">{{ currentIndicator.name }}</el-descriptions-item>
        <el-descriptions-item label="指标编码">{{ currentIndicator.code }}</el-descriptions-item>
        <el-descriptions-item label="指标级别">{{ currentIndicator.level }}</el-descriptions-item>
        <el-descriptions-item label="所属部门">{{ currentIndicator.department }}</el-descriptions-item>
        <el-descriptions-item label="业务分类">{{ currentIndicator.category }}</el-descriptions-item>
        <el-descriptions-item label="数据来源">{{ currentIndicator.dataSource }}</el-descriptions-item>
        <el-descriptions-item label="当前值">
          <span :style="{ color: currentIndicator.status === 'danger' ? '#f56c6c' : currentIndicator.status === 'warning' ? '#e6a23c' : '#67c23a' }">
            {{ currentIndicator.value }}{{ currentIndicator.unit }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="目标值">{{ currentIndicator.target }}{{ currentIndicator.unit }}</el-descriptions-item>
        <el-descriptions-item label="同比">
          <span :style="{ color: currentIndicator.yearOnYear > 0 ? '#f56c6c' : '#67c23a' }">
            {{ currentIndicator.yearOnYear > 0 ? '+' : '' }}{{ currentIndicator.yearOnYear }}%
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="环比">
          <span :style="{ color: currentIndicator.monthOnMonth > 0 ? '#f56c6c' : '#67c23a' }">
            {{ currentIndicator.monthOnMonth > 0 ? '+' : '' }}{{ currentIndicator.monthOnMonth }}%
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentIndicator.status === 'normal' ? 'success' : currentIndicator.status === 'warning' ? 'warning' : 'danger'" size="small">
            {{ currentIndicator.status === 'normal' ? '正常' : currentIndicator.status === 'warning' ? '预警' : '危险' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ currentIndicator.lastUpdateTime }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { indicators } from '@/data/indicators'

const activeTab = ref('all')
const detailDialogVisible = ref(false)
const currentIndicator = ref<any>({})

const normalCount = computed(() => indicators.filter(item => item.status === 'normal').length)
const warningCount = computed(() => indicators.filter(item => item.status === 'warning').length)
const dangerCount = computed(() => indicators.filter(item => item.status === 'danger').length)
const totalCount = computed(() => indicators.length)

const warningIndicators = computed(() => indicators.filter(item => item.status === 'warning'))
const dangerIndicators = computed(() => indicators.filter(item => item.status === 'danger'))

const getCompletionRate = (row: any) => {
  if (row.target === 0) return 0
  const rate = (row.value / row.target) * 100
  return Math.min(Math.max(rate, 0), 100)
}

const getProgressColor = (row: any) => {
  if (row.status === 'danger') return '#f56c6c'
  if (row.status === 'warning') return '#e6a23c'
  return '#67c23a'
}

const handleRefresh = () => {
  ElMessage.success('刷新成功')
}

const handleDetail = (row: any) => {
  currentIndicator.value = row
  detailDialogVisible.value = true
}

const handleTrend = (row: any) => {
  console.log('查看趋势', row)
}

const handleCreateWorkOrder = (row: any) => {
  ElMessage.success(`已为指标"${row.name}"创建督办工单`)
}
</script>

<style scoped>
.indicator-monitor {
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

.monitor-card {
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  color: #fff;
}

.monitor-card.normal {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
}

.monitor-card.warning {
  background: linear-gradient(135deg, #e6a23c 0%, #f0c78a 100%);
}

.monitor-card.danger {
  background: linear-gradient(135deg, #f56c6c 0%, #f89898 100%);
}

.monitor-card.total {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
}

.monitor-icon {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
}

.monitor-value {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 8px;
}

.monitor-label {
  font-size: 14px;
  opacity: 0.9;
}
</style>
