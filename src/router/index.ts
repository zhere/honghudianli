import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue')
    },
    {
      path: '/indicator/list',
      name: 'indicator-list',
      component: () => import('../views/indicator/IndicatorList.vue')
    },
    {
      path: '/indicator/monitor',
      name: 'indicator-monitor',
      component: () => import('../views/indicator/IndicatorMonitor.vue')
    },
    {
      path: '/indicator/warning',
      name: 'indicator-warning',
      component: () => import('../views/indicator/IndicatorWarning.vue')
    },
    {
      path: '/workorder/sync',
      name: 'workorder-sync',
      component: () => import('../views/workorder/WorkOrderSync.vue')
    },
    {
      path: '/workorder/list',
      name: 'workorder-list',
      component: () => import('../views/workorder/WorkOrderList.vue')
    },
    {
      path: '/workorder/assign',
      name: 'workorder-assign',
      component: () => import('../views/workorder/WorkOrderAssign.vue')
    },
    {
      path: '/workorder/track',
      name: 'workorder-track',
      component: () => import('../views/workorder/WorkOrderTrack.vue')
    },
    {
      path: '/workorder/check',
      name: 'workorder-check',
      component: () => import('../views/workorder/WorkOrderCheck.vue')
    },
    {
      path: '/analysis/statistics',
      name: 'analysis-statistics',
      component: () => import('../views/analysis/AnalysisStatistics.vue')
    },
    {
      path: '/analysis/report',
      name: 'analysis-report',
      component: () => import('../views/analysis/AnalysisReport.vue')
    },
    {
      path: '/performance/points',
      name: 'performance-points',
      component: () => import('../views/performance/PerformancePoints.vue')
    },
    {
      path: '/performance/evaluation',
      name: 'performance-evaluation',
      component: () => import('../views/performance/PerformanceEvaluation.vue')
    },
    {
      path: '/performance/ranking',
      name: 'performance-ranking',
      component: () => import('../views/performance/PerformanceRanking.vue')
    },
    {
      path: '/department/overview',
      name: 'department-overview',
      component: () => import('../views/department/DepartmentOverview.vue')
    },
    {
      path: '/department/workorder',
      name: 'department-workorder',
      component: () => import('../views/department/DepartmentWorkOrder.vue')
    },
    {
      path: '/department/performance',
      name: 'department-performance',
      component: () => import('../views/department/DepartmentPerformance.vue')
    }
  ]
})

export default router
