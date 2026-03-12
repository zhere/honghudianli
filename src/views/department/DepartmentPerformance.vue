<template>
  <div class="department-performance">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>绩效展示</span>
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
              <div class="performance-card total">
                <div class="performance-icon">∑</div>
                <div class="performance-value">{{ currentDepartmentPerformance.totalPoints }}</div>
                <div class="performance-label">总积分</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="performance-card average">
                <div class="performance-icon">平</div>
                <div class="performance-value">{{ currentDepartmentPerformance.averagePoints }}</div>
                <div class="performance-label">人均积分</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="performance-card rank">
                <div class="performance-icon">🏆</div>
                <div class="performance-value">第{{ currentDepartmentPerformance.rank }}名</div>
                <div class="performance-label">部门排名</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="performance-card growth">
                <div class="performance-icon">↑</div>
                <div class="performance-value">15.8%</div>
                <div class="performance-label">增长率</div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>绩效趋势</span>
                </template>
                <v-chart :option="trendOption" style="height: 300px" />
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>绩效指标</span>
                </template>
                <v-chart :option="indicatorOption" style="height: 300px" />
              </el-card>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="mt-20">
            <el-col :span="24">
              <el-card>
                <template #header>
                  <span>部门员工绩效对比</span>
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
                  <el-table-column label="满意度" width="120">
                    <template #default="{ row }">
                      <el-progress :percentage="row.satisfactionRate" :color="getProgressColor(row.satisfactionRate)" />
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

          <el-row :gutter="20" class="mt-20">
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>部门对比</span>
                </template>
                <v-chart :option="comparisonOption" style="height: 350px" />
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>绩效分布</span>
                </template>
                <v-chart :option="distributionOption" style="height: 350px" />
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
import { LineChart, BarChart, RadarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { departmentPerformances } from '@/data/performances'
import { performances } from '@/data/performances'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  RadarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const selectedDepartment = ref('安监部')

const currentDepartmentPerformance = computed(() => {
  const dept = departmentPerformances.find(item => item.department === selectedDepartment.value)
  return dept || { totalPoints: 0, averagePoints: 0, rank: 0, workOrderCount: 0, completionRate: 0, timelinessRate: 0, qualityRate: 0 }
})

const departmentEmployees = computed(() => {
  return performances.filter(item => item.department === selectedDepartment.value)
})

const trendOption = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['总积分', '人均积分']
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
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '总积分',
      type: 'line',
      data: [280, 295, 306, 320, 335, 350],
      smooth: true
    },
    {
      name: '人均积分',
      type: 'line',
      data: [140, 148, 153, 160, 168, 175],
      smooth: true
    }
  ]
}

const indicatorOption = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['完成率', '及时率', '质量率']
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
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: {
    type: 'value',
    max: 100
  },
  series: [
    {
      name: '完成率',
      type: 'line',
      data: [85, 88, 92, 90, 93, 95],
      smooth: true
    },
    {
      name: '及时率',
      type: 'line',
      data: [80, 82, 85, 83, 86, 88],
      smooth: true
    },
    {
      name: '质量率',
      type: 'line',
      data: [88, 90, 93, 91, 94, 96],
      smooth: true
    }
  ]
}

const comparisonOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['总积分', '人均积分']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: departmentPerformances.map(item => item.department)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '总积分',
      type: 'bar',
      data: departmentPerformances.map(item => item.totalPoints)
    },
    {
      name: '人均积分',
      type: 'bar',
      data: departmentPerformances.map(item => item.averagePoints)
    }
  ]
}

const distributionOption = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '绩效等级',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 2, name: '优秀' },
        { value: 3, name: '良好' },
        { value: 4, name: '合格' },
        { value: 1, name: '不合格' }
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
.department-performance {
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

.performance-card {
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  color: #fff;
}

.performance-card.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.performance-card.average {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.performance-card.rank {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.performance-card.growth {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.performance-icon {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 12px;
  opacity: 0.8;
}

.performance-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
}

.performance-label {
  font-size: 14px;
  opacity: 0.9;
}
</style>
