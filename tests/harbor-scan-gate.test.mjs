import assert from 'node:assert/strict'
import test from 'node:test'

import { evaluateScanOverview } from '../scripts/verify-harbor-scan.mjs'

const report = (scanStatus, critical = 0) => ({
  scan_status: scanStatus,
  summary: { summary: { Critical: critical, High: 2 } }
})

test('passes only completed scans with zero Critical vulnerabilities', () => {
  assert.deepEqual(evaluateScanOverview({ report: report('Success') }), {
    state: 'passed',
    critical: 0
  })
})

test('keeps incomplete and missing scans pending', () => {
  assert.equal(evaluateScanOverview(undefined).state, 'pending')
  assert.equal(evaluateScanOverview({ report: report('Running') }).state, 'pending')
})

test('fails closed for scan errors, malformed summaries, and Critical findings', () => {
  assert.equal(evaluateScanOverview({ report: report('Error') }).state, 'failed')
  assert.equal(evaluateScanOverview({ report: { scan_status: 'Success' } }).state, 'failed')
  assert.equal(evaluateScanOverview({ report: report('Success', 1) }).state, 'failed')
  assert.equal(evaluateScanOverview({ report: report('Unknown') }).state, 'failed')
})
