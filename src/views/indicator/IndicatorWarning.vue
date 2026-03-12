<template>
  <div class="indicator-warning">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>预警管理</span>
              <el-button type="primary" size="small" @click="handleRefresh">刷新</el-button>
            </div>
          </template>

          <el-row :gutter="20" class="mb-20">
            <el-col :span="8">
              <div class="warning-card yellow">
                <div class="warning-icon">⚠</div>
                <div class="warning-value">{{ yellowWarningCount }}</div>
                <div class="warning-label">黄色预警</div>
                <div class="warning-desc">一般预警，需关注</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="warning-card orange">
                <div class="warning-icon">⚠</div>
                <div class="warning-value">{{ orangeWarningCount }}</div>
                <div class="warning-label">橙色预警</div>
                <div class="warning-desc">严重预警，需处理</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="warning-card red">
                <div class="warning-icon">⚠</div>
                <div class="warning-value">{{ redWarningCount }}</div>
                <div class="warning-label">红色预警</div>
                <div class="warning-desc">危险预警，需立即处理</div>
              </div>
            </el-col>
          </el-row>

          <el-tabs v-model="activeTab">
            <el-tab-pane label="全部预警" name="all">
              <el-table :data="warningIndicators" stripe border>
                <el-table-column prop="name" label="指标名称" width="180" />
                <el-table-column prop="department" label="部门" width="100" />
                <el-table-column prop="value" label="当前值" width="120">
                  <template #default="{ row }">
                    <span :style="{ color: getWarningColor(row.warningLevel) }">
                      {{ row.value }}{{ row.unit }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="target" label="目标值" width="120">
                  <template #default="{ row }">
                    {{ row.target }}{{ row.unit }}
                  </template>
                </el-table-column>
                <el-table-column label="偏差" width="120">
                  <template #default="{ row }">
                    <span :style="{ color: '#f56c6c' }">
                      {{ getDeviation(row) }}{{ row.unit }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="预警级别" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getWarningType(row.warningLevel)" size="small">
                      {{ getWarningLevelText(row.warningLevel) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="lastUpdateTime" label="预警时间" width="180" />
                <el-table-column label="操作" width="250">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" @click="handleDetail(row)">详情</el-button>
                    <el-button type="warning" link size="small" @click="handleCreateWorkOrder(row)">创建工单</el-button>
                    <el-button type="danger" link size="small" @click="handleIgnore(row)">忽略</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="黄色预警" name="yellow">
              <el-table :data="yellowWarnings" stripe border>
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
                <el-table-column label="偏差" width="120">
                  <template #default="{ row }">
                    <span style="color: #f56c6c">{{ getDeviation(row) }}{{ row.unit }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="lastUpdateTime" label="预警时间" width="180" />
                <el-table-column label="操作" width="200">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" @click="handleDetail(row)">详情</el-button>
                    <el-button type="warning" link size="small" @click="handleCreateWorkOrder(row)">创建工单</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="红色预警" name="red">
              <el-table :data="redWarnings" stripe border>
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
                <el-table-column label="偏差" width="120">
                  <template #default="{ row }">
                    <span style="color: #f56c6c">{{ getDeviation(row) }}{{ row.unit }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="lastUpdateTime" label="预警时间" width="180" />
                <el-table-column label="操作" width="200">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" @click="handleDetail(row)">详情</el-button>
                    <el-button type="danger" link size="small" @click="handleCreateWorkOrder(row)">立即创建工单</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="detailDialogVisible" title="预警详情" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="指标名称">{{ currentIndicator.name }}</el-descriptions-item>
        <el-descriptions-item label="指标编码">{{ currentIndicator.code }}</el-descriptions-item>
        <el-descriptions-item label="所属部门">{{ currentIndicator.department }}</el-descriptions-item>
        <el-descriptions-item label="业务分类">{{ currentIndicator.category }}</el-descriptions-item>
        <el-descriptions-item label="当前值">
          <span :style="{ color: getWarningColor(currentIndicator.warningLevel) }">
            {{ currentIndicator.value }}{{ currentIndicator.unit }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="目标值">{{ currentIndicator.target }}{{ currentIndicator.unit }}</el-descriptions-item>
        <el-descriptions-item label="偏差">
          <span style="color: #f56c6c">{{ getDeviation(currentIndicator) }}{{ currentIndicator.unit }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="预警级别">
          <el-tag :type="getWarningType(currentIndicator.warningLevel)" size="small">
            {{ getWarningLevelText(currentIndicator.warningLevel) }}
          </el-tag>
        </el-descriptions-item>
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
        <el-descriptions-item label="预警时间" :span="2">{{ currentIndicator.lastUpdateTime }}</el-descriptions-item>
      </el-descriptions>

      <el-divider>预警规则</el-divider>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="触发条件">
          {{ getTriggerCondition(currentIndicator) }}
        </el-descriptions-item>
        <el-descriptions-item label="响应时限">
          {{ getResponseTime(currentIndicator.warningLevel) }}
        </el-descriptions-item>
        <el-descriptions-item label="处理建议">
          {{ getHandleSuggestion(currentIndicator) }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { indicators } from '@/data/indicators'

const activeTab = ref('all')
const detailDialogVisible = ref(false)
const currentIndicator = ref<any>({})

const warningIndicators = computed(() => indicators.filter(item => item.warningLevel))
const yellowWarnings = computed(() => indicators.filter(item => item.warningLevel === 'yellow'))
const redWarnings = computed(() => indicators.filter(item => item.warningLevel === 'red'))

const yellowWarningCount = computed(() => yellowWarnings.value.length)
const orangeWarningCount = computed(() => indicators.filter(item => item.warningLevel === 'orange').length)
const redWarningCount = computed(() => redWarnings.value.length)

const getWarningColor = (level: string | null) => {
  if (level === 'red') return '#f56c6c'
  if (level === 'orange') return '#ff9800'
  if (level === 'yellow') return '#e6a23c'
  return '#67c23a'
}

const getWarningType = (level: string | null) => {
  if (level === 'red') return 'danger'
  if (level === 'orange') return 'warning'
  if (level === 'yellow') return 'warning'
  return 'success'
}

const getWarningLevelText = (level: string | null) => {
  if (level === 'red') return '红色'
  if (level === 'orange') return '橙色'
  if (level === 'yellow') return '黄色'
  return '正常'
}

const getDeviation = (row: any) => {
  const deviation = Math.abs(row.value - row.target)
  return row.value > row.target ? `+${deviation}` : `-${deviation}`
}

const getTriggerCondition = (row: any) => {
  if (row.yearOnYear > 10) return `同比超过10%（当前${row.yearOnYear}%）`
  if (row.value < row.target * 0.95) return `低于目标值95%（当前${((row.value / row.target) * 100).toFixed(1)}%）`
  return '指标异常'
}

const getResponseTime = (level: string | null) => {
  if (level === 'red') return '30分钟内响应'
  if (level === 'orange') return '1小时内响应'
  if (level === 'yellow') return '2小时内响应'
  return '24小时内响应'
}

const getHandleSuggestion = (row: any) => {
  if (row.department === '安监部') return '立即召开安全会议，分析原因，制定整改措施'
  if (row.department === '营销部') return '核实客户信息，加强服务质量管理'
  if (row.department === '配电部') return '组织现场巡视，及时处理设备缺陷'
  if (row.department === '供指中心') return '加强工单处理，提升服务质量'
  if (row.department === '运检部') return '制定检修计划，及时消除安全隐患'
  return '分析原因，制定改进措施'
}

const handleRefresh = () => {
  ElMessage.success('刷新成功')
}

const handleDetail = (row: any) => {
  currentIndicator.value = row
  detailDialogVisible.value = true
}

const handleCreateWorkOrder = (row: any) => {
  ElMessageBox.confirm(
    `确定要为指标"${row.name}"创建督办工单吗？`,
    '创建工单',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('工单创建成功')
  }).catch(() => {})
}

const handleIgnore = (row: any) => {
  ElMessageBox.confirm(
    `确定要忽略指标"${row.name}"的预警吗？`,
    '忽略预警',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('已忽略预警')
  }).catch(() => {})
}
</script>

<style scoped>
.indicator-warning {
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

.warning-card {
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  color: #fff;
}

.warning-card.yellow {
  background: linear-gradient(135deg, #e6a23c 0%, #f0c78a 100%);
}

.warning-card.orange {
  background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
}

.warning-card.red {
  background: linear-gradient(135deg, #f56c6c 0%, #f89898 100%);
}

.warning-icon {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 12px;
}

.warning-value {
  font-size: 42px;
  font-weight: bold;
  margin-bottom: 8px;
}

.warning-label {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}

.warning-desc {
  font-size: 14px;
  opacity: 0.9;
}
</style>
