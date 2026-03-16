<template>
  <div class="workorder-sync">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>数据接入</span>
        </div>
      </template>

      <el-row :gutter="20" class="status-cards">
        <el-col :span="8">
          <el-card shadow="hover" class="status-card">
            <div class="status-content">
              <div class="status-icon success">
                <el-icon><Connection /></el-icon>
              </div>
              <div class="status-info">
                <div class="status-label">接口状态</div>
                <div class="status-value">{{ interfaceConfig.status }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="status-card">
            <div class="status-content">
              <div class="status-icon primary">
                <el-icon><Download /></el-icon>
              </div>
              <div class="status-info">
                <div class="status-label">今日同步</div>
                <div class="status-value">{{ todaySyncCount }} 条</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="status-card">
            <div class="status-content">
              <div class="status-icon" :class="failedCount > 0 ? 'danger' : 'success'">
                <el-icon><Warning /></el-icon>
              </div>
              <div class="status-info">
                <div class="status-label">同步失败</div>
                <div class="status-value">{{ failedCount }} 条</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-card class="config-card" shadow="never">
        <template #header>
          <div class="section-header">
            <span>接口配置</span>
            <div>
              <el-button type="primary" size="small" @click="testConnection">
                <el-icon><Connection /></el-icon>
                测试连接
              </el-button>
              <el-button type="success" size="small" @click="saveConfig">
                <el-icon><Check /></el-icon>
                保存配置
              </el-button>
            </div>
          </div>
        </template>
        <el-form :model="interfaceConfig" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="接口名称">
                <el-input v-model="interfaceConfig.name" placeholder="请输入接口名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="接口地址">
                <el-input v-model="interfaceConfig.url" placeholder="请输入接口地址" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="认证方式">
                <el-select v-model="interfaceConfig.authType" placeholder="请选择认证方式">
                  <el-option label="Token认证" value="Token" />
                  <el-option label="证书认证" value="证书" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="调用频率">
                <el-select v-model="interfaceConfig.callFrequency" placeholder="请选择调用频率">
                  <el-option label="实时同步" value="实时" />
                  <el-option label="每5分钟" value="每5分钟" />
                  <el-option label="每10分钟" value="每10分钟" />
                  <el-option label="每30分钟" value="每30分钟" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <el-card class="sync-card" shadow="never">
        <template #header>
          <div class="section-header">
            <span>同步操作</span>
          </div>
        </template>
        <div class="sync-actions">
          <el-button type="primary" @click="syncData('increment')">
            <el-icon><Refresh /></el-icon>
            增量同步
          </el-button>
          <el-button type="warning" @click="syncData('full')">
            <el-icon><Download /></el-icon>
            全量同步
          </el-button>
          <span class="last-sync">上次同步时间：{{ interfaceConfig.lastSyncTime }}</span>
        </div>
      </el-card>

      <el-card class="log-card" shadow="never">
        <template #header>
          <div class="section-header">
            <span>同步日志</span>
            <el-button type="primary" size="small" @click="refreshLogs">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </template>
        <el-table :data="syncLogs" stripe style="width: 100%">
          <el-table-column prop="syncTime" label="同步时间" width="180" />
          <el-table-column prop="syncType" label="同步类型" width="120">
            <template #default="{ row }">
              <el-tag :type="row.syncType === '增量同步' ? 'primary' : 'warning'">
                {{ row.syncType }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="syncCount" label="同步数量" width="100" />
          <el-table-column prop="syncStatus" label="同步状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.syncStatus === '成功' ? 'success' : row.syncStatus === '失败' ? 'danger' : 'warning'">
                {{ row.syncStatus }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="syncDetails" label="详情" />
          <el-table-column label="操作" width="80">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="viewLogDetail(row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-card>

    <el-dialog v-model="logDetailVisible" title="同步日志详情" width="600px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="同步时间">{{ currentLog.syncTime }}</el-descriptions-item>
        <el-descriptions-item label="同步类型">{{ currentLog.syncType }}</el-descriptions-item>
        <el-descriptions-item label="同步数量">{{ currentLog.syncCount }}</el-descriptions-item>
        <el-descriptions-item label="同步状态">{{ currentLog.syncStatus }}</el-descriptions-item>
        <el-descriptions-item label="详细信息">{{ currentLog.syncDetails }}</el-descriptions-item>
        <el-descriptions-item v-if="currentLog.errorMessage" label="错误信息">
          <span style="color: #f56c6c">{{ currentLog.errorMessage }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Connection, Download, Warning, Check, Refresh } from '@element-plus/icons-vue'

interface InterfaceConfig {
  name: string
  url: string
  authType: string
  callFrequency: string
  status: string
  lastSyncTime: string
}

interface SyncLog {
  id: string
  syncTime: string
  syncType: string
  syncCount: number
  syncStatus: string
  syncDetails: string
  errorMessage?: string
}

const interfaceConfig = reactive<InterfaceConfig>({
  name: '工单数据同步接口',
  url: 'http://api.power-system.com/workorder/sync',
  authType: 'Token',
  callFrequency: '每5分钟',
  status: '正常',
  lastSyncTime: '2026-03-16 14:30:00'
})

const todaySyncCount = ref(156)
const failedCount = ref(0)

const syncLogs = ref<SyncLog[]>([
  {
    id: '1',
    syncTime: '2026-03-16 14:30:00',
    syncType: '增量同步',
    syncCount: 12,
    syncStatus: '成功',
    syncDetails: '同步新增工单8条，更新工单4条'
  },
  {
    id: '2',
    syncTime: '2026-03-16 14:25:00',
    syncType: '增量同步',
    syncCount: 5,
    syncStatus: '成功',
    syncDetails: '同步新增工单3条，更新工单2条'
  },
  {
    id: '3',
    syncTime: '2026-03-16 00:00:00',
    syncType: '全量同步',
    syncCount: 156,
    syncStatus: '成功',
    syncDetails: '全量同步近30天工单数据'
  },
  {
    id: '4',
    syncTime: '2026-03-15 14:30:00',
    syncType: '增量同步',
    syncCount: 8,
    syncStatus: '成功',
    syncDetails: '同步新增工单5条，更新工单3条'
  }
])

const logDetailVisible = ref(false)
const currentLog = ref<SyncLog>({
  id: '',
  syncTime: '',
  syncType: '',
  syncCount: 0,
  syncStatus: '',
  syncDetails: ''
})

const testConnection = () => {
  ElMessage.success('接口连接测试成功')
}

const saveConfig = () => {
  ElMessage.success('配置保存成功')
}

const syncData = (type: string) => {
  ElMessage.success(`${type === 'increment' ? '增量' : '全量'}同步已触发`)
}

const refreshLogs = () => {
  ElMessage.success('日志已刷新')
}

const viewLogDetail = (log: SyncLog) => {
  currentLog.value = { ...log }
  logDetailVisible.value = true
}
</script>

<style scoped>
.workorder-sync {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-cards {
  margin-bottom: 20px;
}

.status-card {
  height: 100px;
}

.status-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.status-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.status-icon .el-icon {
  font-size: 28px;
  color: #fff;
}

.status-icon.success {
  background: linear-gradient(135deg, #67c23a, #85ce61);
}

.status-icon.primary {
  background: linear-gradient(135deg, #409eff, #66b1ff);
}

.status-icon.danger {
  background: linear-gradient(135deg, #f56c6c, #f78989);
}

.status-info {
  flex: 1;
}

.status-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.status-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.config-card,
.sync-card,
.log-card {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sync-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.last-sync {
  color: #909399;
  font-size: 14px;
}
</style>
