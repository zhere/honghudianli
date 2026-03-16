<template>
  <div class="workorder-check">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>督办核查</span>
          <el-button type="primary" size="small" @click="$router.back()">返回</el-button>
        </div>
      </template>

      <el-table :data="completedWorkOrders" stripe border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="工单编号" width="150" />
        <el-table-column prop="title" label="工单标题" width="250" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="responsiblePerson" label="责任人" width="100" />
        <el-table-column label="自动核查" width="100">
          <template #default="{ row }">
            <el-tag :type="getAutoCheckType(row.autoCheckResult)" size="small">
              {{ getAutoCheckText(row.autoCheckResult) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="completeTime" label="完成时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleCheck(row)">核查</el-button>
            <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="checkDialogVisible" title="工单核查" width="1200px">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="自动核查结果" name="auto">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="工单编号">{{ currentWorkOrder.id }}</el-descriptions-item>
            <el-descriptions-item label="工单标题">{{ currentWorkOrder.title }}</el-descriptions-item>
            <el-descriptions-item label="核查时间">{{ currentWorkOrder.autoCheckResult.checkTime }}</el-descriptions-item>
          </el-descriptions>

          <el-divider>核查详情</el-divider>

          <el-row :gutter="20" class="check-items">
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>时效性核查</span>
                  <el-tag :type="currentWorkOrder.autoCheckResult.timeliness ? 'success' : 'danger'" size="small">
                    {{ currentWorkOrder.autoCheckResult.timeliness ? '通过' : '不通过' }}
                  </el-tag>
                </template>
                <ul>
                  <li>创建时效：{{ currentWorkOrder.autoCheckResult.timeliness ? '✓ 通过' : '✗ 不通过' }}</li>
                  <li>执行时效：{{ currentWorkOrder.autoCheckResult.timeliness ? '✓ 通过' : '✗ 不通过' }}</li>
                  <li>核查时效：{{ currentWorkOrder.autoCheckResult.timeliness ? '✓ 通过' : '✗ 不通过' }}</li>
                </ul>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>完整性核查</span>
                  <el-tag :type="currentWorkOrder.autoCheckResult.completeness ? 'success' : 'danger'" size="small">
                    {{ currentWorkOrder.autoCheckResult.completeness ? '通过' : '不通过' }}
                  </el-tag>
                </template>
                <ul>
                  <li>材料完整性：{{ currentWorkOrder.autoCheckResult.completeness ? '✓ 通过' : '✗ 不通过' }}</li>
                  <li>信息完整性：{{ currentWorkOrder.autoCheckResult.completeness ? '✓ 通过' : '✗ 不通过' }}</li>
                </ul>
              </el-card>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="mt-20">
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>质量核查</span>
                  <el-tag :type="currentWorkOrder.autoCheckResult.quality ? 'success' : 'danger'" size="small">
                    {{ currentWorkOrder.autoCheckResult.quality ? '通过' : '不通过' }}
                  </el-tag>
                </template>
                <ul>
                  <li>照片质量：{{ currentWorkOrder.autoCheckResult.quality ? '✓ 通过' : '✗ 不通过' }}</li>
                  <li>视频质量：{{ currentWorkOrder.autoCheckResult.quality ? '✓ 通过' : '✗ 不通过' }}</li>
                </ul>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>数据一致性核查</span>
                  <el-tag :type="currentWorkOrder.autoCheckResult.dataConsistency ? 'success' : 'danger'" size="small">
                    {{ currentWorkOrder.autoCheckResult.dataConsistency ? '通过' : '不通过' }}
                  </el-tag>
                </template>
                <ul>
                  <li>指标改善：{{ currentWorkOrder.autoCheckResult.dataConsistency ? '✓ 通过' : '✗ 不通过' }}</li>
                  <li>业务数据：{{ currentWorkOrder.autoCheckResult.dataConsistency ? '✓ 通过' : '✗ 不通过' }}</li>
                </ul>
              </el-card>
            </el-col>
          </el-row>

          <el-divider>核查说明</el-divider>
          <div v-for="(item, index) in currentWorkOrder.autoCheckResult.details" :key="index" class="check-detail">
            {{ item }}
          </div>
        </el-tab-pane>

        <el-tab-pane label="人工核查" name="manual">
          <el-form :model="checkForm" label-width="140px">
            <el-form-item label="工单编号">
              <el-input v-model="checkForm.id" disabled />
            </el-form-item>
            <el-form-item label="工单标题">
              <el-input v-model="checkForm.title" disabled />
            </el-form-item>

            <el-divider>材料真实性核查</el-divider>
            <el-form-item label="照片视频真实性">
              <el-radio-group v-model="checkForm.materialAuthenticity">
                <el-radio :label="true">真实</el-radio>
                <el-radio :label="false">不真实</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="签字确认真实性">
              <el-radio-group v-model="checkForm.signatureAuthenticity">
                <el-radio :label="true">真实</el-radio>
                <el-radio :label="false">不真实</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-divider>执行完整性核查</el-divider>
            <el-form-item label="任务完成度">
              <el-radio-group v-model="checkForm.taskCompleteness">
                <el-radio :label="true">完成</el-radio>
                <el-radio :label="false">未完成</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="标准执行度">
              <el-radio-group v-model="checkForm.standardExecution">
                <el-radio :label="true">符合</el-radio>
                <el-radio :label="false">不符合</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-divider>结果有效性核查</el-divider>
            <el-form-item label="整改效果">
              <el-radio-group v-model="checkForm.resultEffectiveness">
                <el-radio :label="true">有效</el-radio>
                <el-radio :label="false">无效</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="持续有效性">
              <el-radio-group v-model="checkForm.sustainedEffectiveness">
                <el-radio :label="true">有效</el-radio>
                <el-radio :label="false">无效</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-divider>核查结论</el-divider>
            <el-form-item label="核查结论">
              <el-radio-group v-model="checkForm.conclusion">
                <el-radio label="通过">通过</el-radio>
                <el-radio label="不通过">不通过</el-radio>
                <el-radio label="需要补充材料">需要补充材料</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="核查意见">
              <el-input v-model="checkForm.checkComment" type="textarea" :rows="4" placeholder="请输入核查意见" />
            </el-form-item>
            <el-form-item label="整改要求" v-if="checkForm.conclusion !== '通过'">
              <el-input v-model="checkForm.rectificationRequirement" type="textarea" :rows="3" placeholder="请输入整改要求" />
            </el-form-item>
            <el-form-item label="整改时限" v-if="checkForm.conclusion !== '通过'">
              <el-date-picker
                v-model="checkForm.rectificationDeadline"
                type="datetime"
                placeholder="请选择整改时限"
                style="width: 100%"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <el-button @click="checkDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmCheck">确认核查</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailDialogVisible" title="工单详情" width="1000px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="工单编号">{{ currentWorkOrder.id }}</el-descriptions-item>
        <el-descriptions-item label="工单标题">{{ currentWorkOrder.title }}</el-descriptions-item>
        <el-descriptions-item label="工单类型">{{ currentWorkOrder.type }}</el-descriptions-item>
        <el-descriptions-item label="责任人">{{ currentWorkOrder.responsiblePerson }}</el-descriptions-item>
        <el-descriptions-item label="执行结果" :span="2">{{ currentWorkOrder.executionResult }}</el-descriptions-item>
        <el-descriptions-item label="完成时间" :span="2">{{ currentWorkOrder.completeTime }}</el-descriptions-item>
      </el-descriptions>

      <el-divider v-if="currentWorkOrder.materials && currentWorkOrder.materials.length > 0">佐证材料</el-divider>
      <el-table v-if="currentWorkOrder.materials && currentWorkOrder.materials.length > 0" :data="currentWorkOrder.materials" stripe border>
        <el-table-column prop="name" label="材料名称" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            {{ getMaterialTypeText(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="uploader" label="上传人" width="120" />
        <el-table-column prop="uploadTime" label="上传时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'approved' ? 'success' : row.status === 'rejected' ? 'danger' : 'warning'" size="small">
              {{ row.status === 'approved' ? '已通过' : row.status === 'rejected' ? '已拒绝' : '待审核' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { workOrders } from '@/data/workOrders'

const completedWorkOrders = computed(() => workOrders.filter(item => item.status === '已完成'))

const selectedWorkOrders = ref<any[]>([])
const checkDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const currentWorkOrder = ref<any>({})
const activeTab = ref('auto')

const checkForm = ref({
  id: '',
  title: '',
  materialAuthenticity: true,
  signatureAuthenticity: true,
  taskCompleteness: true,
  standardExecution: true,
  resultEffectiveness: true,
  sustainedEffectiveness: true,
  conclusion: '通过',
  checkComment: '',
  rectificationRequirement: '',
  rectificationDeadline: ''
})

const getAutoCheckType = (result: any) => {
  if (result.timeliness && result.completeness && result.quality && result.dataConsistency) {
    return 'success'
  }
  return 'danger'
}

const getAutoCheckText = (result: any) => {
  if (result.timeliness && result.completeness && result.quality && result.dataConsistency) {
    return '全部通过'
  }
  return '存在不通过项'
}

const getMaterialTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    'photo': '照片',
    'video': '视频',
    'document': '文档',
    'audio': '音频'
  }
  return typeMap[type] || '其他'
}

const handleSelectionChange = (selection: any[]) => {
  selectedWorkOrders.value = selection
}

const handleCheck = (row: any) => {
  currentWorkOrder.value = row
  checkForm.value = {
    id: row.id,
    title: row.title,
    materialAuthenticity: true,
    signatureAuthenticity: true,
    taskCompleteness: true,
    standardExecution: true,
    resultEffectiveness: true,
    sustainedEffectiveness: true,
    conclusion: '通过',
    checkComment: '',
    rectificationRequirement: '',
    rectificationDeadline: ''
  }
  checkDialogVisible.value = true
}

const handleConfirmCheck = () => {
  ElMessage.success('核查完成')
  checkDialogVisible.value = false
}

const handleView = (row: any) => {
  currentWorkOrder.value = row
  detailDialogVisible.value = true
}
</script>

<style scoped>
.workorder-check {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.check-items ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.check-items li {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.check-items li:last-child {
  border-bottom: none;
}

.mt-20 {
  margin-top: 20px;
}

.check-detail {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 10px;
}
</style>
