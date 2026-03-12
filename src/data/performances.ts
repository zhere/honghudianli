export interface Performance {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position: string
  totalPoints: number
  rank: number
  monthlyPoints: number
  yearlyPoints: number
  performanceLevel: '优秀' | '良好' | '合格' | '不合格'
  performanceCoefficient: number
  workOrderCount: number
  completionRate: number
  timelinessRate: number
  qualityRate: number
  satisfactionRate: number
  details: PerformanceDetail[]
}

export interface PerformanceDetail {
  id: string
  workOrderId: string
  workOrderTitle: string
  points: number
  completionTime: string
  qualityCoefficient: number
  efficiencyCoefficient: number
  difficultyCoefficient: number
  performanceScore: number
  remark: string
}

export const performances: Performance[] = [
  {
    id: 'PF001',
    employeeId: 'E001',
    employeeName: '吴九',
    department: '运检部',
    position: '检修工',
    totalPoints: 185,
    rank: 1,
    monthlyPoints: 45,
    yearlyPoints: 185,
    performanceLevel: '优秀',
    performanceCoefficient: 1.2,
    workOrderCount: 12,
    completionRate: 100,
    timelinessRate: 95,
    qualityRate: 98,
    satisfactionRate: 96,
    details: [
      {
        id: 'PFD001',
        workOrderId: 'GD202603100001',
        workOrderTitle: '10千伏母线超期治理督办',
        points: 15,
        completionTime: '2026-03-11 17:00:00',
        qualityCoefficient: 1.1,
        efficiencyCoefficient: 1.0,
        difficultyCoefficient: 1.2,
        performanceScore: 19.8,
        remark: '高质量完成，效果显著'
      }
    ]
  },
  {
    id: 'PF002',
    employeeName: '钱十一',
    department: '供指中心',
    position: '网格员',
    totalPoints: 172,
    rank: 2,
    monthlyPoints: 38,
    yearlyPoints: 172,
    performanceLevel: '优秀',
    performanceCoefficient: 1.2,
    workOrderCount: 15,
    completionRate: 98,
    timelinessRate: 92,
    qualityRate: 96,
    satisfactionRate: 98,
    details: [
      {
        id: 'PFD002',
        workOrderId: 'GD202603090001',
        workOrderTitle: '网格云工单处理督办',
        points: 12,
        completionTime: '2026-03-10 17:00:00',
        qualityCoefficient: 1.0,
        efficiencyCoefficient: 1.1,
        difficultyCoefficient: 1.0,
        performanceScore: 13.2,
        remark: '按时完成，效果良好'
      }
    ]
  },
  {
    id: 'PF003',
    employeeName: '孙七',
    department: '营销部',
    position: '客户经理',
    totalPoints: 165,
    rank: 3,
    monthlyPoints: 35,
    yearlyPoints: 165,
    performanceLevel: '良好',
    performanceCoefficient: 1.1,
    workOrderCount: 14,
    completionRate: 96,
    timelinessRate: 90,
    qualityRate: 95,
    satisfactionRate: 97,
    details: []
  },
  {
    id: 'PF004',
    employeeName: '张三',
    department: '安监部',
    position: '安全员',
    totalPoints: 158,
    rank: 4,
    monthlyPoints: 32,
    yearlyPoints: 158,
    performanceLevel: '良好',
    performanceCoefficient: 1.1,
    workOrderCount: 11,
    completionRate: 94,
    timelinessRate: 88,
    qualityRate: 94,
    satisfactionRate: 95,
    details: []
  },
  {
    id: 'PF005',
    employeeName: '王五',
    department: '配电部',
    position: '配电工',
    totalPoints: 152,
    rank: 5,
    monthlyPoints: 30,
    yearlyPoints: 152,
    performanceLevel: '良好',
    performanceCoefficient: 1.1,
    workOrderCount: 13,
    completionRate: 92,
    timelinessRate: 85,
    qualityRate: 93,
    satisfactionRate: 94,
    details: []
  },
  {
    id: 'PF006',
    employeeName: '李四',
    department: '安监部',
    position: '安全主管',
    totalPoints: 148,
    rank: 6,
    monthlyPoints: 28,
    yearlyPoints: 148,
    performanceLevel: '合格',
    performanceCoefficient: 1.0,
    workOrderCount: 10,
    completionRate: 90,
    timelinessRate: 82,
    qualityRate: 92,
    satisfactionRate: 93,
    details: []
  },
  {
    id: 'PF007',
    employeeName: '赵六',
    department: '配电部',
    position: '配电主管',
    totalPoints: 145,
    rank: 7,
    monthlyPoints: 27,
    yearlyPoints: 145,
    performanceLevel: '合格',
    performanceCoefficient: 1.0,
    workOrderCount: 12,
    completionRate: 88,
    timelinessRate: 80,
    qualityRate: 91,
    satisfactionRate: 92,
    details: []
  },
  {
    id: 'PF008',
    employeeName: '周八',
    department: '营销部',
    position: '营销主管',
    totalPoints: 142,
    rank: 8,
    monthlyPoints: 26,
    yearlyPoints: 142,
    performanceLevel: '合格',
    performanceCoefficient: 1.0,
    workOrderCount: 11,
    completionRate: 86,
    timelinessRate: 78,
    qualityRate: 90,
    satisfactionRate: 91,
    details: []
  },
  {
    id: 'PF009',
    employeeName: '郑十',
    department: '运检部',
    position: '运检主管',
    totalPoints: 138,
    rank: 9,
    monthlyPoints: 25,
    yearlyPoints: 138,
    performanceLevel: '合格',
    performanceCoefficient: 1.0,
    workOrderCount: 10,
    completionRate: 85,
    timelinessRate: 75,
    qualityRate: 89,
    satisfactionRate: 90,
    details: []
  },
  {
    id: 'PF010',
    employeeName: '孙十二',
    department: '供指中心',
    position: '供指主管',
    totalPoints: 135,
    rank: 10,
    monthlyPoints: 24,
    yearlyPoints: 135,
    performanceLevel: '合格',
    performanceCoefficient: 1.0,
    workOrderCount: 9,
    completionRate: 83,
    timelinessRate: 72,
    qualityRate: 88,
    satisfactionRate: 89,
    details: []
  }
]

export const departmentPerformances = [
  {
    department: '安监部',
    totalPoints: 306,
    averagePoints: 153,
    rank: 3,
    workOrderCount: 21,
    completionRate: 92,
    timelinessRate: 85,
    qualityRate: 93
  },
  {
    department: '营销部',
    totalPoints: 307,
    averagePoints: 153.5,
    rank: 2,
    workOrderCount: 25,
    completionRate: 91,
    timelinessRate: 84,
    qualityRate: 92.5
  },
  {
    department: '配电部',
    totalPoints: 297,
    averagePoints: 148.5,
    rank: 5,
    workOrderCount: 25,
    completionRate: 90,
    timelinessRate: 82.5,
    qualityRate: 92
  },
  {
    department: '供指中心',
    totalPoints: 307,
    averagePoints: 153.5,
    rank: 2,
    workOrderCount: 24,
    completionRate: 90.5,
    timelinessRate: 82,
    qualityRate: 92
  },
  {
    department: '运检部',
    totalPoints: 323,
    averagePoints: 161.5,
    rank: 1,
    workOrderCount: 22,
    completionRate: 92.5,
    timelinessRate: 85,
    qualityRate: 93.5
  }
]
