<template>
  <div class="indicator-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>指标列表</span>
          <el-button type="primary" size="small" @click="handleAdd">新增指标</el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="指标名称">
          <el-input v-model="searchForm.name" placeholder="请输入指标名称" clearable />
        </el-form-item>
        <el-form-item label="所属部门">
          <el-select v-model="searchForm.department" placeholder="请选择部门" clearable>
            <el-option label="全部" value="" />
            <el-option label="安监部" value="安监部" />
            <el-option label="营销部" value="营销部" />
            <el-option label="配电部" value="配电部" />
            <el-option label="供指中心" value="供指中心" />
            <el-option label="运检部" value="运检部" />
          </el-select>
        </el-form-item>
        <el-form-item label="指标状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="全部" value="" />
            <el-option label="正常" value="normal" />
            <el-option label="预警" value="warning" />
            <el-option label="危险" value="danger" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="filteredIndicators" stripe border>
        <el-table-column prop="code" label="指标编码" width="120" />
        <el-table-column prop="name" label="指标名称" width="180" />
        <el-table-column prop="level" label="指标级别" width="100">
          <template #default="{ row }">
            <el-tag :type="row.level === '一级' ? 'danger' : row.level === '二级' ? 'warning' : 'info'" size="small">
              {{ row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="所属部门" width="100" />
        <el-table-column prop="category" label="业务分类" width="150" />
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
              {{ row.yearOnYear > 0 ? '↑' : '↓' }} {{ Math.abs(row.yearOnYear) }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="monthOnMonth" label="环比" width="100">
          <template #default="{ row }">
            <span :style="{ color: row.monthOnMonth > 0 ? '#f56c6c' : '#67c23a' }">
              {{ row.monthOnMonth > 0 ? '↑' : '↓' }} {{ Math.abs(row.monthOnMonth) }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'normal' ? 'success' : row.status === 'warning' ? 'warning' : 'danger'" size="small">
              {{ row.status === 'normal' ? '正常' : row.status === 'warning' ? '预警' : '危险' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dataSource" label="数据来源" width="150" />
        <el-table-column prop="lastUpdateTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="primary" link size="small" @click="handleHistory(row)">历史</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        class="mt-20"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px">
      <el-form :model="formData" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="指标名称">
              <el-input v-model="formData.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="指标编码">
              <el-input v-model="formData.code" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="指标级别">
              <el-select v-model="formData.level">
                <el-option label="一级" value="一级" />
                <el-option label="二级" value="二级" />
                <el-option label="三级" value="三级" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门">
              <el-select v-model="formData.department">
                <el-option label="安监部" value="安监部" />
                <el-option label="营销部" value="营销部" />
                <el-option label="配电部" value="配电部" />
                <el-option label="供指中心" value="供指中心" />
                <el-option label="运检部" value="运检部" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="业务分类">
              <el-input v-model="formData.category" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据来源">
              <el-input v-model="formData.dataSource" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="目标值">
              <el-input-number v-model="formData.target" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位">
              <el-input v-model="formData.unit" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="计算公式">
          <el-input v-model="formData.formula" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { indicators } from '@/data/indicators'

const searchForm = ref({
  name: '',
  department: '',
  status: ''
})

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(indicators.length)

const dialogVisible = ref(false)
const dialogTitle = ref('新增指标')
const formData = ref({
  name: '',
  code: '',
  level: '二级',
  department: '安监部',
  category: '',
  dataSource: '',
  target: 0,
  unit: '',
  formula: ''
})

const filteredIndicators = computed(() => {
  let result = indicators

  if (searchForm.value.name) {
    result = result.filter(item => item.name.includes(searchForm.value.name))
  }

  if (searchForm.value.department) {
    result = result.filter(item => item.department === searchForm.value.department)
  }

  if (searchForm.value.status) {
    result = result.filter(item => item.status === searchForm.value.status)
  }

  return result
})

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchForm.value = {
    name: '',
    department: '',
    status: ''
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增指标'
  formData.value = {
    name: '',
    code: '',
    level: '二级',
    department: '安监部',
    category: '',
    dataSource: '',
    target: 0,
    unit: '',
    formula: ''
  }
  dialogVisible.value = true
}

const handleView = (row: any) => {
  console.log('查看指标', row)
}

const handleEdit = (row: any) => {
  dialogTitle.value = '编辑指标'
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleHistory = (row: any) => {
  console.log('查看历史数据', row)
}

const handleSave = () => {
  ElMessage.success('保存成功')
  dialogVisible.value = false
}
</script>

<style scoped>
.indicator-list {
  padding: 0;
}

.search-form {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mt-20 {
  margin-top: 20px;
}
</style>
