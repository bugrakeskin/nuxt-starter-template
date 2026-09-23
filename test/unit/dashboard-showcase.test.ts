import { describe, expect, it } from 'vitest'
import { dashboardPatterns, dashboardShowcaseData, getDashboardPattern, isDashboardPatternId } from '../../app/data/dashboard-showcase'

describe('dashboard showcase contract', () => {
  it('exposes six stable wireframe patterns', () => {
    expect(dashboardPatterns).toHaveLength(6)
    expect(new Set(dashboardPatterns.map(pattern => pattern.id)).size).toBe(6)
  })

  it('uses one shared fixture for every pattern', () => {
    expect(dashboardShowcaseData.kpis.length).toBeGreaterThan(0)
    expect(dashboardShowcaseData.trend.length).toBeGreaterThan(0)
    expect(dashboardShowcaseData.activities.length).toBeGreaterThan(0)
    expect(dashboardShowcaseData.rows.length).toBeGreaterThan(0)
  })

  it('rejects unknown wireframe ids', () => {
    expect(isDashboardPatternId('sidebar')).toBe(true)
    expect(getDashboardPattern('unknown')).toBeUndefined()
    expect(isDashboardPatternId('unknown')).toBe(false)
  })
})
