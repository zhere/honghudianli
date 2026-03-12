export interface WorkOrder {
  id: string
  title: string
  type: '安监类' | '营销类' | '配电类' | '运检类' | '供指类'
  priority: 'yellow' | 'orange' | 'red'
  department: string
  responsibilityUnit: string
  responsiblePerson: string
  supervisor: string
  supervisorDepartment: string
  description: string
  executionStandard: string
  completionDeadline: string
  acceptanceStandard: string
  status: '待接收' | '执行中' | '已完成' | '已验收' | '已闭环'
  progress: number
  createTime: string
  receiveTime: string
  completeTime: string
  acceptanceTime: string
  closeTime: string
  executionResult: string
  materials: Material[]
  autoCheckResult: AutoCheckResult
  manualCheckResult: ManualCheckResult
  points: number
  performanceScore: number
}

export interface Material {
  id: string
  type: 'photo' | 'video' | 'document' | 'audio'
  name: string
  url: string
  uploadTime: string
  uploader: string
  status: 'pending' | 'approved' | 'rejected'
  checkComment: string
}

export interface AutoCheckResult {
  timeliness: boolean
  completeness: boolean
  quality: boolean
  dataConsistency: boolean
  checkTime: string
  details: string[]
}

export interface ManualCheckResult {
  materialAuthenticity: boolean
  executionCompleteness: boolean
  resultEffectiveness: boolean
  checkPerson: string
  checkTime: string
  checkComment: string
  conclusion: '通过' | '不通过' | '需要补充材料'
}

export const workOrders: WorkOrder[] = [
  {
    id: 'GD202603120001',
    title: 'XX供电所违章情况异常督办',
    type: '安监类',
    priority: 'yellow',
    department: '安监部',
    responsibilityUnit: '城区供电所',
    responsiblePerson: '张三',
    supervisor: '李四',
    supervisorDepartment: '安监部',
    description: 'XX供电所昨日违章数达到3次，超过历史同期20%，需立即开展违章整改工作',
    executionStandard: '1. 立即召开违章分析会\n2. 制定整改措施\n3. 组织安全培训\n4. 完成违章整改',
    completionDeadline: '2026-03-15 18:00:00',
    acceptanceStandard: '违章整改率达到95%以上',
    status: '执行中',
    progress: 60,
    createTime: '2026-03-12 09:00:00',
    receiveTime: '2026-03-12 10:30:00',
    completeTime: '',
    acceptanceTime: '',
    closeTime: '',
    executionResult: '',
    materials: [
      {
        id: 'MAT001',
        type: 'photo',
        name: '违章分析会现场照片.jpg',
        url: '',
        uploadTime: '2026-03-12 14:00:00',
        uploader: '张三',
        status: 'approved',
        checkComment: '照片清晰，符合要求'
      }
    ],
    autoCheckResult: {
      timeliness: true,
      completeness: false,
      quality: true,
      dataConsistency: true,
      checkTime: '2026-03-12 15:00:00',
      details: ['时效性核查通过', '材料完整性核查：缺少整改后照片', '质量核查通过', '数据一致性核查通过']
    },
    manualCheckResult: {
      materialAuthenticity: true,
      executionCompleteness: false,
      resultEffectiveness: false,
      checkPerson: '',
      checkTime: '',
      checkComment: '',
      conclusion: '需要补充材料'
    },
    points: 0,
    performanceScore: 0
  },
  {
    id: 'GD202603120002',
    title: 'XX线路树障清理督办',
    type: '配电类',
    priority: 'red',
    department: '配电部',
    responsibilityUnit: '城郊供电所',
    responsiblePerson: '王五',
    supervisor: '赵六',
    supervisorDepartment: '配电部',
    description: 'XX线路发现多处树障，存在安全隐患，需立即清理',
    executionStandard: '1. 现场勘察树障情况\n2. 制定清理方案\n3. 组织人员清理\n4. 验收清理效果',
    completionDeadline: '2026-03-13 18:00:00',
    acceptanceStandard: '树障清理率达到100%，无安全隐患',
    status: '待接收',
    progress: 0,
    createTime: '2026-03-12 08:30:00',
    receiveTime: '',
    completeTime: '',
    acceptanceTime: '',
    closeTime: '',
    executionResult: '',
    materials: [],
    autoCheckResult: {
      timeliness: true,
      completeness: false,
      quality: false,
      dataConsistency: false,
      checkTime: '',
      details: []
    },
    manualCheckResult: {
      materialAuthenticity: false,
      executionCompleteness: false,
      resultEffectiveness: false,
      checkPerson: '',
      checkTime: '',
      checkComment: '',
      conclusion: '通过'
    },
    points: 0,
    performanceScore: 0
  },
  {
    id: 'GD202603110001',
    title: '客户联系方式异常清理督办',
    type: '营销类',
    priority: 'yellow',
    department: '营销部',
    responsibilityUnit: '客户服务中心',
    responsiblePerson: '孙七',
    supervisor: '周八',
    supervisorDepartment: '营销部',
    description: '客户联系方式异常率达到3.5%，超过目标值2%，需开展异常清理工作',
    executionStandard: '1. 梳理异常客户名单\n2. 逐一核实联系方式\n3. 更新系统信息\n4. 建立长效机制',
    completionDeadline: '2026-03-14 18:00:00',
    acceptanceStandard: '客户联系方式异常率降至2%以下',
    status: '已完成',
    progress: 100,
    createTime: '2026-03-11 09:00:00',
    receiveTime: '2026-03-11 10:00:00',
    completeTime: '2026-03-12 16:00:00',
    acceptanceTime: '',
    closeTime: '',
    executionResult: '已完成异常客户核实120户，更新系统信息115户，建立定期核查机制',
    materials: [
      {
        id: 'MAT002',
        type: 'document',
        name: '异常客户清理清单.xlsx',
        url: '',
        uploadTime: '2026-03-12 15:00:00',
        uploader: '孙七',
        status: 'approved',
        checkComment: '清单完整，数据准确'
      },
      {
        id: 'MAT003',
        type: 'photo',
        name: '系统信息更新截图.png',
        url: '',
        uploadTime: '2026-03-12 15:30:00',
        uploader: '孙七',
        status: 'approved',
        checkComment: '截图清晰，更新完整'
      }
    ],
    autoCheckResult: {
      timeliness: true,
      completeness: true,
      quality: true,
      dataConsistency: true,
      checkTime: '2026-03-12 17:00:00',
      details: ['时效性核查通过', '材料完整性核查通过', '质量核查通过', '数据一致性核查通过']
    },
    manualCheckResult: {
      materialAuthenticity: false,
      executionCompleteness: false,
      resultEffectiveness: false,
      checkPerson: '',
      checkTime: '',
      checkComment: '',
      conclusion: '通过'
    },
    points: 0,
    performanceScore: 0
  },
  {
    id: 'GD202603100001',
    title: '10千伏母线超期治理督办',
    type: '运检类',
    priority: 'orange',
    department: '运检部',
    responsibilityUnit: '检修班',
    responsiblePerson: '吴九',
    supervisor: '郑十',
    supervisorDepartment: '运检部',
    description: '10千伏母线超期运行，存在安全隐患，需立即安排治理',
    executionStandard: '1. 制定治理方案\n2. 准备材料和工具\n3. 实施治理作业\n4. 验收治理效果',
    completionDeadline: '2026-03-12 18:00:00',
    acceptanceStandard: '母线治理完成，符合安全运行标准',
    status: '已验收',
    progress: 100,
    createTime: '2026-03-10 08:00:00',
    receiveTime: '2026-03-10 09:00:00',
    completeTime: '2026-03-11 17:00:00',
    acceptanceTime: '2026-03-12 10:00:00',
    closeTime: '',
    executionResult: '已完成母线治理，更换母线2条，绝缘子15个',
    materials: [
      {
        id: 'MAT004',
        type: 'photo',
        name: '治理前照片.jpg',
        url: '',
        uploadTime: '2026-03-11 10:00:00',
        uploader: '吴九',
        status: 'approved',
        checkComment: '照片清晰'
      },
      {
        id: 'MAT005',
        type: 'photo',
        name: '治理后照片.jpg',
        url: '',
        uploadTime: '2026-03-11 17:00:00',
        uploader: '吴九',
        status: 'approved',
        checkComment: '照片清晰，治理效果明显'
      },
      {
        id: 'MAT006',
        type: 'video',
        name: '治理过程视频.mp4',
        url: '',
        uploadTime: '2026-03-11 18:00:00',
        uploader: '吴九',
        status: 'approved',
        checkComment: '视频完整，时长45秒'
      }
    ],
    autoCheckResult: {
      timeliness: true,
      completeness: true,
      quality: true,
      dataConsistency: true,
      checkTime: '2026-03-11 19:00:00',
      details: ['时效性核查通过', '材料完整性核查通过', '质量核查通过', '数据一致性核查通过']
    },
    manualCheckResult: {
      materialAuthenticity: true,
      executionCompleteness: true,
      resultEffectiveness: true,
      checkPerson: '郑十',
      checkTime: '2026-03-12 10:00:00',
      checkComment: '治理效果良好，符合安全标准',
      conclusion: '通过'
    },
    points: 15,
    performanceScore: 18
  },
  {
    id: 'GD202603090001',
    title: '网格云工单处理督办',
    type: '供指类',
    priority: 'yellow',
    department: '供指中心',
    responsibilityUnit: '网格一',
    responsiblePerson: '钱十一',
    supervisor: '孙十二',
    supervisorDepartment: '供指中心',
    description: '网格云工单处理及时率偏低，需加强工单处理效率',
    executionStandard: '1. 分析超期工单原因\n2. 制定改进措施\n3. 加强人员培训\n4. 建立预警机制',
    completionDeadline: '2026-03-12 18:00:00',
    acceptanceStandard: '工单处理及时率达到98%以上',
    status: '已闭环',
    progress: 100,
    createTime: '2026-03-09 09:00:00',
    receiveTime: '2026-03-09 10:00:00',
    completeTime: '2026-03-10 17:00:00',
    acceptanceTime: '2026-03-11 10:00:00',
    closeTime: '2026-03-11 14:00:00',
    executionResult: '已完成工单处理流程优化，建立预警机制，处理及时率提升至98.5%',
    materials: [
      {
        id: 'MAT007',
        type: 'document',
        name: '改进措施方案.docx',
        url: '',
        uploadTime: '2026-03-10 10:00:00',
        uploader: '钱十一',
        status: 'approved',
        checkComment: '方案完整可行'
      },
      {
        id: 'MAT008',
        type: 'document',
        name: '培训记录.xlsx',
        url: '',
        uploadTime: '2026-03-10 16:00:00',
        uploader: '钱十一',
        status: 'approved',
        checkComment: '培训记录完整'
      }
    ],
    autoCheckResult: {
      timeliness: true,
      completeness: true,
      quality: true,
      dataConsistency: true,
      checkTime: '2026-03-10 18:00:00',
      details: ['时效性核查通过', '材料完整性核查通过', '质量核查通过', '数据一致性核查通过']
    },
    manualCheckResult: {
      materialAuthenticity: true,
      executionCompleteness: true,
      resultEffectiveness: true,
      checkPerson: '孙十二',
      checkTime: '2026-03-11 10:00:00',
      checkComment: '改进效果明显，达到预期目标',
      conclusion: '通过'
    },
    points: 12,
    performanceScore: 14.4
  }
]
