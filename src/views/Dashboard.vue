<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6" v-for="(stat, index) in stats" :key="index">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" :style="{ background: stat.color }">
              <el-icon :size="24"><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>部门指标预警情况</span>
              <el-button type="primary" size="small" @click="$router.push('/indicator/warning')">查看全部</el-button>
            </div>
          </template>
          <el-table :data="departmentIndicatorStats" stripe>
            <el-table-column prop="department" label="部门" width="120" />
            <el-table-column label="预警指标" width="100">
              <template #default="{ row }">
                <el-link type="danger" @click="handleDepartmentIndicator(row.department, 'warning')">
                  <el-badge :value="row.warningCount" type="danger" />
                </el-link>
              </template>
            </el-table-column>
            <el-table-column label="正常指标" width="100">
              <template #default="{ row }">
                <el-link type="success" @click="handleDepartmentIndicator(row.department, 'normal')">
                  <el-badge :value="row.normalCount" type="success" />
                </el-link>
              </template>
            </el-table-column>
            <el-table-column label="预警率" width="120">
              <template #default="{ row }">
                <el-progress 
                  :percentage="row.warningRate" 
                  :color="row.warningRate > 30 ? '#f56c6c' : row.warningRate > 15 ? '#e6a23c' : '#67c23a'"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="handleDepartmentIndicator(row.department, 'all')">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>部门工单情况</span>
              <el-button type="primary" size="small" @click="$router.push('/workorder/list')">查看全部</el-button>
            </div>
          </template>
          <el-table :data="statistics.workOrderStats.byDepartment" stripe>
            <el-table-column prop="department" label="部门" width="120" />
            <el-table-column label="总工单" width="80">
              <template #default="{ row }">
                <el-link type="primary" @click="handleDepartmentWorkOrder(row.department, 'all')">
                  {{ row.total }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column label="已完成" width="80">
              <template #default="{ row }">
                <el-link type="success" @click="handleDepartmentWorkOrder(row.department, 'completed')">
                  {{ row.completed }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column label="超期" width="80">
              <template #default="{ row }">
                <el-link type="danger" @click="handleDepartmentWorkOrder(row.department, 'overdue')">
                  {{ row.overdue }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column label="完成率" width="120">
              <template #default="{ row }">
                <el-progress 
                  :percentage="row.completionRate" 
                  :color="row.completionRate >= 90 ? '#67c23a' : row.completionRate >= 70 ? '#e6a23c' : '#f56c6c'"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="handleDepartmentWorkOrder(row.department, 'all')">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>工单趋势</span>
            </div>
          </template>
          <v-chart :option="workOrderTrendOption" style="height: 300px" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>部门工单分布</span>
            </div>
          </template>
          <v-chart :option="departmentOption" style="height: 300px" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>实时预警</span>
              <el-tag type="danger" size="small">{{ warningIndicators.length }}个预警</el-tag>
            </div>
          </template>
          <el-table :data="warningIndicators" stripe>
            <el-table-column prop="name" label="指标名称" width="200" />
            <el-table-column prop="department" label="部门" width="120" />
            <el-table-column prop="value" label="当前值" width="100">
              <template #default="{ row }">
                <span :style="{ color: row.status === 'danger' ? '#f56c6c' : row.status === 'warning' ? '#e6a23c' : '#67c23a' }">
                  {{ row.value }}{{ row.unit }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="target" label="目标值" width="100">
              <template #default="{ row }">
                {{ row.target }}{{ row.unit }}
              </template>
            </el-table-column>
            <el-table-column prop="yearOnYear" label="同比" width="100">
              <template #default="{ row }">
                <span :style="{ color: row.yearOnYear > 0 ? '#f56c6c' : '#67c23a' }">
                  {{ row.yearOnYear > 0 ? '+' : '' }}{{ Math.abs(row.yearOnYear) }}%
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="lastUpdateTime" label="更新时间" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>工单状态</span>
          </template>
          <v-chart :option="statusOption" style="height: 300px" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>待处理工单</span>
              <el-button type="primary" size="small" @click="$router.push('/workorder/list')">查看全部</el-button>
            </div>
          </template>
          <el-table :data="pendingWorkOrders" stripe>
            <el-table-column prop="id" label="工单编号" width="150" />
            <el-table-column prop="title" label="工单标题" />
            <el-table-column prop="type" label="类型" width="100" />
            <el-table-column label="优先级" width="100">
              <template #default="{ row }">
                <el-tag :type="getPriorityType(row.priority)" size="small">
                  {{ getPriorityText(row.priority) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="responsiblePerson" label="责任人" width="100" />
            <el-table-column prop="completionDeadline" label="完成时限" width="180" />
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
                <el-button type="primary" link size="small" @click="handleProcess(row)">处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
import { Document, Warning, CircleCheck, Timer } from '@element-plus/icons-vue'
import { indicators } from '@/data/indicators'
import { workOrders } from '@/data/workOrders'
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

const stats = [
  { label: '总工单数', value: statistics.workOrderStats.total, icon: Document, color: '#1890ff' },
  { label: '新增工单', value: statistics.workOrderStats.new, icon: Warning, color: '#52c41a' },
  { label: '已完成', value: statistics.workOrderStats.completed, icon: CircleCheck, color: '#722ed1' },
  { label: '超期工单', value: statistics.workOrderStats.overdue, icon: Timer, color: '#f5222d' }
]

const warningIndicators = computed(() => indicators.filter(item => item.warningLevel))

const pendingWorkOrders = computed(() => workOrders.filter(item => item.status === '待接收' || item.status === '执行中'))

const departmentIndicatorStats = computed(() => {
  const departments = ['安监部', '营销部', '配电部', '供指中心', '运检部']
  return departments.map(dept => {
    const deptIndicators = indicators.filter(item => item.department === dept)
    const warningCount = deptIndicators.filter(item => item.warningLevel).length
    const normalCount = deptIndicators.filter(item => !item.warningLevel).length
    const warningRate = deptIndicators.length > 0 ? Math.round((warningCount / deptIndicators.length) * 100) : 0
    return {
      department: dept,
      warningCount,
      normalCount,
      warningRate,
      total: deptIndicators.length
    }
  })
})

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
      smooth: true
    },
    {
      name: '完成工单',
      type: 'line',
      data: statistics.trendStats.workOrderTrend.map(item => Math.floor(item.value * 0.8)),
      smooth: true
    }
  ]
}

const departmentOption = {
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

const statusOption = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '工单状态',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: statistics.workOrderStats.byStatus.map(item => ({
        value: item.count,
        name: item.status
      }))
    }
  ]
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

const handleView = (row: any) => {
  router.push({
    path: '/workorder/list',
    query: {
      id: row.id
    }
  })
}

const handleProcess = (row: any) => {
  console.log('处理工单', row.id)
}

const handleDepartmentIndicator = (department: string, status: string) => {
  router.push({
    path: '/indicator/list',
    query: {
      department,
      status
    }
  })
}

const handleDepartmentWorkOrder = (department: string, status: string) => {
  router.push({
    path: '/workorder/list',
    query: {
      department,
      status
    }
  })
}
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.mt-20 {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
