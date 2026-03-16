<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div class="header-left">
        <h2>领导驾驶舱</h2>
        <div class="current-time">{{ currentTime }}</div>
      </div>
      <div class="header-right">
        <div class="warning-scroll">
          <el-icon class="warning-icon"><Warning /></el-icon>
          <div class="scroll-content">
            <span v-for="(warning, index) in warningMessages" :key="index" class="warning-item">
              {{ warning }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="section key-indicators">
        <div class="section-header">
          <h3>
            <el-icon><DataAnalysis /></el-icon>
            关键指标概览
          </h3>
          <el-tag type="danger" size="small">{{ warningIndicators.length }}个预警</el-tag>
        </div>
        <div class="department-tabs">
          <el-tabs v-model="activeDepartment" @tab-change="handleDepartmentChange">
            <el-tab-pane
              v-for="dept in departments"
              :key="dept.name"
              :label="dept.label"
              :name="dept.name"
            >
              <div class="indicators-grid">
                <div
                  v-for="scene in getDepartmentScenes(dept.name)"
                  :key="scene"
                  class="scene-card"
                >
                  <div class="scene-header">
                    <span class="scene-title">{{ scene }}</span>
                    <el-button
                      type="primary"
                      link
                      size="small"
                      @click="handleSceneClick(dept.name, scene)"
                    >
                      查看详情
                    </el-button>
                  </div>
                  <div class="indicators-list">
                    <div
                      v-for="indicator in getSceneIndicators(dept.name, scene)"
                      :key="indicator.id"
                      class="indicator-item"
                      :class="getIndicatorClass(indicator)"
                      @click="handleIndicatorClick(indicator)"
                    >
                      <div class="indicator-name">{{ indicator.name }}</div>
                      <div class="indicator-value">
                        <span class="value">{{ indicator.value }}</span>
                        <span class="unit">{{ indicator.unit }}</span>
                      </div>
                      <div class="indicator-meta">
                        <span class="target">目标: {{ indicator.target }}{{ indicator.unit }}</span>
                        <span
                          class="change"
                          :class="indicator.yearOnYear > 0 ? 'up' : 'down'"
                        >
                          同比 {{ indicator.yearOnYear > 0 ? '+' : '' }}{{ indicator.yearOnYear }}%
                        </span>
                      </div>
                      <el-tag
                        v-if="indicator.warningLevel"
                        :type="getWarningType(indicator.warningLevel)"
                        size="small"
                        class="warning-tag"
                      >
                        {{ getWarningText(indicator.warningLevel) }}
                      </el-tag>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <div class="section workorder-section">
        <div class="section-header">
          <h3>
            <el-icon><Document /></el-icon>
            工单情况
          </h3>
          <el-button type="primary" size="small" @click="$router.push('/workorder/list')">
            查看全部
          </el-button>
        </div>
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="workorder-stats">
              <div class="stat-card total">
                <div class="stat-icon">
                  <el-icon><Document /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ workOrderStats.total }}</div>
                  <div class="stat-label">当日工单总数</div>
                </div>
              </div>
              <div class="stat-card pending">
                <div class="stat-icon">
                  <el-icon><Timer /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ workOrderStats.pending }}</div>
                  <div class="stat-label">待处理工单</div>
                </div>
              </div>
              <div class="stat-card processing">
                <div class="stat-icon">
                  <el-icon><Loading /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ workOrderStats.processing }}</div>
                  <div class="stat-label">处理中工单</div>
                </div>
              </div>
              <div class="stat-card completed">
                <div class="stat-icon">
                  <el-icon><CircleCheck /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ workOrderStats.completed }}</div>
                  <div class="stat-label">已完成工单</div>
                </div>
              </div>
              <div class="stat-card overdue">
                <div class="stat-icon">
                  <el-icon><Warning /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ workOrderStats.overdue }}</div>
                  <div class="stat-label">超时工单</div>
                </div>
              </div>
            </div>
            <div class="workorder-charts">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card class="chart-card">
                    <template #header>
                      <span>工单趋势</span>
                    </template>
                    <v-chart :option="workOrderTrendOption" style="height: 250px" />
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card class="chart-card">
                    <template #header>
                      <span>部门工单分布</span>
                    </template>
                    <v-chart :option="departmentWorkOrderOption" style="height: 250px" />
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="8">
            <el-card class="workorder-list-card">
              <template #header>
                <div class="card-header">
                  <span>待处理工单</span>
                  <el-tag type="warning" size="small">{{ pendingWorkOrders.length }}个</el-tag>
                </div>
              </template>
              <div class="workorder-list">
                <div
                  v-for="order in pendingWorkOrders.slice(0, 5)"
                  :key="order.id"
                  class="workorder-item"
                  @click="handleWorkOrderClick(order)"
                >
                  <div class="order-header">
                    <span class="order-id">{{ order.id }}</span>
                    <el-tag :type="getPriorityType(order.priority)" size="small">
                      {{ getPriorityText(order.priority) }}
                    </el-tag>
                  </div>
                  <div class="order-title">{{ order.title }}</div>
                  <div class="order-meta">
                    <span class="department">{{ order.department }}</span>
                    <span class="deadline">{{ order.completionDeadline }}</span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div class="section performance-section">
        <div class="section-header">
          <h3>
            <el-icon><Trophy /></el-icon>
            绩效情况
          </h3>
          <el-button type="primary" size="small" @click="$router.push('/performance/ranking')">
            查看全部
          </el-button>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>部门绩效排名</span>
                  <el-radio-group v-model="performancePeriod" size="small">
                    <el-radio-button label="month">月度</el-radio-button>
                    <el-radio-button label="quarter">季度</el-radio-button>
                    <el-radio-button label="year">年度</el-radio-button>
                  </el-radio-group>
                </div>
              </template>
              <v-chart :option="performanceRankOption" style="height: 300px" />
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>个人绩效TOP10</span>
                </div>
              </template>
              <div class="performance-list">
                <div
                  v-for="(person, index) in topPerformers"
                  :key="person.id"
                  class="performance-item"
                  @click="handlePerformanceClick(person)"
                >
                  <div class="rank" :class="'rank-' + (index + 1)">{{ index + 1 }}</div>
                  <div class="person-info">
                    <div class="person-name">{{ person.employeeName }}</div>
                    <div class="person-department">{{ person.department }}</div>
                  </div>
                  <div class="person-score">
                    <span class="score">{{ person.totalPoints }}</span>
                    <span class="level" :class="'level-' + person.performanceLevel">
                      {{ person.performanceLevel }}
                    </span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import {
  DataAnalysis,
  Document,
  Trophy,
  Warning,
  Timer,
  Loading,
  CircleCheck
} from '@element-plus/icons-vue'
import { indicators, departmentScenes } from '@/data/indicators'
import { workOrders } from '@/data/workOrders'
import { performances, departmentPerformances } from '@/data/performances'
import { statistics } from '@/data/statistics'

const router = useRouter()

use([
  CanvasRenderer,
  LineChart,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const currentTime = ref('')
const activeDepartment = ref('安监部')
const performancePeriod = ref('month')

const departments = [
  { name: '安监部', label: '安监部' },
  { name: '营销部', label: '营销部' },
  { name: '供指中心', label: '供指中心' },
  { name: '工区', label: '工区' },
  { name: '配电部', label: '配电部' },
  { name: '发建部', label: '发建部' }
]

const warningIndicators = computed(() => indicators.filter(item => item.warningLevel))

const pendingWorkOrders = computed(() =>
  workOrders.filter(item => item.status === '待接收' || item.status === '执行中')
)

const topPerformers = computed(() => performances.slice(0, 10))

const warningMessages = computed(() => {
  const messages = warningIndicators.value.slice(0, 5).map(item =>
    `${item.department} - ${item.name}: ${item.value}${item.unit}`
  )
  return messages.length > 0 ? messages : ['当前无预警信息']
})

const workOrderStats = computed(() => ({
  total: statistics.workOrderStats.new,
  pending: statistics.workOrderStats.byStatus.find(s => s.status === '待接收')?.count || 0,
  processing: statistics.workOrderStats.byStatus.find(s => s.status === '执行中')?.count || 0,
  completed: statistics.workOrderStats.byStatus.find(s => s.status === '已完成')?.count || 0,
  overdue: statistics.workOrderStats.overdue
}))

const getDepartmentScenes = (department: string) => {
  const dept = departmentScenes.find(d => d.department === department)
  return dept ? dept.scenes : []
}

const getSceneIndicators = (department: string, scene: string) => {
  return indicators.filter(item => item.department === department && item.scene === scene)
}

const getIndicatorClass = (indicator: any) => {
  return {
    'indicator-normal': indicator.status === 'normal',
    'indicator-warning': indicator.status === 'warning',
    'indicator-danger': indicator.status === 'danger'
  }
}

const getWarningType = (level: string) => {
  const typeMap: Record<string, any> = {
    yellow: 'warning',
    orange: 'danger',
    red: 'danger'
  }
  return typeMap[level] || 'info'
}

const getWarningText = (level: string) => {
  const textMap: Record<string, string> = {
    yellow: '一般预警',
    orange: '严重预警',
    red: '紧急预警'
  }
  return textMap[level] || ''
}

const getPriorityType = (priority: string) => {
  const typeMap: Record<string, any> = {
    yellow: 'warning',
    orange: 'danger',
    red: 'danger'
  }
  return typeMap[priority] || 'info'
}

const getPriorityText = (priority: string) => {
  const textMap: Record<string, string> = {
    yellow: '一般',
    orange: '严重',
    red: '特别严重'
  }
  return textMap[priority] || ''
}

const workOrderTrendOption = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['新增工单', '完成工单']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: statistics.trendStats.workOrderTrend.map(item => item.date)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '新增工单',
      type: 'line',
      data: statistics.trendStats.workOrderTrend.map(item => item.value),
      smooth: true,
      itemStyle: { color: '#1890ff' }
    },
    {
      name: '完成工单',
      type: 'line',
      data: statistics.trendStats.workOrderTrend.map(item => Math.floor(item.value * 0.8)),
      smooth: true,
      itemStyle: { color: '#52c41a' }
    }
  ]
}

const departmentWorkOrderOption = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '工单分布',
      type: 'pie',
      radius: '50%',
      data: statistics.workOrderStats.byDepartment.map(item => ({
        value: item.total,
        name: item.department
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}

const performanceRankOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value'
  },
  yAxis: {
    type: 'category',
    data: departmentPerformances.map(item => item.department)
  },
  series: [
    {
      name: '绩效得分',
      type: 'bar',
      data: departmentPerformances.map(item => item.totalPoints),
      itemStyle: {
        color: '#1890ff'
      },
      label: {
        show: true,
        position: 'right'
      }
    }
  ]
}))

const handleDepartmentChange = (name: string) => {
  activeDepartment.value = name
}

const handleSceneClick = (department: string, scene: string) => {
  router.push({
    path: '/indicator/list',
    query: { department, scene }
  })
}

const handleIndicatorClick = (indicator: any) => {
  router.push({
    path: '/indicator/list',
    query: { id: indicator.id }
  })
}

const handleWorkOrderClick = (order: any) => {
  router.push({
    path: '/workorder/list',
    query: { id: order.id }
  })
}

const handlePerformanceClick = (person: any) => {
  router.push({
    path: '/performance/ranking',
    query: { id: person.id }
  })
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

let timer: number

onMounted(() => {
  updateTime()
  timer = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.dashboard {
  padding: 0;
  background: #f0f2f5;
  min-height: 100vh;
}

.dashboard-header {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}

.header-left h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
}

.current-time {
  font-size: 14px;
  opacity: 0.9;
}

.header-right {
  flex: 1;
  margin-left: 40px;
}

.warning-scroll {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 8px 16px;
}

.warning-icon {
  font-size: 18px;
  margin-right: 10px;
  color: #faad14;
}

.scroll-content {
  overflow: hidden;
  white-space: nowrap;
}

.warning-item {
  margin-right: 40px;
}

.dashboard-content {
  padding: 20px;
}

.section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.department-tabs {
  margin-top: 10px;
}

.indicators-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.scene-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}

.scene-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8e8e8;
}

.scene-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.indicators-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.indicator-item {
  background: #fff;
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #e8e8e8;
  position: relative;
}

.indicator-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.indicator-item.indicator-warning {
  border-color: #faad14;
  background: #fffbe6;
}

.indicator-item.indicator-danger {
  border-color: #f5222d;
  background: #fff1f0;
}

.indicator-name {
  font-size: 13px;
  color: #595959;
  margin-bottom: 8px;
}

.indicator-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 6px;
}

.indicator-value .value {
  font-size: 24px;
  font-weight: bold;
  color: #262626;
}

.indicator-value .unit {
  font-size: 12px;
  color: #8c8c8c;
}

.indicator-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #8c8c8c;
}

.indicator-meta .change.up {
  color: #f5222d;
}

.indicator-meta .change.down {
  color: #52c41a;
}

.warning-tag {
  position: absolute;
  top: 8px;
  right: 8px;
}

.workorder-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e8e8e8;
}

.stat-card.total {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: #fff;
  border: none;
}

.stat-card.pending {
  background: linear-gradient(135deg, #faad14 0%, #d48806 100%);
  color: #fff;
  border: none;
}

.stat-card.processing {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
  color: #fff;
  border: none;
}

.stat-card.completed {
  background: linear-gradient(135deg, #722ed1 0%, #531dab 100%);
  color: #fff;
  border: none;
}

.stat-card.overdue {
  background: linear-gradient(135deg, #f5222d 0%, #cf1322 100%);
  color: #fff;
  border: none;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.workorder-charts {
  margin-top: 20px;
}

.chart-card {
  height: 100%;
}

.workorder-list-card {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.workorder-list {
  max-height: 400px;
  overflow-y: auto;
}

.workorder-item {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.3s;
}

.workorder-item:hover {
  background: #fafafa;
}

.workorder-item:last-child {
  border-bottom: none;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.order-id {
  font-size: 12px;
  color: #8c8c8c;
}

.order-title {
  font-size: 14px;
  color: #262626;
  margin-bottom: 6px;
}

.order-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #8c8c8c;
}

.performance-list {
  max-height: 350px;
  overflow-y: auto;
}

.performance-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.3s;
}

.performance-item:hover {
  background: #fafafa;
}

.performance-item:last-child {
  border-bottom: none;
}

.rank {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background: #f0f0f0;
  color: #8c8c8c;
}

.rank.rank-1 {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #fff;
}

.rank.rank-2 {
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
  color: #fff;
}

.rank.rank-3 {
  background: linear-gradient(135deg, #cd7f32 0%, #daa06d 100%);
  color: #fff;
}

.person-info {
  flex: 1;
}

.person-name {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.person-department {
  font-size: 12px;
  color: #8c8c8c;
}

.person-score {
  text-align: right;
}

.person-score .score {
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
}

.person-score .level {
  display: block;
  font-size: 12px;
  margin-top: 4px;
}

.level.level-优秀 {
  color: #52c41a;
}

.level.level-良好 {
  color: #1890ff;
}

.level.level-合格 {
  color: #faad14;
}

.level.level-不合格 {
  color: #f5222d;
}
</style>
