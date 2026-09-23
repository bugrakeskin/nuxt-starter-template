import type { DashboardPattern, DashboardPatternId, DashboardShowcaseData } from '~/types/dashboard-showcase'

export const dashboardPatterns: readonly DashboardPattern[] = [
  { id: 'sidebar', label: 'Sidebar canvas', description: 'Persistent sidebar with a focused main canvas.', icon: 'i-lucide-panel-left' },
  { id: 'icon-sidebar', label: 'Icon sidebar', description: 'Compact navigation with a dense data table.', icon: 'i-lucide-panel-left-dashed' },
  { id: 'horizontal', label: 'Horizontal navigation', description: 'A wide canvas with a top-level navigation bar.', icon: 'i-lucide-panel-top' },
  { id: 'three-column', label: 'Three-column workspace', description: 'Navigation, working area and activity in one view.', icon: 'i-lucide-columns-3' },
  { id: 'bento', label: 'Bento analytics', description: 'Flexible cards for metrics and visual summaries.', icon: 'i-lucide-layout-dashboard' },
  { id: 'report', label: 'Tabbed report', description: 'A calm single-column view for detailed reporting.', icon: 'i-lucide-file-chart-column' }
] as const

export const dashboardShowcaseData: DashboardShowcaseData = {
  kpis: [
    { label: 'Active work', value: '24', change: '+12.4%', trend: 'up', icon: 'i-lucide-briefcase-business' },
    { label: 'Healthy services', value: '18/18', change: 'Stable', trend: 'steady', icon: 'i-lucide-heart-pulse' },
    { label: 'Waiting review', value: '7', change: '-4.2%', trend: 'down', icon: 'i-lucide-message-square-more' },
    { label: 'Delivery rate', value: '92%', change: '+8.1%', trend: 'up', icon: 'i-lucide-gauge' }
  ],
  trend: [
    { label: 'Mon', value: 42 }, { label: 'Tue', value: 58 }, { label: 'Wed', value: 49 },
    { label: 'Thu', value: 76 }, { label: 'Fri', value: 68 }, { label: 'Sat', value: 84 }, { label: 'Sun', value: 72 }
  ],
  activities: [
    { title: 'Environment verified', detail: 'Staging checks completed', time: '8 min ago', status: 'success' },
    { title: 'Review requested', detail: 'New delivery needs attention', time: '42 min ago', status: 'warning' },
    { title: 'Work item updated', detail: 'Design baseline changed', time: '2 hours ago', status: 'neutral' },
    { title: 'Team member added', detail: 'A new collaborator joined', time: 'Yesterday', status: 'success' }
  ],
  rows: [
    { name: 'Customer portal', owner: 'Aylin Kaya', status: 'On track', progress: 82, updated: 'Today, 09:40' },
    { name: 'Operations hub', owner: 'Mert Demir', status: 'Review', progress: 64, updated: 'Today, 08:15' },
    { name: 'Reporting workspace', owner: 'Deniz Yılmaz', status: 'At risk', progress: 38, updated: 'Yesterday' },
    { name: 'Internal tools', owner: 'Selin Aras', status: 'On track', progress: 91, updated: 'Yesterday' }
  ]
}

export function getDashboardPattern(id: string): DashboardPattern | undefined {
  return dashboardPatterns.find(pattern => pattern.id === id)
}

export function isDashboardPatternId(value: string): value is DashboardPatternId {
  return dashboardPatterns.some(pattern => pattern.id === value)
}
