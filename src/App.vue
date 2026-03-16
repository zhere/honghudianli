<template>
  <div class="app-container">
    <el-container>
      <el-aside width="240px">
        <div class="logo">
          <h2>洪湖电力</h2>
          <p>工单督办管理平台</p>
        </div>
        <el-menu
          :default-active="activeMenu"
          router
          background-color="#001529"
          text-color="#fff"
          active-text-color="#1890ff"
        >
          <el-menu-item index="/dashboard">
            <el-icon><DataAnalysis /></el-icon>
            <span>领导驾驶舱</span>
          </el-menu-item>
          <el-sub-menu index="indicator">
            <template #title>
              <el-icon><TrendCharts /></el-icon>
              <span>指标监测</span>
            </template>
            <el-menu-item index="/indicator/list">指标列表</el-menu-item>
            <el-menu-item index="/indicator/monitor">实时监测</el-menu-item>
            <el-menu-item index="/indicator/warning">预警管理</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="workorder">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>督办管理</span>
            </template>
            <el-menu-item index="/workorder/sync">数据接入</el-menu-item>
            <el-menu-item index="/workorder/list">督办工单</el-menu-item>
            <el-menu-item index="/workorder/assign">任务分配</el-menu-item>
            <el-menu-item index="/workorder/track">进度跟踪</el-menu-item>
            <el-menu-item index="/workorder/check">督办核查</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="analysis">
            <template #title>
              <el-icon><DataLine /></el-icon>
              <span>数据分析</span>
            </template>
            <el-menu-item index="/analysis/statistics">统计分析</el-menu-item>
            <el-menu-item index="/analysis/report">报表生成</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="performance">
            <template #title>
              <el-icon><Trophy /></el-icon>
              <span>绩效考核</span>
            </template>
            <el-menu-item index="/performance/points">积分管理</el-menu-item>
            <el-menu-item index="/performance/evaluation">绩效评估</el-menu-item>
            <el-menu-item index="/performance/ranking">绩效排名</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="department">
            <template #title>
              <el-icon><OfficeBuilding /></el-icon>
              <span>部门看板</span>
            </template>
            <el-menu-item index="/department/overview">部门概览</el-menu-item>
            <el-menu-item index="/department/workorder">督办跟踪</el-menu-item>
            <el-menu-item index="/department/performance">绩效展示</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-left">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-if="currentBreadcrumb">{{ currentBreadcrumb }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-icon class="notification-icon"><Bell /></el-icon>
            <div class="user-info">
              <el-avatar :size="32" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
              <span>管理员</span>
            </div>
          </div>
        </el-header>
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { DataAnalysis, TrendCharts, Document, DataLine, Trophy, OfficeBuilding, Bell } from '@element-plus/icons-vue'

const route = useRoute()

const activeMenu = computed(() => route.path)

const currentBreadcrumb = computed(() => {
  const pathMap: Record<string, string> = {
    '/dashboard': '领导驾驶舱',
    '/indicator/list': '指标列表',
    '/indicator/monitor': '实时监测',
    '/indicator/warning': '预警管理',
    '/workorder/sync': '数据接入',
    '/workorder/list': '督办工单',
    '/workorder/assign': '任务分配',
    '/workorder/track': '进度跟踪',
    '/workorder/check': '督办核查',
    '/analysis/statistics': '统计分析',
    '/analysis/report': '报表生成',
    '/performance/points': '积分管理',
    '/performance/evaluation': '绩效评估',
    '/performance/ranking': '绩效排名',
    '/department/overview': '部门概览',
    '/department/workorder': '督办跟踪',
    '/department/performance': '绩效展示'
  }
  return pathMap[route.path] || ''
})
</script>

<style scoped>
.app-container {
  height: 100vh;
}

.el-container {
  height: 100%;
}

.el-aside {
  background-color: #001529;
  overflow-x: hidden;
  overflow-y: auto;
}

.logo {
  padding: 20px;
  text-align: center;
  color: #fff;
  border-bottom: 1px solid #1f2937;
}

.logo h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: bold;
}

.logo p {
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
}

.el-menu {
  border-right: none;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 20px;
}

.header-left {
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.notification-icon {
  font-size: 20px;
  color: #6b7280;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info span {
  font-size: 14px;
  color: #374151;
}

.el-main {
  background-color: #f3f4f6;
  padding: 20px;
  overflow-y: auto;
}
</style>
