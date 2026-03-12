<template>
  <div class="performance-points">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>积分管理</span>
              <el-button type="primary" size="small" @click="handleRefresh">刷新</el-button>
            </div>
          </template>

          <el-row :gutter="20" class="mb-20">
            <el-col :span="6">
              <div class="points-card total">
                <div class="points-icon">∑</div>
                <div class="points-value">{{ totalPoints }}</div>
                <div class="points-label">总积分</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="points-card monthly">
                <div class="points-icon">月</div>
                <div class="points-value">{{ monthlyPoints }}</div>
                <div class="points-label">本月积分</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="points-card average">
                <div class="points-icon">平</div>
                <div class="points-value">{{ averagePoints }}</div>
                <div class="points-label">人均积分</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="points-card growth">
                <div class="points-icon">↑</div>
                <div class="points-value">{{ growthRate }}%</div>
                <div class="points-label">增长率</div>
              </div>
            </el-col>
          </el-row>

          <el-tabs v-model="activeTab">
            <el-tab-pane label="个人积分" name="personal">
              <el-form :inline="true" :model="searchForm">
                <el-form-item label="员工姓名">
                  <el-input v-model="searchForm.name" placeholder="请输入员工姓名" clearable />
                </el-form-item>
                <el-form-item label="部门">
                  <el-select v-model="searchForm.department" placeholder="请选择部门" clearable>
                    <el-option label="全部" value="" />
                    <el-option label="安监部" value="安监部" />
                    <el-option label="营销部" value="营销部" />
                    <el-option label="配电部" value="配电部" />
                    <el-option label="供指中心" value="供指中心" />
                    <el-option label="运检部" value="运检部" />
                  </el-select>
                </el-form-item>
                <el-form-item label="时间范围">
                  <el-date-picker
                    v-model="searchForm.dateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleSearch">查询</el-button>
                  <el-button @click="handleReset">重置</el-button>
                </el-form-item>
              </el-form>

              <el-table :data="performances" stripe border>
                <el-table-column prop="rank" label="排名" width="80" />
                <el-table-column prop="employeeName" label="员工姓名" width="120" />
                <el-table-column prop="department" label="部门" width="100" />
                <el-table-column prop="position" label="岗位" width="120" />
                <el-table-column prop="totalPoints" label="总积分" width="100" sortable />
                <el-table-column prop="monthlyPoints" label="本月积分" width="100" sortable />
                <el-table-column prop="yearlyPoints" label="年度积分" width="100" sortable />
                <el-table-column label="绩效等级" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getPerformanceType(row.performanceLevel)" size="small">
                      {{ row.performanceLevel }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="workOrderCount" label="工单数" width="80" />
                <el-table-column label="完成率" width="100">
                  <template #default="{ row }">
                    <el-progress :percentage="row.completionRate" :color="getProgressColor(row.completionRate)" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" @click="handleDetail(row)">详情</el-button>
                    <el-button type="primary" link size="small" @click="handleHistory(row)">历史</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="部门积分" name="department">
              <el-table :data="departmentPerformances" stripe border>
                <el-table-column prop="rank" label="排名" width="80" />
                <el-table-column prop="department" label="部门" width="150" />
                <el-table-column prop="totalPoints" label="总积分" width="120" sortable />
                <el-table-column prop="averagePoints" label="人均积分" width="120" sortable />
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
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="积分规则" name="rules">
              <el-card>
                <template #header>
                  <span>积分规则配置</span>
                  <el-button type="primary" size="small" @click="handleAddRule">新增规则</el-button>
                </template>
                <el-table :data="pointRules" stripe border>
                  <el-table-column prop="name" label="规则名称" width="200" />
                  <el-table-column prop="type" label="规则类型" width="120" />
                  <el-table-column prop="basePoints" label="基础分值" width="100" />
                  <el-table-column prop="qualityCoefficient" label="质量系数" width="120" />
                  <el-table-column prop="efficiencyCoefficient" label="效率系数" width="120" />
                  <el-table-column prop="difficultyCoefficient" label="难度系数" width="120" />
                  <el-table-column prop="description" label="规则说明" />
                  <el-table-column label="操作" width="150">
                    <template #default="{ row }">
                      <el-button type="primary" link size="small" @click="handleEditRule(row)">编辑</el-button>
                      <el-button type="danger" link size="small" @click="handleDeleteRule(row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="detailDialogVisible" title="积分详情" width="1000px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="员工姓名">{{ currentPerformance.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ currentPerformance.department }}</el-descriptions-item>
        <el-descriptions-item label="岗位">{{ currentPerformance.position }}</el-descriptions-item>
        <el-descriptions-item label="绩效等级">
          <el-tag :type="getPerformanceType(currentPerformance.performanceLevel)" size="small">
            {{ currentPerformance.performanceLevel }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="总积分">{{ currentPerformance.totalPoints }}</el-descriptions-item>
        <el-descriptions-item label="本月积分">{{ currentPerformance.monthlyPoints }}</el-descriptions-item>
        <el-descriptions-item label="年度积分">{{ currentPerformance.yearlyPoints }}</el-descriptions-item>
        <el-descriptions-item label="绩效系数">{{ currentPerformance.performanceCoefficient }}</el-descriptions-item>
      </el-descriptions>

      <el-divider>积分明细</el-divider>
      <el-table :data="currentPerformance.details" stripe border>
        <el-table-column prop="workOrderId" label="工单编号" width="150" />
        <el-table-column prop="workOrderTitle" label="工单标题" />
        <el-table-column prop="points" label="基础积分" width="100" />
        <el-table-column prop="qualityCoefficient" label="质量系数" width="100" />
        <el-table-column prop="efficiencyCoefficient" label="效率系数" width="100" />
        <el-table-column prop="difficultyCoefficient" label="难度系数" width="100" />
        <el-table-column prop="performanceScore" label="绩效得分" width="120" sortable />
        <el-table-column prop="completionTime" label="完成时间" width="180" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { performances, departmentPerformances } from '@/data/performances'

const activeTab = ref('personal')
const detailDialogVisible = ref(false)
const currentPerformance = ref<any>({})

const searchForm = ref({
  name: '',
  department: '',
  dateRange: []
})

const totalPoints = computed(() => performances.reduce((sum, item) => sum + item.totalPoints, 0))
const monthlyPoints = computed(() => performances.reduce((sum, item) => sum + item.monthlyPoints, 0))
const averagePoints = computed(() => Math.round(totalPoints.value / performances.length))
const growthRate = computed(() => 15.8)

const pointRules = [
  {
    name: '工单完成积分',
    type: '工单完成',
    basePoints: 10,
    qualityCoefficient: '0.8-1.2',
    efficiencyCoefficient: '0.8-1.2',
    difficultyCoefficient: '1.0-2.0',
    description: '按时完成工单获得的基础积分'
  },
  {
    name: '质量奖励积分',
    type: '质量奖励',
    basePoints: 5,
    qualityCoefficient: '1.0-1.5',
    efficiencyCoefficient: '1.0',
    difficultyCoefficient: '1.0',
    description: '高质量完成工单的额外奖励积分'
  },
  {
    name: '效率奖励积分',
    type: '效率奖励',
    basePoints: 3,
    qualityCoefficient: '1.0',
    efficiencyCoefficient: '1.0-1.5',
    difficultyCoefficient: '1.0',
    description: '提前完成工单的效率奖励积分'
  },
  {
    name: '创新奖励积分',
    type: '创新奖励',
    basePoints: 20,
    qualityCoefficient: '1.0',
    efficiencyCoefficient: '1.0',
    difficultyCoefficient: '1.0',
    description: '提出创新建议并被采纳的奖励积分'
  }
]

const getPerformanceType = (level: string) => {
  const typeMap: Record<string, any> = {
    '优秀': 'success',
    '良好': 'primary',
    '合格': 'info',
    '不合格': 'danger'
  }
  return typeMap[level] || 'info'
}

const getProgressColor = (percentage: number) => {
  if (percentage >= 90) return '#67c23a'
  if (percentage >= 70) return '#e6a23c'
  return '#f56c6c'
}

const handleRefresh = () => {
  ElMessage.success('刷新成功')
}

const handleSearch = () => {
  ElMessage.success('查询成功')
}

const handleReset = () => {
  searchForm.value = {
    name: '',
    department: '',
    dateRange: []
  }
}

const handleDetail = (row: any) => {
  currentPerformance.value = row
  detailDialogVisible.value = true
}

const handleHistory = (row: any) => {
  console.log('查看历史积分', row)
}

const handleAddRule = () => {
  console.log('新增规则')
}

const handleEditRule = (row: any) => {
  console.log('编辑规则', row)
}

const handleDeleteRule = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除规则"${row.name}"吗？`,
    '删除规则',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style scoped>
.performance-points {
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

.points-card {
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  color: #fff;
}

.points-card.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.points-card.monthly {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.points-card.average {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.points-card.growth {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.points-icon {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 12px;
  opacity: 0.8;
}

.points-value {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 8px;
}

.points-label {
  font-size: 14px;
  opacity: 0.9;
}
</style>
