import { pathToFileURL } from 'node:url'

const SUCCESS = 'Success'
const IN_PROGRESS = new Set(['Pending', 'Running', 'Scheduled'])
const FAILED = new Set(['Error', 'Stopped'])

export function evaluateScanOverview(scanOverview) {
  if (!scanOverview || typeof scanOverview !== 'object' || Array.isArray(scanOverview)) {
    return { state: 'pending', reason: 'scan overview is not available' }
  }

  const reports = Object.values(scanOverview)
  if (reports.length === 0) {
    return { state: 'pending', reason: 'scan overview is empty' }
  }

  let critical = 0
  for (const report of reports) {
    if (!report || typeof report !== 'object') {
      return { state: 'failed', reason: 'scan report is malformed' }
    }

    const status = report.scan_status
    if (FAILED.has(status)) {
      return { state: 'failed', reason: `scan finished with status ${status}` }
    }
    if (IN_PROGRESS.has(status)) {
      return { state: 'pending', reason: `scan is ${status}` }
    }
    if (status !== SUCCESS) {
      return { state: 'failed', reason: `scan returned unexpected status ${String(status)}` }
    }

    const counts = report.summary?.summary
    if (!counts || typeof counts !== 'object' || Array.isArray(counts)) {
      return { state: 'failed', reason: 'successful scan has no vulnerability summary' }
    }

    const reportCritical = counts.Critical ?? 0
    if (!Number.isInteger(reportCritical) || reportCritical < 0) {
      return { state: 'failed', reason: 'scan returned an invalid Critical count' }
    }
    critical += reportCritical
  }

  if (critical > 0) {
    return { state: 'failed', reason: `scan found ${critical} Critical vulnerabilities` }
  }
  return { state: 'passed', critical }
}

function requiredEnvironment(name) {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is required`)
  return value
}

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))

async function main() {
  const baseUrl = (process.env.HARBOR_BASE_URL || 'https://registry.unfogy.com').replace(/\/$/, '')
  const project = requiredEnvironment('HARBOR_PROJECT')
  const repository = requiredEnvironment('HARBOR_REPOSITORY')
  const reference = requiredEnvironment('HARBOR_REFERENCE')
  const username = requiredEnvironment('HARBOR_USERNAME')
  const password = requiredEnvironment('HARBOR_PASSWORD')
  const maxAttempts = Number.parseInt(process.env.HARBOR_SCAN_MAX_ATTEMPTS || '60', 10)
  const intervalMs = Number.parseInt(process.env.HARBOR_SCAN_INTERVAL_MS || '5000', 10)

  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) throw new Error('HARBOR_SCAN_MAX_ATTEMPTS must be a positive integer')
  if (!Number.isInteger(intervalMs) || intervalMs < 0) throw new Error('HARBOR_SCAN_INTERVAL_MS must be a non-negative integer')

  const artifactUrl = new URL(
    `/api/v2.0/projects/${encodeURIComponent(project)}/repositories/${encodeURIComponent(repository)}/artifacts/${encodeURIComponent(reference)}`,
    baseUrl
  )
  artifactUrl.searchParams.set('with_scan_overview', 'true')

  const authorization = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const response = await fetch(artifactUrl, {
      headers: {
        'Authorization': authorization,
        'Accept': 'application/json',
        'X-Accept-Vulnerabilities': 'application/vnd.security.vulnerability.report; version=1.1'
      }
    })

    if (response.status === 401 || response.status === 403) {
      throw new Error(`Harbor scan read is unauthorized (${response.status})`)
    }
    if (response.ok) {
      const artifact = await response.json()
      const result = evaluateScanOverview(artifact.scan_overview)
      if (result.state === 'passed') {
        console.log(`Harbor scan passed for ${project}/${repository}:${reference}; Critical=0`)
        return
      }
      if (result.state === 'failed') throw new Error(result.reason)
      console.log(`Harbor scan pending (${attempt}/${maxAttempts}): ${result.reason}`)
    } else if (response.status === 404 || response.status >= 500) {
      console.log(`Harbor artifact/scan is not ready (${attempt}/${maxAttempts}); HTTP ${response.status}`)
    } else {
      throw new Error(`Harbor scan read failed with HTTP ${response.status}`)
    }

    if (attempt < maxAttempts) await wait(intervalMs)
  }

  throw new Error(`Harbor scan did not complete within ${maxAttempts} attempts`)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
