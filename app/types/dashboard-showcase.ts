export type DashboardPatternId
  = | 'sidebar'
    | 'icon-sidebar'
    | 'horizontal'
    | 'three-column'
    | 'bento'
    | 'report'

export interface DashboardKpi {
  label: string
  value: string
  change: string
  trend: 'up' | 'down' | 'steady'
  icon: string
}

export interface DashboardActivity {
  title: string
  detail: string
  time: string
  status: 'success' | 'warning' | 'neutral'
}

export interface DashboardTableRow {
  name: string
  owner: string
  status: 'On track' | 'Review' | 'At risk'
  progress: number
  updated: string
}

export interface DashboardShowcaseData {
  kpis: DashboardKpi[]
  trend: { label: string, value: number }[]
  activities: DashboardActivity[]
  rows: DashboardTableRow[]
}

export interface DashboardPattern {
  id: DashboardPatternId
  label: string
  description: string
  icon: string
}
