<template>
  <div class="analysis-report">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>报表生成</span>
              <el-button type="primary" size="small" @click="handleCreateReport">创建报表</el-button>
            </div>
          </template>

          <el-tabs v-model="activeTab">
            <el-tab-pane label="标准报表" name="standard">
              <el-row :gutter="20">
                <el-col :span="6" v-for="(report, index) in standardReports" :key="index">
                  <div class="report-card" @click="handleViewReport(report)">
                    <div class="report-icon" :style="{ background: report.color }">
                      <el-icon :size="32"><component :is="report.icon" /></el-icon>
                    </div>
                    <div class="report-title">{{ report.title }}</div>
                    <div class="report-desc">{{ report.description }}</div>
                    <div class="report-meta">
                      <span>{{ report.frequency }}</span>
                      <span>{{ report.format }}</span>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>

            <el-tab-pane label="自定义报表" name="custom">
              <el-form :model="searchForm" :inline="true">
                <el-form-item label="报表名称">
                  <el-input v-model="searchForm.name" placeholder="请输入报表名称" clearable />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleSearch">查询</el-button>
                  <el-button @click="handleCreateCustomReport">新建报表</el-button>
                </el-form-item>
              </el-form>

              <el-table :data="customReports" stripe border>
                <el-table-column prop="name" label="报表名称" />
                <el-table-column prop="type" label="报表类型" width="120" />
                <el-table-column prop="creator" label="创建人" width="120" />
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column prop="lastUpdateTime" label="最后更新" width="180" />
                <el-table-column label="操作" width="250">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" @click="handleGenerate(row)">生成</el-button>
                    <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
                    <el-button type="primary" link size="small" @click="handleDelete(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="报表历史" name="history">
              <el-form :model="historyForm" :inline="true">
                <el-form-item label="报表类型">
                  <el-select v-model="historyForm.type" placeholder="请选择报表类型" clearable>
                    <el-option label="全部" value="" />
                    <el-option label="日报" value="日报" />
                    <el-option label="周报" value="周报" />
                    <el-option label="月报" value="月报" />
                    <el-option label="季报" value="季报" />
                    <el-option label="年报" value="年报" />
                  </el-select>
                </el-form-item>
                <el-form-item label="生成时间">
                  <el-date-picker
                    v-model="historyForm.dateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleSearchHistory">查询</el-button>
                </el-form-item>
              </el-form>

              <el-table :data="reportHistory" stripe border>
                <el-table-column prop="name" label="报表名称" />
                <el-table-column prop="type" label="报表类型" width="100" />
                <el-table-column prop="format" label="格式" width="100" />
                <el-table-column prop="creator" label="创建人" width="120" />
                <el-table-column prop="createTime" label="生成时间" width="180" />
                <el-table-column prop="fileSize" label="文件大小" width="120" />
                <el-table-column label="操作" width="200">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" @click="handleDownload(row)">下载</el-button>
                    <el-button type="primary" link size="small" @click="handlePreview(row)">预览</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="createDialogVisible" title="创建报表" width="800px">
      <el-form :model="createForm" label-width="120px">
        <el-form-item label="报表名称">
          <el-input v-model="createForm.name" placeholder="请输入报表名称" />
        </el-form-item>
        <el-form-item label="报表类型">
          <el-select v-model="createForm.type" placeholder="请选择报表类型">
            <el-option label="日报" value="日报" />
            <el-option label="周报" value="周报" />
            <el-option label="月报" value="月报" />
            <el-option label="季报" value="季报" />
            <el-option label="年报" value="年报" />
            <el-option label="专项报表" value="专项报表" />
          </el-select>
        </el-form-item>
        <el-form-item label="统计维度">
          <el-checkbox-group v-model="createForm.dimensions">
            <el-checkbox label="时间维度" />
            <el-checkbox label="组织维度" />
            <el-checkbox label="业务维度" />
            <el-checkbox label="状态维度" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="统计指标">
          <el-checkbox-group v-model="createForm.indicators">
            <el-checkbox label="工单总数" />
            <el-checkbox label="完成数" />
            <el-checkbox label="超期数" />
            <el-checkbox label="完成率" />
            <el-checkbox label="平均处理时长" />
            <el-checkbox label="一次验收通过率" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="筛选条件">
          <el-input v-model="createForm.filter" type="textarea" :rows="3" placeholder="请输入筛选条件" />
        </el-form-item>
        <el-form-item label="导出格式">
          <el-radio-group v-model="createForm.format">
            <el-radio label="Excel">Excel</el-radio>
            <el-radio label="PDF">PDF</el-radio>
            <el-radio label="Word">Word</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="定时推送">
          <el-switch v-model="createForm.autoPush" />
        </el-form-item>
        <el-form-item label="推送时间" v-if="createForm.autoPush">
          <el-time-picker
            v-model="createForm.pushTime"
            placeholder="请选择推送时间"
          />
        </el-form-item>
        <el-form-item label="推送对象" v-if="createForm.autoPush">
          <el-select v-model="createForm.pushTargets" multiple placeholder="请选择推送对象">
            <el-option label="张三" value="张三" />
            <el-option label="李四" value="李四" />
            <el-option label="王五" value="王五" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveReport">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="previewDialogVisible" title="报表预览" width="1000px">
      <div class="report-preview">
        <div class="report-header">
          <h2>{{ currentReport.name }}</h2>
          <p>生成时间：{{ currentReport.createTime }}</p>
        </div>
        <div class="report-content">
          <el-table :data="previewData" stripe border>
            <el-table-column prop="date" label="日期" width="120" />
            <el-table-column prop="department" label="部门" width="120" />
            <el-table-column prop="total" label="工单总数" width="100" />
            <el-table-column prop="completed" label="完成数" width="100" />
            <el-table-column prop="overdue" label="超期数" width="100" />
            <el-table-column label="完成率" width="120">
              <template #default="{ row }">
                {{ ((row.completed / row.total) * 100).toFixed(1) }}%
              </template>
            </el-table-column>
            <el-table-column prop="avgTime" label="平均时长" width="120" />
            <el-table-column prop="passRate" label="通过率" width="120">
              <template #default="{ row }">
                {{ row.passRate }}%
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <el-button @click="previewDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleDownloadReport">下载</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, DataLine, TrendCharts, PieChart } from '@element-plus/icons-vue'

const activeTab = ref('standard')
const createDialogVisible = ref(false)
const previewDialogVisible = ref(false)
const currentReport = ref<any>({})

const searchForm = ref({
  name: ''
})

const historyForm = ref({
  type: '',
  dateRange: []
})

const createForm = ref({
  name: '',
  type: '',
  dimensions: [],
  indicators: [],
  filter: '',
  format: 'Excel',
  autoPush: false,
  pushTime: '',
  pushTargets: []
})

const standardReports = [
  {
    title: '工单统计日报',
    description: '每日工单统计情况',
    frequency: '每日',
    format: 'Excel/PDF',
    icon: Document,
    color: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)'
  },
  {
    title: '部门工作周报',
    description: '各部门工作情况汇总',
    frequency: '每周',
    format: 'Excel/PDF',
    icon: DataLine,
    color: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)'
  },
  {
    title: '绩效考核月报',
    description: '月度绩效考核报告',
    frequency: '每月',
    format: 'Excel/PDF',
    icon: TrendCharts,
    color: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)'
  },
  {
    title: '季度业务分析',
    description: '季度业务趋势分析',
    frequency: '每季度',
    format: 'Excel/PDF',
    icon: PieChart,
    color: 'linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%)'
  }
]

const customReports = [
  {
    name: '安监部工单分析报表',
    type: '专项报表',
    creator: '李四',
    createTime: '2026-03-10 10:00:00',
    lastUpdateTime: '2026-03-11 15:30:00'
  },
  {
    name: '营销部客户服务报表',
    type: '专项报表',
    creator: '周八',
    createTime: '2026-03-08 09:00:00',
    lastUpdateTime: '2026-03-09 14:20:00'
  },
  {
    name: '配电部设备运维报表',
    type: '专项报表',
    creator: '赵六',
    createTime: '2026-03-05 11:00:00',
    lastUpdateTime: '2026-03-06 16:40:00'
  }
]

const reportHistory = [
  {
    name: '工单统计日报',
    type: '日报',
    format: 'Excel',
    creator: '系统',
    createTime: '2026-03-12 08:00:00',
    fileSize: '2.5MB'
  },
  {
    name: '部门工作周报',
    type: '周报',
    format: 'PDF',
    creator: '系统',
    createTime: '2026-03-11 08:00:00',
    fileSize: '5.8MB'
  },
  {
    name: '绩效考核月报',
    type: '月报',
    format: 'Excel',
    creator: '系统',
    createTime: '2026-03-01 08:00:00',
    fileSize: '8.2MB'
  }
]

const previewData = [
  {
    date: '2026-03-12',
    department: '安监部',
    total: 28,
    completed: 22,
    overdue: 3,
    avgTime: '72.3小时',
    passRate: 85.7
  },
  {
    date: '2026-03-12',
    department: '营销部',
    total: 35,
    completed: 28,
    overdue: 4,
    avgTime: '68.5小时',
    passRate: 89.3
  },
  {
    date: '2026-03-12',
    department: '配电部',
    total: 32,
    completed: 24,
    overdue: 5,
    avgTime: '82.1小时',
    passRate: 84.4
  }
]

const handleCreateReport = () => {
  createDialogVisible.value = true
}

const handleViewReport = (report: any) => {
  currentReport.value = {
    name: report.title,
    createTime: new Date().toLocaleString()
  }
  previewDialogVisible.value = true
}

const handleCreateCustomReport = () => {
  createDialogVisible.value = true
}

const handleSearch = () => {
  ElMessage.success('查询成功')
}

const handleGenerate = (row: any) => {
  ElMessage.success(`正在生成报表"${row.name}"`)
}

const handleEdit = (row: any) => {
  console.log('编辑报表', row)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除报表"${row.name}"吗？`,
    '删除报表',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleSearchHistory = () => {
  ElMessage.success('查询成功')
}

const handleDownload = (row: any) => {
  ElMessage.success(`正在下载"${row.name}"`)
}

const handlePreview = (row: any) => {
  currentReport.value = row
  previewDialogVisible.value = true
}

const handleSaveReport = () => {
  ElMessage.success('报表保存成功')
  createDialogVisible.value = false
}

const handleDownloadReport = () => {
  ElMessage.success('正在下载报表')
}
</script>

<style scoped>
.analysis-report {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.report-card {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
}

.report-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.report-icon {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: #fff;
}

.report-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.report-desc {
  font-size: 14px;
  color: #909399;
  margin-bottom: 12px;
}

.report-meta {
  display: flex;
  justify-content: center;
  gap: 16px;
  font-size: 12px;
  color: #c0c4cc;
}

.report-preview {
  padding: 20px;
}

.report-header {
  text-align: center;
  margin-bottom: 30px;
}

.report-header h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #303133;
}

.report-header p {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.report-content {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
}
</style>
