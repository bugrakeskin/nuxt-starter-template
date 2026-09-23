import { dashboardPatterns, dashboardShowcaseData } from '~/data/dashboard-showcase'

export function useDashboardShowcase() {
  return {
    data: dashboardShowcaseData,
    patterns: dashboardPatterns
  }
}
