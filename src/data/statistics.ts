export interface Statistics {
  workOrderStats: WorkOrderStats
  efficiencyStats: EfficiencyStats
  qualityStats: QualityStats
  trendStats: TrendStats
}

export interface WorkOrderStats {
  total: number
  new: number
  completed: number
  overdue: number
  byDepartment: DepartmentStats[]
  byType: TypeStats[]
  byStatus: StatusStats[]
}

export interface DepartmentStats {
  department: string
  total: number
  completed: number
  overdue: number
  completionRate: number
}

export interface TypeStats {
  type: string
  total: number
  percentage: number
}

export interface StatusStats {
  status: string
  count: number
  percentage: number
}

export interface EfficiencyStats {
  avgCreateTime: number
  avgReceiveTime: number
  avgCompleteTime: number
  avgAcceptanceTime: number
  avgTotalTime: number
  byDepartment: EfficiencyByDepartment[]
  byType: EfficiencyByType[]
}

export interface EfficiencyByDepartment {
  department: string
  avgTotalTime: number
  avgCompleteTime: number
  avgAcceptanceTime: number
}

export interface EfficiencyByType {
  type: string
  avgTotalTime: number
  avgCompleteTime: number
  avgAcceptanceTime: number
}

export interface QualityStats {
  firstPassRate: number
  reworkRate: number
  materialCompleteness: number
  customerSatisfaction: number
  byDepartment: QualityByDepartment[]
  byType: QualityByType[]
}

export interface QualityByDepartment {
  department: string
  firstPassRate: number
  reworkRate: number
  materialCompleteness: number
}

export interface QualityByType {
  type: string
  firstPassRate: number
  reworkRate: number
  materialCompleteness: number
}

export interface TrendStats {
  workOrderTrend: TrendData[]
  efficiencyTrend: TrendData[]
  qualityTrend: TrendData[]
}

export interface TrendData {
  date: string
  value: number
}

export const statistics: Statistics = {
  workOrderStats: {
    total: 156,
    new: 23,
    completed: 118,
    overdue: 15,
    byDepartment: [
      { department: '安监部', total: 28, completed: 22, overdue: 3, completionRate: 78.6 },
      { department: '营销部', total: 35, completed: 28, overdue: 4, completionRate: 80.0 },
      { department: '配电部', total: 32, completed: 24, overdue: 5, completionRate: 75.0 },
      { department: '供指中心', total: 30, completed: 23, overdue: 2, completionRate: 76.7 },
      { department: '运检部', total: 31, completed: 21, overdue: 1, completionRate: 67.7 }
    ],
    byType: [
      { type: '安监类', total: 28, percentage: 17.9 },
      { type: '营销类', total: 35, percentage: 22.4 },
      { type: '配电类', total: 32, percentage: 20.5 },
      { type: '供指类', total: 30, percentage: 19.2 },
      { type: '运检类', total: 31, percentage: 19.9 }
    ],
    byStatus: [
      { status: '待接收', count: 12, percentage: 7.7 },
      { status: '执行中', count: 23, percentage: 14.7 },
      { status: '已完成', count: 8, percentage: 5.1 },
      { status: '已验收', count: 6, percentage: 3.8 },
      { status: '已闭环', count: 107, percentage: 68.6 }
    ]
  },
  efficiencyStats: {
    avgCreateTime: 0.5,
    avgReceiveTime: 1.2,
    avgCompleteTime: 48.5,
    avgAcceptanceTime: 24.3,
    avgTotalTime: 74.5,
    byDepartment: [
      { department: '安监部', avgTotalTime: 72.3, avgCompleteTime: 45.6, avgAcceptanceTime: 23.5 },
      { department: '营销部', avgTotalTime: 68.5, avgCompleteTime: 42.3, avgAcceptanceTime: 21.8 },
      { department: '配电部', avgTotalTime: 82.1, avgCompleteTime: 52.4, avgAcceptanceTime: 26.8 },
      { department: '供指中心', avgTotalTime: 65.8, avgCompleteTime: 40.2, avgAcceptanceTime: 20.5 },
      { department: '运检部', avgTotalTime: 85.6, avgCompleteTime: 55.8, avgAcceptanceTime: 28.2 }
    ],
    byType: [
      { type: '安监类', avgTotalTime: 72.3, avgCompleteTime: 45.6, avgAcceptanceTime: 23.5 },
      { type: '营销类', avgTotalTime: 68.5, avgCompleteTime: 42.3, avgAcceptanceTime: 21.8 },
      { type: '配电类', avgTotalTime: 82.1, avgCompleteTime: 52.4, avgAcceptanceTime: 26.8 },
      { type: '供指类', avgTotalTime: 65.8, avgCompleteTime: 40.2, avgAcceptanceTime: 20.5 },
      { type: '运检类', avgTotalTime: 85.6, avgCompleteTime: 55.8, avgAcceptanceTime: 28.2 }
    ]
  },
  qualityStats: {
    firstPassRate: 87.5,
    reworkRate: 12.5,
    materialCompleteness: 94.2,
    customerSatisfaction: 95.8,
    byDepartment: [
      { department: '安监部', firstPassRate: 85.7, reworkRate: 14.3, materialCompleteness: 93.5 },
      { department: '营销部', firstPassRate: 89.3, reworkRate: 10.7, materialCompleteness: 95.2 },
      { department: '配电部', firstPassRate: 84.4, reworkRate: 15.6, materialCompleteness: 92.8 },
      { department: '供指中心', firstPassRate: 90.0, reworkRate: 10.0, materialCompleteness: 96.0 },
      { department: '运检部', firstPassRate: 86.7, reworkRate: 13.3, materialCompleteness: 93.8 }
    ],
    byType: [
      { type: '安监类', firstPassRate: 85.7, reworkRate: 14.3, materialCompleteness: 93.5 },
      { type: '营销类', firstPassRate: 89.3, reworkRate: 10.7, materialCompleteness: 95.2 },
      { type: '配电类', firstPassRate: 84.4, reworkRate: 15.6, materialCompleteness: 92.8 },
      { type: '供指类', firstPassRate: 90.0, reworkRate: 10.0, materialCompleteness: 96.0 },
      { type: '运检类', firstPassRate: 86.7, reworkRate: 13.3, materialCompleteness: 93.8 }
    ]
  },
  trendStats: {
    workOrderTrend: [
      { date: '2026-03-06', value: 22 },
      { date: '2026-03-07', value: 18 },
      { date: '2026-03-08', value: 25 },
      { date: '2026-03-09', value: 20 },
      { date: '2026-03-10', value: 23 },
      { date: '2026-03-11', value: 19 },
      { date: '2026-03-12', value: 23 }
    ],
    efficiencyTrend: [
      { date: '2026-03-06', value: 72.5 },
      { date: '2026-03-07', value: 73.2 },
      { date: '2026-03-08', value: 71.8 },
      { date: '2026-03-09', value: 74.5 },
      { date: '2026-03-10', value: 75.2 },
      { date: '2026-03-11', value: 73.8 },
      { date: '2026-03-12', value: 74.5 }
    ],
    qualityTrend: [
      { date: '2026-03-06', value: 86.5 },
      { date: '2026-03-07', value: 87.2 },
      { date: '2026-03-08', value: 85.8 },
      { date: '2026-03-09', value: 88.5 },
      { date: '2026-03-10', value: 89.2 },
      { date: '2026-03-11', value: 87.8 },
      { date: '2026-03-12', value: 87.5 }
    ]
  }
}
