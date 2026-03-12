<template>
  <div class="workorder-execute">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>工单执行</span>
          <el-button type="primary" size="small" @click="$router.back()">返回</el-button>
        </div>
      </template>

      <el-table :data="executingWorkOrders" stripe border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="工单编号" width="150" />
        <el-table-column prop="title" label="工单标题" width="250" />
        <el-table-column label="优先级" width="100">
          <template #default="{ row }">
            <el-tag :type="getPriorityType(row.priority)" size="small">
              {{ getPriorityText(row.priority) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="responsiblePerson" label="责任人" width="100" />
        <el-table-column label="进度" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="completionDeadline" label="完成时限" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleUpdateProgress(row)">更新进度</el-button>
            <el-button type="primary" link size="small" @click="handleUploadMaterial(row)">上传材料</el-button>
            <el-button type="primary" link size="small" @click="handleComplete(row)">完成</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="progressDialogVisible" title="更新进度" width="600px">
      <el-form :model="progressForm" label-width="120px">
        <el-form-item label="工单编号">
          <el-input v-model="progressForm.id" disabled />
        </el-form-item>
        <el-form-item label="工单标题">
          <el-input v-model="progressForm.title" disabled />
        </el-form-item>
        <el-form-item label="当前进度">
          <el-slider v-model="progressForm.progress" :marks="{ 0: '0%', 50: '50%', 100: '100%' }" />
        </el-form-item>
        <el-form-item label="进度描述">
          <el-input v-model="progressForm.progressDescription" type="textarea" :rows="3" placeholder="请描述当前执行进展" />
        </el-form-item>
        <el-form-item label="完成工作量">
          <el-input v-model="progressForm.workload" placeholder="请输入完成的工作量" />
        </el-form-item>
        <el-form-item label="存在问题">
          <el-input v-model="progressForm.problems" type="textarea" :rows="2" placeholder="请描述执行过程中遇到的问题" />
        </el-form-item>
        <el-form-item label="下一步计划">
          <el-input v-model="progressForm.nextPlan" type="textarea" :rows="2" placeholder="请描述后续工作安排" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="progressDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveProgress">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="materialDialogVisible" title="上传佐证材料" width="700px">
      <el-form :model="materialForm" label-width="120px">
        <el-form-item label="工单编号">
          <el-input v-model="materialForm.id" disabled />
        </el-form-item>
        <el-form-item label="材料类型">
          <el-select v-model="materialForm.type" placeholder="请选择材料类型">
            <el-option label="照片" value="photo" />
            <el-option label="视频" value="video" />
            <el-option label="文档" value="document" />
            <el-option label="音频" value="audio" />
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload
            class="upload-demo"
            drag
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽文件到此处或 <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持jpg/png图片、mp4视频、doc/pdf文档、mp3音频，文件大小不超过50MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="材料说明">
          <el-input v-model="materialForm.description" type="textarea" :rows="2" placeholder="请输入材料说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="materialDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpload">上传</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="completeDialogVisible" title="完成工单" width="700px">
      <el-form :model="completeForm" label-width="120px">
        <el-form-item label="工单编号">
          <el-input v-model="completeForm.id" disabled />
        </el-form-item>
        <el-form-item label="工单标题">
          <el-input v-model="completeForm.title" disabled />
        </el-form-item>
        <el-form-item label="执行结果" required>
          <el-input v-model="completeForm.executionResult" type="textarea" :rows="4" placeholder="请详细描述执行结果" />
        </el-form-item>
        <el-form-item label="材料清单" required>
          <el-checkbox-group v-model="completeForm.materials">
            <el-checkbox label="现场照片（至少3张）" />
            <el-checkbox label="视频材料（不少于30秒）" />
            <el-checkbox label="文字说明" />
            <el-checkbox label="签字确认单" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="completeForm.remark" type="textarea" :rows="2" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="completeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmComplete">确认完成</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { workOrders } from '@/data/workOrders'

const executingWorkOrders = computed(() => workOrders.filter(item => item.status === '执行中'))

const selectedWorkOrders = ref<any[]>([])
const progressDialogVisible = ref(false)
const materialDialogVisible = ref(false)
const completeDialogVisible = ref(false)

const progressForm = ref({
  id: '',
  title: '',
  progress: 0,
  progressDescription: '',
  workload: '',
  problems: '',
  nextPlan: ''
})

const materialForm = ref({
  id: '',
  type: '',
  file: null as File | null,
  description: ''
})

const completeForm = ref({
  id: '',
  title: '',
  executionResult: '',
  materials: [],
  remark: ''
})

const getPriorityType = (priority: string) => {
  const typeMap: Record<string, any> = {
    'yellow': 'warning',
    'red': 'danger',
    'orange': 'danger'
  }
  return typeMap[priority] || 'info'
}

const getPriorityText = (priority: string) => {
  const textMap: Record<string, string> = {
    'yellow': '一般',
    'red': '严重',
    'orange': '特别严重'
  }
  return textMap[priority] || '未知'
}

const handleSelectionChange = (selection: any[]) => {
  selectedWorkOrders.value = selection
}

const handleUpdateProgress = (row: any) => {
  progressForm.value = {
    id: row.id,
    title: row.title,
    progress: row.progress,
    progressDescription: '',
    workload: '',
    problems: '',
    nextPlan: ''
  }
  progressDialogVisible.value = true
}

const handleSaveProgress = () => {
  ElMessage.success('进度更新成功')
  progressDialogVisible.value = false
}

const handleUploadMaterial = (row: any) => {
  materialForm.value = {
    id: row.id,
    type: '',
    file: null,
    description: ''
  }
  materialDialogVisible.value = true
}

const handleFileChange = (file: any) => {
  materialForm.value.file = file.raw
}

const handleUpload = () => {
  ElMessage.success('材料上传成功')
  materialDialogVisible.value = false
}

const handleComplete = (row: any) => {
  completeForm.value = {
    id: row.id,
    title: row.title,
    executionResult: '',
    materials: [],
    remark: ''
  }
  completeDialogVisible.value = true
}

const handleConfirmComplete = () => {
  ElMessage.success('工单已完成，等待验收')
  completeDialogVisible.value = false
}
</script>

<style scoped>
.workorder-execute {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-demo {
  width: 100%;
}
</style>
