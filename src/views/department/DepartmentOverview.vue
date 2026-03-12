<template>
  <div class="department-overview">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>部门概览</span>
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
              <div class="overview-card">
                <div class="overview-icon" style="background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)">
                  <el-icon :size="24"><Document /></el-icon>
                </div>
                <div class="overview-content">
                  <div class="overview-value">{{ currentDepartmentStats.total }}</div>
                  <div class="overview-label">总工单数</div>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="overview-card">
                <div class="overview-icon" style="background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%)">
                  <el-icon :size="24"><CircleCheck /></el-icon>
                </div>
                <div class="overview-content">
                  <div class="overview-value">{{ currentDepartmentStats.completed }}</div>
                  <div class="overview-label">已完成</div>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="overview-card">
                <div class="overview-icon" style="background: linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%)">
                  <el-icon :size="24"><Warning /></el-icon>
                </div>
                <div class="overview-content">
                  <div class="overview-value">{{ currentDepartmentStats.overdue }}</div>
                  <div class="overview-label">超期工单</div>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="overview-card">
                <div class="overview-icon" style="background: linear-gradient(135deg, #722ed1 0%, #9254de 100%)">
                  <el-icon :size="24"><TrendCharts /></el-icon>
                </div>
                <div class="overview-content">
                  <div class="overview-value">{{ currentDepartmentStats.completionRate }}%</div>
                  <div class="overview-label">完成率</div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>工单趋势</span>
                </template>
                <v-chart :option="trendOption" style="height: 300px" />
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>工单类型分布</span>
                </template>
                <v-chart :option="typeOption" style="height: 300px" />
              </el-card>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="mt-20">
            <el-col :span="24">
              <el-card>
                <template #header>
                  <span>部门员工绩效</span>
                </template>
                <el-table :data="departmentEmployees" stripe border>
                  <el-table-column prop="employeeName" label="员工姓名" width="120" />
                  <el-table-column prop="position" label="岗位" width="120" />
                  <el-table-column prop="totalPoints" label="总积分" width="100" sortable />
                  <el-table-column prop="workOrderCount" label="工单数" width="100" />
                  <el-table-column label="完成率" width="120">
                    <template #default="{ row }">
                      <el-progress :percentage="row.completionRate" :color="getProgressColor(row.completionRate)" />
                    </template>
                  </el-table-column>
                  <el-table-column label="及时率" width="120">
                    <template #default="{ row }">
                      <el-progress :percentage="row.timelinessRate" :color="getProgressColor(row.timelinessRate)" />
                    </template>
                  </el-table-column>
                  <el-table-column label="质量率" width="120">
                    <template #default="{ row }">
                      <el-progress :percentage="row.qualityRate" :color="getProgressColor(row.qualityRate)" />
                    </template>
                  </el-table-column>
                  <el-table-column label="绩效等级" width="100">
                    <template #default="{ row }">
                      <el-tag :type="getPerformanceType(row.performanceLevel)" size="small">
                        {{ row.performanceLevel }}
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { Document, CircleCheck, Warning, TrendCharts } from '@element-plus/icons-vue'
import { statistics } from '@/data/statistics'
import { performances } from '@/data/performances'

use([
  CanvasRenderer,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const selectedDepartment = ref('安监部')

const currentDepartmentStats = computed(() => {
  const dept = statistics.workOrderStats.byDepartment.find(item => item.department === selectedDepartment.value)
  return dept || { total: 0, completed: 0, overdue: 0, completionRate: 0 }
})

const departmentEmployees = computed(() => {
  return performances.filter(item => item.department === selectedDepartment.value)
})

const trendOption = {
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
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '新增工单',
      type: 'line',
      data: [3, 5, 2, 4, 6, 3, 2],
      smooth: true
    },
    {
      name: '完成工单',
      type: 'line',
      data: [2, 4, 3, 3, 5, 2, 3],
      smooth: true
    }
  ]
}

const typeOption = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '工单类型',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 8, name: '安监类' },
        { value: 12, name: '营销类' },
        { value: 10, name: '配电类' },
        { value: 9, name: '供指类' },
        { value: 11, name: '运检类' }
      ],
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

const getProgressColor = (percentage: number) => {
  if (percentage >= 90) return '#67c23a'
  if (percentage >= 70) return '#e6a23c'
  return '#f56c6c'
}

const getPerformanceType = (level: string) => {
  const typeMap: Record<string, any> = {
    '优秀': 'success',
    '良好': 'primary',
    '合格': 'info',
    '不合格': 'danger'
  }
  return typeMap[level] || 'info'
}
</script>

<style scoped>
.department-overview {
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

.mt-20 {
  margin-top: 20px;
}

.overview-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.overview-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-right: 20px;
}

.overview-content {
  flex: 1;
}

.overview-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.overview-label {
  font-size: 14px;
  color: #909399;
}
</style>
