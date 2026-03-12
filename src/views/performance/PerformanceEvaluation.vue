<template>
  <div class="performance-evaluation">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>绩效评估</span>
              <el-button type="primary" size="small" @click="handleStartEvaluation">开始评估</el-button>
            </div>
          </template>

          <el-tabs v-model="activeTab">
            <el-tab-pane label="考核模型" name="model">
              <el-card>
                <template #header>
                  <span>考核维度配置</span>
                  <el-button type="primary" size="small" @click="handleEditModel">编辑模型</el-button>
                </template>
                <el-row :gutter="20">
                  <el-col :span="12" v-for="(dimension, index) in dimensions" :key="index">
                    <div class="dimension-card">
                      <div class="dimension-header">
                        <span class="dimension-name">{{ dimension.name }}</span>
                        <el-tag :type="dimension.type === 'quantitative' ? 'primary' : 'warning'" size="small">
                          {{ dimension.type === 'quantitative' ? '量化' : '定性' }}
                        </el-tag>
                      </div>
                      <div class="dimension-weight">权重：{{ dimension.weight }}%</div>
                      <div class="dimension-desc">{{ dimension.description }}</div>
                      <div class="dimension-indicators">
                        <div class="indicator-item" v-for="(indicator, idx) in dimension.indicators" :key="idx">
                          <span class="indicator-name">{{ indicator.name }}</span>
                          <span class="indicator-score">{{ indicator.score }}分</span>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </el-card>
            </el-tab-pane>

            <el-tab-pane label="量化评估" name="quantitative">
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
                <el-form-item>
                  <el-button type="primary" @click="handleSearch">查询</el-button>
                  <el-button @click="handleReset">重置</el-button>
                </el-form-item>
              </el-form>

              <el-table :data="performances" stripe border>
                <el-table-column prop="employeeName" label="员工姓名" width="120" />
                <el-table-column prop="department" label="部门" width="100" />
                <el-table-column label="工作数量" width="120">
                  <template #default="{ row }">
                    <div class="score-item">
                      <span class="score-value">{{ row.workOrderCount }}个</span>
                      <el-rate v-model="row.quantityScore" disabled show-score />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="工作质量" width="120">
                  <template #default="{ row }">
                    <div class="score-item">
                      <span class="score-value">{{ row.qualityRate }}%</span>
                      <el-rate v-model="row.qualityScore" disabled show-score />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="工作效率" width="120">
                  <template #default="{ row }">
                    <div class="score-item">
                      <span class="score-value">{{ row.timelinessRate }}%</span>
                      <el-rate v-model="row.efficiencyScore" disabled show-score />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="工作态度" width="120">
                  <template #default="{ row }">
                    <div class="score-item">
                      <el-rate v-model="row.attitudeScore" disabled show-score />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="团队协作" width="120">
                  <template #default="{ row }">
                    <div class="score-item">
                      <el-rate v-model="row.teamworkScore" disabled show-score />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="综合得分" width="120">
                  <template #default="{ row }">
                    <span class="total-score">{{ calculateTotalScore(row) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="绩效等级" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getPerformanceType(row.performanceLevel)" size="small">
                      {{ row.performanceLevel }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" @click="handleEvaluate(row)">评估</el-button>
                    <el-button type="primary" link size="small" @click="handleView(row)">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="结果应用" name="application">
              <el-row :gutter="20" class="mb-20">
                <el-col :span="6">
                  <div class="level-card excellent">
                    <div class="level-icon">★</div>
                    <div class="level-title">优秀</div>
                    <div class="level-count">{{ getLevelCount('优秀') }}人</div>
                    <div class="level-coefficient">系数：1.2</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="level-card good">
                    <div class="level-icon">★★</div>
                    <div class="level-title">良好</div>
                    <div class="level-count">{{ getLevelCount('良好') }}人</div>
                    <div class="level-coefficient">系数：1.1</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="level-card qualified">
                    <div class="level-icon">★★★</div>
                    <div class="level-title">合格</div>
                    <div class="level-count">{{ getLevelCount('合格') }}人</div>
                    <div class="level-coefficient">系数：1.0</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="level-card unqualified">
                    <div class="level-icon">★★★★</div>
                    <div class="level-title">不合格</div>
                    <div class="level-count">{{ getLevelCount('不合格') }}人</div>
                    <div class="level-coefficient">系数：0.8</div>
                  </div>
                </el-col>
              </el-row>

              <el-card>
                <template #header>
                  <span>绩效结果应用</span>
                </template>
                <el-table :data="performances" stripe border>
                  <el-table-column prop="employeeName" label="员工姓名" width="120" />
                  <el-table-column prop="department" label="部门" width="100" />
                  <el-table-column label="绩效等级" width="100">
                    <template #default="{ row }">
                      <el-tag :type="getPerformanceType(row.performanceLevel)" size="small">
                        {{ row.performanceLevel }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="performanceCoefficient" label="绩效系数" width="100" />
                  <el-table-column label="基础绩效工资" width="120">
                    <template #default="{ row }">
                      ¥{{ row.baseSalary || 5000 }}
                    </template>
                  </el-table-column>
                  <el-table-column label="绩效工资" width="120">
                    <template #default="{ row }">
                      ¥{{ calculatePerformanceSalary(row) }}
                    </template>
                  </el-table-column>
                  <el-table-column label="总收入" width="120">
                    <template #default="{ row }">
                      ¥{{ calculateTotalSalary(row) }}
                    </template>
                  </el-table-column>
                  <el-table-column label="晋升建议" width="120">
                    <template #default="{ row }">
                      <el-tag :type="getPromotionType(row.performanceLevel)" size="small">
                        {{ getPromotionSuggestion(row.performanceLevel) }}
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="evaluateDialogVisible" title="绩效评估" width="800px">
      <el-form :model="evaluateForm" label-width="120px">
        <el-form-item label="员工姓名">
          <el-input v-model="evaluateForm.name" disabled />
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="evaluateForm.department" disabled />
        </el-form-item>

        <el-divider>量化指标</el-divider>
        <el-form-item label="工作数量">
          <el-rate v-model="evaluateForm.quantityScore" show-score />
        </el-form-item>
        <el-form-item label="工作质量">
          <el-rate v-model="evaluateForm.qualityScore" show-score />
        </el-form-item>
        <el-form-item label="工作效率">
          <el-rate v-model="evaluateForm.efficiencyScore" show-score />
        </el-form-item>

        <el-divider>定性指标</el-divider>
        <el-form-item label="工作态度">
          <el-rate v-model="evaluateForm.attitudeScore" show-score />
        </el-form-item>
        <el-form-item label="团队协作">
          <el-rate v-model="evaluateForm.teamworkScore" show-score />
        </el-form-item>

        <el-divider>评估意见</el-divider>
        <el-form-item label="综合评价">
          <el-input v-model="evaluateForm.comment" type="textarea" :rows="4" placeholder="请输入综合评价" />
        </el-form-item>
        <el-form-item label="改进建议">
          <el-input v-model="evaluateForm.suggestion" type="textarea" :rows="3" placeholder="请输入改进建议" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="evaluateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveEvaluation">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { performances } from '@/data/performances'

const activeTab = ref('model')
const evaluateDialogVisible = ref(false)

const searchForm = ref({
  name: '',
  department: ''
})

const evaluateForm = ref({
  name: '',
  department: '',
  quantityScore: 0,
  qualityScore: 0,
  efficiencyScore: 0,
  attitudeScore: 0,
  teamworkScore: 0,
  comment: '',
  suggestion: ''
})

const dimensions = [
  {
    name: '工作数量',
    type: 'quantitative',
    weight: 25,
    description: '完成工单的数量和工作量',
    indicators: [
      { name: '工单完成数', score: 25 },
      { name: '工作量', score: 25 }
    ]
  },
  {
    name: '工作质量',
    type: 'quantitative',
    weight: 30,
    description: '工单执行质量和验收通过率',
    indicators: [
      { name: '一次验收通过率', score: 30 },
      { name: '返工率', score: 20 },
      { name: '材料完整性', score: 25 }
    ]
  },
  {
    name: '工作效率',
    type: 'quantitative',
    weight: 20,
    description: '工单处理效率和及时率',
    indicators: [
      { name: '按时完成率', score: 30 },
      { name: '平均处理时长', score: 25 }
    ]
  },
  {
    name: '工作态度',
    type: 'qualitative',
    weight: 15,
    description: '工作积极性和责任心',
    indicators: [
      { name: '积极性', score: 25 },
      { name: '责任心', score: 25 }
    ]
  },
  {
    name: '团队协作',
    type: 'qualitative',
    weight: 10,
    description: '与同事的协作配合',
    indicators: [
      { name: '协作能力', score: 25 },
      { name: '团队贡献', score: 25 }
    ]
  }
]

const getLevelCount = (level: string) => {
  return performances.filter(item => item.performanceLevel === level).length
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

const getPromotionType = (level: string) => {
  const typeMap: Record<string, any> = {
    '优秀': 'success',
    '良好': 'primary',
    '合格': 'info',
    '不合格': 'danger'
  }
  return typeMap[level] || 'info'
}

const getPromotionSuggestion = (level: string) => {
  const suggestionMap: Record<string, string> = {
    '优秀': '优先晋升',
    '良好': '可晋升',
    '合格': '保持现状',
    '不合格': '岗位调整'
  }
  return suggestionMap[level] || '保持现状'
}

const calculateTotalScore = (row: any) => {
  const quantityScore = row.quantityScore || 4
  const qualityScore = row.qualityScore || 4
  const efficiencyScore = row.efficiencyScore || 4
  const attitudeScore = row.attitudeScore || 4
  const teamworkScore = row.teamworkScore || 4

  return (quantityScore * 0.25 + qualityScore * 0.3 + efficiencyScore * 0.2 + attitudeScore * 0.15 + teamworkScore * 0.1).toFixed(2)
}

const calculatePerformanceSalary = (row: any) => {
  const baseSalary = row.baseSalary || 5000
  return Math.round(baseSalary * row.performanceCoefficient)
}

const calculateTotalSalary = (row: any) => {
  const baseSalary = row.baseSalary || 5000
  return Math.round(baseSalary * row.performanceCoefficient + baseSalary)
}

const handleStartEvaluation = () => {
  ElMessage.success('评估流程已启动')
}

const handleEditModel = () => {
  console.log('编辑考核模型')
}

const handleSearch = () => {
  ElMessage.success('查询成功')
}

const handleReset = () => {
  searchForm.value = {
    name: '',
    department: ''
  }
}

const handleEvaluate = (row: any) => {
  evaluateForm.value = {
    name: row.employeeName,
    department: row.department,
    quantityScore: row.quantityScore || 4,
    qualityScore: row.qualityScore || 4,
    efficiencyScore: row.efficiencyScore || 4,
    attitudeScore: row.attitudeScore || 4,
    teamworkScore: row.teamworkScore || 4,
    comment: '',
    suggestion: ''
  }
  evaluateDialogVisible.value = true
}

const handleView = (row: any) => {
  console.log('查看详情', row)
}

const handleSaveEvaluation = () => {
  ElMessage.success('评估保存成功')
  evaluateDialogVisible.value = false
}
</script>

<style scoped>
.performance-evaluation {
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

.dimension-card {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.dimension-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.dimension-name {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.dimension-weight {
  font-size: 14px;
  color: #409eff;
  margin-bottom: 8px;
}

.dimension-desc {
  font-size: 13px;
  color: #909399;
  margin-bottom: 12px;
}

.dimension-indicators {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.indicator-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
}

.indicator-name {
  color: #606266;
}

.indicator-score {
  color: #409eff;
  font-weight: bold;
}

.score-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.score-value {
  font-size: 14px;
  color: #606266;
}

.total-score {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}

.level-card {
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  color: #fff;
}

.level-card.excellent {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.level-card.good {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.level-card.qualified {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.level-card.unqualified {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.level-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.level-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.level-count {
  font-size: 16px;
  margin-bottom: 4px;
  opacity: 0.9;
}

.level-coefficient {
  font-size: 14px;
  opacity: 0.8;
}
</style>
