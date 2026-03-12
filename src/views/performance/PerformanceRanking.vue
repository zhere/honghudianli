<template>
  <div class="performance-ranking">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>绩效排名</span>
              <el-select v-model="rankingType" placeholder="请选择排名类型" style="width: 150px">
                <el-option label="个人排名" value="personal" />
                <el-option label="部门排名" value="department" />
              </el-select>
            </div>
          </template>

          <el-tabs v-model="activeTab">
            <el-tab-pane label="个人排名" name="personal">
              <el-row :gutter="20" class="mb-20">
                <el-col :span="8">
                  <div class="ranking-type-card">
                    <div class="ranking-icon">🏆</div>
                    <div class="ranking-title">总积分排名</div>
                    <div class="ranking-desc">按总积分从高到低排序</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="ranking-type-card">
                    <div class="ranking-icon">📈</div>
                    <div class="ranking-title">月度排名</div>
                    <div class="ranking-desc">按本月积分排序</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="ranking-type-card">
                    <div class="ranking-icon">🚀</div>
                    <div class="ranking-title">进步榜</div>
                    <div class="ranking-desc">积分增长最快</div>
                  </div>
                </el-col>
              </el-row>

              <el-table :data="performances" stripe border>
                <el-table-column label="排名" width="100">
                  <template #default="{ row }">
                    <div class="rank-badge" :class="getRankClass(row.rank)">
                      {{ row.rank }}
                    </div>
                  </template>
                </el-table-column>
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
                <el-table-column label="变化" width="100">
                  <template #default="{ row }">
                    <span :class="getChangeClass(row.change)">
                      {{ getChangeText(row.change) }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" @click="handleDetail(row)">详情</el-button>
                    <el-button type="primary" link size="small" @click="handleCompare(row)">对比</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="部门排名" name="department">
              <el-table :data="departmentPerformances" stripe border>
                <el-table-column label="排名" width="100">
                  <template #default="{ row }">
                    <div class="rank-badge" :class="getRankClass(row.rank)">
                      {{ row.rank }}
                    </div>
                  </template>
                </el-table-column>
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

            <el-tab-pane label="进步榜" name="progress">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card>
                    <template #header>
                      <span>积分增长TOP10</span>
                    </template>
                    <el-table :data="topGrowers" stripe border>
                      <el-table-column label="排名" width="80">
                        <template #default="{ row }">
                          <div class="rank-badge" :class="getRankClass(row.rank)">
                            {{ row.rank }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="employeeName" label="员工姓名" width="120" />
                      <el-table-column prop="department" label="部门" width="100" />
                      <el-table-column prop="growth" label="增长积分" width="120" sortable>
                        <template #default="{ row }">
                          <span style="color: #67c23a">+{{ row.growth }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="growthRate" label="增长率" width="120" sortable>
                        <template #default="{ row }">
                          <span style="color: #67c23a">+{{ row.growthRate }}%</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card>
                    <template #header>
                      <span>排名上升TOP10</span>
                    </template>
                    <el-table :data="topRisers" stripe border>
                      <el-table-column label="排名" width="80">
                        <template #default="{ row }">
                          <div class="rank-badge" :class="getRankClass(row.rank)">
                            {{ row.rank }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="employeeName" label="员工姓名" width="120" />
                      <el-table-column prop="department" label="部门" width="100" />
                      <el-table-column prop="rankChange" label="排名上升" width="120" sortable>
                        <template #default="{ row }">
                          <span style="color: #67c23a">↑{{ row.rankChange }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="currentRank" label="当前排名" width="120" />
                    </el-table>
                  </el-card>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="detailDialogVisible" title="绩效详情" width="1000px">
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
        <el-descriptions-item label="当前排名">{{ currentPerformance.rank }}</el-descriptions-item>
      </el-descriptions>

      <el-divider>绩效指标</el-divider>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="metric-card">
            <div class="metric-label">工单完成数</div>
            <div class="metric-value">{{ currentPerformance.workOrderCount }}个</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="metric-card">
            <div class="metric-label">完成率</div>
            <div class="metric-value">{{ currentPerformance.completionRate }}%</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="metric-card">
            <div class="metric-label">及时率</div>
            <div class="metric-value">{{ currentPerformance.timelinessRate }}%</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="metric-card">
            <div class="metric-label">质量率</div>
            <div class="metric-value">{{ currentPerformance.qualityRate }}%</div>
          </div>
        </el-col>
      </el-row>

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
import { ElMessage } from 'element-plus'
import { performances, departmentPerformances } from '@/data/performances'

const activeTab = ref('personal')
const rankingType = ref('personal')
const detailDialogVisible = ref(false)
const currentPerformance = ref<any>({})

const topGrowers = computed(() => {
  return performances
    .map(item => ({
      ...item,
      growth: Math.floor(Math.random() * 50) + 10,
      growthRate: (Math.random() * 20 + 5).toFixed(1)
    }))
    .sort((a, b) => b.growth - a.growth)
    .slice(0, 10)
    .map((item, index) => ({ ...item, rank: index + 1 }))
})

const topRisers = computed(() => {
  return performances
    .map(item => ({
      ...item,
      rankChange: Math.floor(Math.random() * 10) + 1,
      currentRank: item.rank
    }))
    .sort((a, b) => b.rankChange - a.rankChange)
    .slice(0, 10)
    .map((item, index) => ({ ...item, rank: index + 1 }))
})

const getRankClass = (rank: number) => {
  if (rank === 1) return 'rank-gold'
  if (rank === 2) return 'rank-silver'
  if (rank === 3) return 'rank-bronze'
  return ''
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

const getProgressColor = (percentage: number) => {
  if (percentage >= 90) return '#67c23a'
  if (percentage >= 70) return '#e6a23c'
  return '#f56c6c'
}

const getChangeClass = (change: number) => {
  if (change > 0) return 'change-up'
  if (change < 0) return 'change-down'
  return 'change-flat'
}

const getChangeText = (change: number) => {
  if (change > 0) return `↑${change}`
  if (change < 0) return `↓${Math.abs(change)}`
  return '-'
}

const handleDetail = (row: any) => {
  currentPerformance.value = row
  detailDialogVisible.value = true
}

const handleCompare = (row: any) => {
  console.log('对比绩效', row)
}
</script>

<style scoped>
.performance-ranking {
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

.ranking-type-card {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  text-align: center;
  color: #fff;
}

.ranking-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.ranking-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.ranking-desc {
  font-size: 14px;
  opacity: 0.9;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f0f0f0;
  color: #606266;
  font-weight: bold;
  font-size: 16px;
}

.rank-badge.rank-gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #fff;
}

.rank-badge.rank-silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #e0e0e0 100%);
  color: #fff;
}

.rank-badge.rank-bronze {
  background: linear-gradient(135deg, #cd7f32 0%, #e8a87c 100%);
  color: #fff;
}

.change-up {
  color: #67c23a;
  font-weight: bold;
}

.change-down {
  color: #f56c6c;
  font-weight: bold;
}

.change-flat {
  color: #909399;
}

.metric-card {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
  text-align: center;
}

.metric-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}
</style>
