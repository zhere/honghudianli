<template>
  <div class="analysis-statistics">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>统计分析</span>
              <el-button type="primary" size="small" @click="handleRefresh">刷新</el-button>
            </div>
          </template>

          <el-tabs v-model="activeTab">
            <el-tab-pane label="工单统计" name="workorder">
              <el-row :gutter="20" class="mb-20">
                <el-col :span="6">
                  <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)">
                      <el-icon :size="24"><Document /></el-icon>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value">{{ statistics.workOrderStats.total }}</div>
                      <div class="stat-label">总工单数</div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%)">
                      <el-icon :size="24"><CircleCheck /></el-icon>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value">{{ statistics.workOrderStats.completed }}</div>
                      <div class="stat-label">已完成</div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%)">
                      <el-icon :size="24"><Warning /></el-icon>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value">{{ statistics.workOrderStats.overdue }}</div>
                      <div class="stat-label">超期工单</div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #722ed1 0%, #9254de 100%)">
                      <el-icon :size="24"><TrendCharts /></el-icon>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value">{{ statistics.workOrderStats.new }}</div>
                      <div class="stat-label">新增工单</div>
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
                    <v-chart :option="workOrderTrendOption" style="height: 300px" />
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card>
                    <template #header>
                      <span>工单类型分布</span>
                    </template>
                    <v-chart :option="typeDistributionOption" style="height: 300px" />
                  </el-card>
                </el-col>
              </el-row>

              <el-row :gutter="20" class="mt-20">
                <el-col :span="24">
                  <el-card>
                    <template #header>
                      <span>部门工单统计</span>
                    </template>
                    <el-table :data="statistics.workOrderStats.byDepartment" stripe border>
                      <el-table-column prop="department" label="部门" />
                      <el-table-column prop="total" label="总工单数" />
                      <el-table-column prop="completed" label="已完成" />
                      <el-table-column prop="overdue" label="超期" />
                      <el-table-column label="完成率">
                        <template #default="{ row }">
                          <el-progress :percentage="row.completionRate" :color="getProgressColor(row.completionRate)" />
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-card>
                </el-col>
              </el-row>
            </el-tab-pane>

            <el-tab-pane label="效率分析" name="efficiency">
              <el-row :gutter="20" class="mb-20">
                <el-col :span="8">
                  <div class="efficiency-card">
                    <div class="efficiency-label">平均总处理时长</div>
                    <div class="efficiency-value">{{ statistics.efficiencyStats.avgTotalTime }}小时</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="efficiency-card">
                    <div class="efficiency-label">平均执行时长</div>
                    <div class="efficiency-value">{{ statistics.efficiencyStats.avgCompleteTime }}小时</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="efficiency-card">
                    <div class="efficiency-label">平均验收时长</div>
                    <div class="efficiency-value">{{ statistics.efficiencyStats.avgAcceptanceTime }}小时</div>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card>
                    <template #header>
                      <span>效率趋势</span>
                    </template>
                    <v-chart :option="efficiencyTrendOption" style="height: 300px" />
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card>
                    <template #header>
                      <span>部门效率对比</span>
                    </template>
                    <v-chart :option="departmentEfficiencyOption" style="height: 300px" />
                  </el-card>
                </el-col>
              </el-row>
            </el-tab-pane>

            <el-tab-pane label="质量分析" name="quality">
              <el-row :gutter="20" class="mb-20">
                <el-col :span="6">
                  <div class="quality-card">
                    <div class="quality-label">一次验收通过率</div>
                    <div class="quality-value">{{ statistics.qualityStats.firstPassRate }}%</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="quality-card">
                    <div class="quality-label">返工率</div>
                    <div class="quality-value">{{ statistics.qualityStats.reworkRate }}%</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="quality-card">
                    <div class="quality-label">材料完整性</div>
                    <div class="quality-value">{{ statistics.qualityStats.materialCompleteness }}%</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="quality-card">
                    <div class="quality-label">客户满意度</div>
                    <div class="quality-value">{{ statistics.qualityStats.customerSatisfaction }}%</div>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card>
                    <template #header>
                      <span>质量趋势</span>
                    </template>
                    <v-chart :option="qualityTrendOption" style="height: 300px" />
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card>
                    <template #header>
                      <span>部门质量对比</span>
                    </template>
                    <v-chart :option="departmentQualityOption" style="height: 300px" />
                  </el-card>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
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
import { Document, CircleCheck, Warning, TrendCharts } from '@element-plus/icons-vue'
import { statistics } from '@/data/statistics'

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

const activeTab = ref('workorder')

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

const typeDistributionOption = {
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
      data: statistics.workOrderStats.byType.map(item => ({
        value: item.total,
        name: item.type
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

const efficiencyTrendOption = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['平均处理时长']
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
    data: statistics.trendStats.efficiencyTrend.map(item => item.date)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '平均处理时长',
      type: 'line',
      data: statistics.trendStats.efficiencyTrend.map(item => item.value),
      smooth: true
    }
  ]
}

const departmentEfficiencyOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['总时长', '执行时长', '验收时长']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: statistics.efficiencyStats.byDepartment.map(item => item.department)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '总时长',
      type: 'bar',
      data: statistics.efficiencyStats.byDepartment.map(item => item.avgTotalTime)
    },
    {
      name: '执行时长',
      type: 'bar',
      data: statistics.efficiencyStats.byDepartment.map(item => item.avgCompleteTime)
    },
    {
      name: '验收时长',
      type: 'bar',
      data: statistics.efficiencyStats.byDepartment.map(item => item.avgAcceptanceTime)
    }
  ]
}

const qualityTrendOption = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['一次验收通过率', '客户满意度']
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
    data: statistics.trendStats.qualityTrend.map(item => item.date)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '一次验收通过率',
      type: 'line',
      data: statistics.trendStats.qualityTrend.map(item => item.value),
      smooth: true
    },
    {
      name: '客户满意度',
      type: 'line',
      data: statistics.trendStats.qualityTrend.map(item => item.value + 5),
      smooth: true
    }
  ]
}

const departmentQualityOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['一次验收通过率', '返工率', '材料完整性']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: statistics.qualityStats.byDepartment.map(item => item.department)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '一次验收通过率',
      type: 'bar',
      data: statistics.qualityStats.byDepartment.map(item => item.firstPassRate)
    },
    {
      name: '返工率',
      type: 'bar',
      data: statistics.qualityStats.byDepartment.map(item => item.reworkRate)
    },
    {
      name: '材料完整性',
      type: 'bar',
      data: statistics.qualityStats.byDepartment.map(item => item.materialCompleteness)
    }
  ]
}

const getProgressColor = (percentage: number) => {
  if (percentage >= 90) return '#67c23a'
  if (percentage >= 70) return '#e6a23c'
  return '#f56c6c'
}

const handleRefresh = () => {
  ElMessage.success('刷新成功')
}
</script>

<style scoped>
.analysis-statistics {
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

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-right: 20px;
}

.stat-content {
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

.efficiency-card {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  text-align: center;
  color: #fff;
}

.efficiency-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.efficiency-value {
  font-size: 32px;
  font-weight: bold;
}

.quality-card {
  padding: 24px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 8px;
  text-align: center;
  color: #fff;
}

.quality-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.quality-value {
  font-size: 32px;
  font-weight: bold;
}
</style>
