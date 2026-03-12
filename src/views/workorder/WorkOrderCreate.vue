<template>
  <div class="workorder-create">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>创建工单</span>
          <el-button type="primary" size="small" @click="$router.back()">返回</el-button>
        </div>
      </template>

      <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-divider>基础信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工单标题" prop="title">
              <el-input v-model="formData.title" placeholder="请输入工单标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工单类型" prop="type">
              <el-select v-model="formData.type" placeholder="请选择工单类型">
                <el-option label="安监类" value="安监类" />
                <el-option label="营销类" value="营销类" />
                <el-option label="配电类" value="配电类" />
                <el-option label="供指类" value="供指类" />
                <el-option label="运检类" value="运检类" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="优先级" prop="priority">
              <el-select v-model="formData.priority" placeholder="请选择优先级">
                <el-option label="一般（黄色）" value="yellow" />
                <el-option label="严重（红色）" value="red" />
                <el-option label="特别严重（橙色）" value="orange" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门" prop="department">
              <el-select v-model="formData.department" placeholder="请选择所属部门">
                <el-option label="安监部" value="安监部" />
                <el-option label="营销部" value="营销部" />
                <el-option label="配电部" value="配电部" />
                <el-option label="供指中心" value="供指中心" />
                <el-option label="运检部" value="运检部" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider>任务信息</el-divider>
        <el-form-item label="任务描述" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="4" placeholder="请详细描述任务背景、具体要求等" />
        </el-form-item>
        <el-form-item label="执行标准" prop="executionStandard">
          <el-input v-model="formData.executionStandard" type="textarea" :rows="3" placeholder="请输入执行标准" />
        </el-form-item>
        <el-form-item label="验收标准" prop="acceptanceStandard">
          <el-input v-model="formData.acceptanceStandard" type="textarea" :rows="3" placeholder="请输入验收标准" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="完成时限" prop="completionDeadline">
              <el-date-picker
                v-model="formData.completionDeadline"
                type="datetime"
                placeholder="请选择完成时限"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider>分配信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="责任单位" prop="responsibilityUnit">
              <el-select v-model="formData.responsibilityUnit" placeholder="请选择责任单位">
                <el-option label="城区供电所" value="城区供电所" />
                <el-option label="城郊供电所" value="城郊供电所" />
                <el-option label="客户服务中心" value="客户服务中心" />
                <el-option label="检修班" value="检修班" />
                <el-option label="网格一" value="网格一" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任人" prop="responsiblePerson">
              <el-select v-model="formData.responsiblePerson" placeholder="请选择责任人">
                <el-option label="张三" value="张三" />
                <el-option label="王五" value="王五" />
                <el-option label="孙七" value="孙七" />
                <el-option label="吴九" value="吴九" />
                <el-option label="钱十一" value="钱十一" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="督办部门" prop="supervisorDepartment">
              <el-select v-model="formData.supervisorDepartment" placeholder="请选择督办部门">
                <el-option label="安监部" value="安监部" />
                <el-option label="营销部" value="营销部" />
                <el-option label="配电部" value="配电部" />
                <el-option label="供指中心" value="供指中心" />
                <el-option label="运检部" value="运检部" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="督办人" prop="supervisor">
              <el-select v-model="formData.supervisor" placeholder="请选择督办人">
                <el-option label="李四" value="李四" />
                <el-option label="赵六" value="赵六" />
                <el-option label="周八" value="周八" />
                <el-option label="郑十" value="郑十" />
                <el-option label="孙十二" value="孙十二" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交工单</el-button>
          <el-button @click="handleSaveDraft">保存草稿</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const formRef = ref()

const formData = ref({
  title: '',
  type: '',
  priority: '',
  department: '',
  description: '',
  executionStandard: '',
  acceptanceStandard: '',
  completionDeadline: '',
  responsibilityUnit: '',
  responsiblePerson: '',
  supervisorDepartment: '',
  supervisor: ''
})

const rules = {
  title: [{ required: true, message: '请输入工单标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择工单类型', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
  department: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
  description: [{ required: true, message: '请输入任务描述', trigger: 'blur' }],
  executionStandard: [{ required: true, message: '请输入执行标准', trigger: 'blur' }],
  acceptanceStandard: [{ required: true, message: '请输入验收标准', trigger: 'blur' }],
  completionDeadline: [{ required: true, message: '请选择完成时限', trigger: 'change' }],
  responsibilityUnit: [{ required: true, message: '请选择责任单位', trigger: 'change' }],
  responsiblePerson: [{ required: true, message: '请选择责任人', trigger: 'change' }],
  supervisorDepartment: [{ required: true, message: '请选择督办部门', trigger: 'change' }],
  supervisor: [{ required: true, message: '请选择督办人', trigger: 'change' }]
}

const handleSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      ElMessage.success('工单创建成功')
      router.push('/workorder/list')
    }
  })
}

const handleSaveDraft = () => {
  ElMessage.success('草稿保存成功')
}

const handleReset = () => {
  formRef.value.resetFields()
}
</script>

<style scoped>
.workorder-create {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
