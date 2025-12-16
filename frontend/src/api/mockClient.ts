export type StatusLevel = 'normal' | 'warning' | 'critical'

export type OverviewMetric = {
  id: string
  title: string
  value: string
  helper?: string
  trend?: number
  status: StatusLevel
}

export type TimelinePoint = {
  label: string
  powerMw: number
  soc: number
  carbonIntensity: number
}

export type DispatchOrder = {
  id: string
  scope: string
  target: string
  action: string
  start: string
  status: 'pending' | 'running' | 'done'
  risk: 'low' | 'medium' | 'high'
}

export type DispatchGuardrail = {
  id: string
  title: string
  detail: string
  state: 'active' | 'pending'
}

export type CarbonSummary = {
  id: string
  boundary: string
  factor: string
  intensity: string
  updatedAt: string
  note?: string
}

export type CarbonTrendPoint = {
  label: string
  emissions: number
}

export type AuditEvent = {
  id: string
  action: string
  scope: string
  at: string
  actor: string
  result: 'success' | 'warning' | 'failed'
}

const wait = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchOverviewMetrics(): Promise<OverviewMetric[]> {
  await wait()
  return [
    {
      id: 'power',
      title: '实时功率 (MW)',
      value: '128.4',
      helper: '含光伏/风/储能出力',
      trend: 4.6,
      status: 'normal',
    },
    {
      id: 'soc',
      title: '储能 SoC',
      value: '72%',
      helper: '分三组运行',
      trend: -3.2,
      status: 'normal',
    },
    {
      id: 'carbon',
      title: '碳强度 (kgCO₂/MWh)',
      value: '392',
      helper: '口径：网购 + 绿电直供',
      trend: -6.4,
      status: 'warning',
    },
    {
      id: 'alerts',
      title: '告警/受限',
      value: '3',
      helper: '互斥策略已生效',
      trend: 0,
      status: 'critical',
    },
  ]
}

export async function fetchOverviewTimeline(): Promise<TimelinePoint[]> {
  await wait()
  return [
    { label: '10:00', powerMw: 112, soc: 78, carbonIntensity: 428 },
    { label: '10:10', powerMw: 118, soc: 77, carbonIntensity: 415 },
    { label: '10:20', powerMw: 122, soc: 76, carbonIntensity: 402 },
    { label: '10:30', powerMw: 130, soc: 75, carbonIntensity: 398 },
    { label: '10:40', powerMw: 128, soc: 74, carbonIntensity: 395 },
    { label: '10:50', powerMw: 133, soc: 73, carbonIntensity: 392 },
    { label: '11:00', powerMw: 127, soc: 72, carbonIntensity: 390 },
    { label: '11:10', powerMw: 129, soc: 71, carbonIntensity: 388 },
    { label: '11:20', powerMw: 132, soc: 70, carbonIntensity: 386 },
    { label: '11:30', powerMw: 128, soc: 70, carbonIntensity: 384 },
    { label: '11:40', powerMw: 126, soc: 70, carbonIntensity: 383 },
    { label: '11:50', powerMw: 131, soc: 70, carbonIntensity: 382 },
  ]
}

export async function fetchDispatchQueue(): Promise<DispatchOrder[]> {
  await wait()
  return [
    {
      id: 'D-1032',
      scope: '园区 A / 储能组 1',
      target: 'PCS-01',
      action: '充电功率降至 2.5MW，30 分钟',
      start: '11:05',
      status: 'running',
      risk: 'medium',
    },
    {
      id: 'D-1033',
      scope: '园区 B / 直流充电群',
      target: 'DC-Cluster',
      action: '削峰：削减 15% 峰值负荷',
      start: '11:10',
      status: 'pending',
      risk: 'low',
    },
    {
      id: 'D-1031',
      scope: '园区 A / 光伏逆变 3#',
      target: 'PV-03',
      action: '切换至无功支撑 +3%',
      start: '10:55',
      status: 'done',
      risk: 'low',
    },
  ]
}

export async function fetchDispatchGuardrails(): Promise<DispatchGuardrail[]> {
  await wait()
  return [
    {
      id: 'g-1',
      title: '策略互斥',
      detail: '同一馈线仅允许一条调度链路执行；互斥策略自动排队。',
      state: 'active',
    },
    {
      id: 'g-2',
      title: '速率限制',
      detail: '储能功率变化速率 ≤ 10%/min；支持人工覆盖但需双人复核。',
      state: 'active',
    },
    {
      id: 'g-3',
      title: '碳口径一致',
      detail: '调度模拟与核算均使用因子 v2025.01，变更留痕并可回放。',
      state: 'pending',
    },
    {
      id: 'g-4',
      title: '可回退',
      detail: '每条指令生成令牌，异常自动回退至安全档位。',
      state: 'active',
    },
  ]
}

export async function fetchCarbonSummaries(): Promise<CarbonSummary[]> {
  await wait()
  return [
    {
      id: 'c-park-a',
      boundary: '园区 A · 综合能源站',
      factor: '0.693 kgCO₂/kWh',
      intensity: '392 kgCO₂/MWh',
      updatedAt: '2025-12-16 11:45',
      note: '口径：网购 + 光伏直供；因子版本 v2025.01',
    },
    {
      id: 'c-park-b',
      boundary: '园区 B · 绿电直连',
      factor: '0.102 kgCO₂/kWh',
      intensity: '74 kgCO₂/MWh',
      updatedAt: '2025-12-16 11:40',
      note: '口径：绿电直供 + 部分市电兜底',
    },
    {
      id: 'c-ev',
      boundary: '充电站群',
      factor: '0.410 kgCO₂/kWh',
      intensity: '268 kgCO₂/MWh',
      updatedAt: '2025-12-16 11:30',
    },
  ]
}

export async function fetchCarbonTrend(): Promise<CarbonTrendPoint[]> {
  await wait()
  return [
    { label: '周一', emissions: 12.8 },
    { label: '周二', emissions: 13.1 },
    { label: '周三', emissions: 11.4 },
    { label: '周四', emissions: 10.9 },
    { label: '周五', emissions: 11.1 },
    { label: '周六', emissions: 9.6 },
    { label: '周日', emissions: 8.8 },
  ]
}

export async function fetchAuditEvents(): Promise<AuditEvent[]> {
  await wait()
  return [
    {
      id: 'a-1',
      action: '储能回退命令',
      scope: '园区 A / PCS-01',
      at: '11:18',
      actor: 'ops.zhang',
      result: 'success',
    },
    {
      id: 'a-2',
      action: '下发调度令 D-1032',
      scope: '园区 A / 储能组 1',
      at: '11:05',
      actor: 'strategy.pipeline',
      result: 'success',
    },
    {
      id: 'a-3',
      action: '碳因子切换审批',
      scope: '全局',
      at: '10:40',
      actor: 'audit.liu',
      result: 'warning',
    },
    {
      id: 'a-4',
      action: 'MQTT 通道重连',
      scope: '园区 B / 网关-DC',
      at: '10:15',
      actor: 'system',
      result: 'success',
    },
  ]
}
