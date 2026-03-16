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
    total: 186,
    new: 28,
    completed: 138,
    overdue: 20,
    byDepartment: [
      { department: '安监部', total: 32, completed: 26, overdue: 4, completionRate: 81.3 },
      { department: '营销部', total: 42, completed: 34, overdue: 5, completionRate: 81.0 },
      { department: '供指中心', total: 35, completed: 28, overdue: 3, completionRate: 80.0 },
      { department: '工区', total: 28, completed: 22, overdue: 3, completionRate: 78.6 },
      { department: '配电部', total: 30, completed: 22, overdue: 4, completionRate: 73.3 },
      { department: '发建部', total: 19, completed: 16, overdue: 1, completionRate: 84.2 }
    ],
    byType: [
      { type: '安监类', total: 32, percentage: 17.2 },
      { type: '营销类', total: 42, percentage: 22.6 },
      { type: '供指类', total: 35, percentage: 18.8 },
      { type: '工区类', total: 28, percentage: 15.1 },
      { type: '配电类', total: 30, percentage: 16.1 },
      { type: '发建类', total: 19, percentage: 10.2 }
    ],
    byStatus: [
      { status: '待接收', count: 15, percentage: 8.1 },
      { status: '执行中', count: 28, percentage: 15.1 },
      { status: '已完成', count: 10, percentage: 5.4 },
      { status: '已验收', count: 8, percentage: 4.3 },
      { status: '已闭环', count: 125, percentage: 67.2 }
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
      { department: '供指中心', avgTotalTime: 65.8, avgCompleteTime: 40.2, avgAcceptanceTime: 20.5 },
      { department: '工区', avgTotalTime: 58.5, avgCompleteTime: 35.8, avgAcceptanceTime: 18.2 },
      { department: '配电部', avgTotalTime: 82.1, avgCompleteTime: 52.4, avgAcceptanceTime: 26.8 },
      { department: '发建部', avgTotalTime: 92.3, avgCompleteTime: 58.6, avgAcceptanceTime: 30.5 }
    ],
    byType: [
      { type: '安监类', avgTotalTime: 72.3, avgCompleteTime: 45.6, avgAcceptanceTime: 23.5 },
      { type: '营销类', avgTotalTime: 68.5, avgCompleteTime: 42.3, avgAcceptanceTime: 21.8 },
      { type: '供指类', avgTotalTime: 65.8, avgCompleteTime: 40.2, avgAcceptanceTime: 20.5 },
      { type: '工区类', avgTotalTime: 58.5, avgCompleteTime: 35.8, avgAcceptanceTime: 18.2 },
      { type: '配电类', avgTotalTime: 82.1, avgCompleteTime: 52.4, avgAcceptanceTime: 26.8 },
      { type: '发建类', avgTotalTime: 92.3, avgCompleteTime: 58.6, avgAcceptanceTime: 30.5 }
    ]
  },
  qualityStats: {
    firstPassRate: 88.5,
    reworkRate: 11.5,
    materialCompleteness: 95.2,
    customerSatisfaction: 96.2,
    byDepartment: [
      { department: '安监部', firstPassRate: 86.7, reworkRate: 13.3, materialCompleteness: 94.5 },
      { department: '营销部', firstPassRate: 89.3, reworkRate: 10.7, materialCompleteness: 95.8 },
      { department: '供指中心', firstPassRate: 91.2, reworkRate: 8.8, materialCompleteness: 96.5 },
      { department: '工区', firstPassRate: 92.5, reworkRate: 7.5, materialCompleteness: 97.2 },
      { department: '配电部', firstPassRate: 85.4, reworkRate: 14.6, materialCompleteness: 93.8 },
      { department: '发建部', firstPassRate: 84.2, reworkRate: 15.8, materialCompleteness: 92.5 }
    ],
    byType: [
      { type: '安监类', firstPassRate: 86.7, reworkRate: 13.3, materialCompleteness: 94.5 },
      { type: '营销类', firstPassRate: 89.3, reworkRate: 10.7, materialCompleteness: 95.8 },
      { type: '供指类', firstPassRate: 91.2, reworkRate: 8.8, materialCompleteness: 96.5 },
      { type: '工区类', firstPassRate: 92.5, reworkRate: 7.5, materialCompleteness: 97.2 },
      { type: '配电类', firstPassRate: 85.4, reworkRate: 14.6, materialCompleteness: 93.8 },
      { type: '发建类', firstPassRate: 84.2, reworkRate: 15.8, materialCompleteness: 92.5 }
    ]
  },
  trendStats: {
    workOrderTrend: [
      { date: '2026-03-10', value: 25 },
      { date: '2026-03-11', value: 22 },
      { date: '2026-03-12', value: 28 },
      { date: '2026-03-13', value: 24 },
      { date: '2026-03-14', value: 26 },
      { date: '2026-03-15', value: 23 },
      { date: '2026-03-16', value: 28 }
    ],
    efficiencyTrend: [
      { date: '2026-03-10', value: 73.5 },
      { date: '2026-03-11', value: 74.2 },
      { date: '2026-03-12', value: 72.8 },
      { date: '2026-03-13', value: 75.5 },
      { date: '2026-03-14', value: 76.2 },
      { date: '2026-03-15', value: 74.8 },
      { date: '2026-03-16', value: 75.5 }
    ],
    qualityTrend: [
      { date: '2026-03-10', value: 87.5 },
      { date: '2026-03-11', value: 88.2 },
      { date: '2026-03-12', value: 86.8 },
      { date: '2026-03-13', value: 89.5 },
      { date: '2026-03-14', value: 90.2 },
      { date: '2026-03-15', value: 88.8 },
      { date: '2026-03-16', value: 88.5 }
    ]
  }
}
