import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const git = (root, ...args) => {
  const output = execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  return args.includes('-z') ? output : output.trim()
}
const matches = (path, paths) => paths.some(prefix => prefix.endsWith('/') ? path.startsWith(prefix) : path === prefix)
export function parseVersion(value) {
  assert.equal(value.trim(), value, 'Version must not contain surrounding whitespace')
  assert.match(value, /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/, 'The repository release source must be stable MAJOR.MINOR.PATCH')
  const parts = value.split('.').map(Number)
  assert.ok(parts.every(Number.isSafeInteger), 'Version components must be safe integers')
  return parts
}
export function nextVersion(previous, impact, stabilize = false) {
  const [major, minor, patch] = parseVersion(previous)
  assert.ok(['patch', 'minor', 'major'].includes(impact), 'Declare patch, minor or major release impact')
  if (stabilize) {
    assert.ok(major === 0 && impact === 'major', 'Stabilization requires a 0.x major impact')
    return '1.0.0'
  }
  if (impact === 'major' && major > 0) return `${major + 1}.0.0`
  if (impact !== 'patch') return `${major}.${minor + 1}.0`
  return `${major}.${minor}.${patch + 1}`
}
function read(root, path, ref) {
  if (!ref) return readFileSync(resolve(root, path), 'utf8')
  const names = git(root, 'ls-tree', '--name-only', ref, '--', path)
  return names ? git(root, 'show', `${ref}:${path}`) : null
}
function versionAt(root, source, ref) {
  const text = read(root, source, ref)
  return text === null ? null : source.endsWith('.json') ? JSON.parse(text).version : text.trim()
}
export function runtimeChanged(root, paths, config, base) {
  return paths.some((path) => {
    if (path === 'Dockerfile' && base) {
      const normalize = text => text.replace(/^ARG BUILD_VERSION=.+$/m, 'ARG BUILD_VERSION').trim()
      return normalize(read(root, path, base)) !== normalize(read(root, path))
    }
    if (path === 'package.json' && base) {
      const old = JSON.parse(read(root, path, base))
      const current = JSON.parse(read(root, path))
      // Repository version/identity and local verification scripts do not alter the application bundle.
      for (const object of [old, current]) {
        delete object.version
        delete object.name
        for (const key of ['version:sync', 'version:verify']) delete object.scripts?.[key]
      }
      return JSON.stringify(old) !== JSON.stringify(current)
    }
    return matches(path, config.runtimePaths)
  })
}
export function verify(root, { base, sync = false, metadataOnly = false, image = false } = {}) {
  const config = JSON.parse(read(root, '.unfogy/versioning.json'))
  assert.equal(config.policy, 'unfogy-semver-v1')
  assert.ok(['package.json', 'VERSION'].includes(config.source), 'Unsupported version source')
  assert.ok(Array.isArray(config.runtimePaths) && Array.isArray(config.releasePaths))
  const version = versionAt(root, config.source)
  parseVersion(version)
  const notesPath = `.unfogy/releases/${version}.json`
  const notes = JSON.parse(read(root, notesPath))
  assert.ok(['patch', 'minor', 'major', 'initial'].includes(notes.impact))
  assert.ok(typeof notes.summary === 'string' && notes.summary.trim().length > 0, 'Release notes need a summary')
  if (notes.impact === 'major') assert.ok(typeof notes.breaking === 'string' && notes.breaking.trim(), 'Breaking changes need compatibility/recovery notes')
  if (notes.stabilize) assert.ok(typeof notes.compatibility === 'string' && notes.compatibility.trim(), 'Record the reviewed stable compatibility promise')
  for (const path of config.linkedPackages || []) {
    const pkg = JSON.parse(read(root, path))
    if (sync) {
      pkg.version = version
      writeFileSync(resolve(root, path), `${JSON.stringify(pkg, null, 2)}\n`)
    } else assert.equal(pkg.version, version, `${path} must match ${config.source}`)
  }
  if (existsSync(resolve(root, 'Dockerfile'))) {
    const docker = read(root, 'Dockerfile')
    assert.match(docker, /^ARG BUILD_VERSION=.+$/m, 'Dockerfile needs a generated version argument')
    if (sync) writeFileSync(resolve(root, 'Dockerfile'), docker.replace(/^ARG BUILD_VERSION=.+$/m, `ARG BUILD_VERSION=${version}`))
    else assert.equal(docker.match(/^ARG BUILD_VERSION=(.+)$/m)[1], version, 'Run version:sync; Docker metadata differs from the release source')
  }
  const buildVersion = process.env.BUILD_VERSION
  if (buildVersion) assert.equal(buildVersion, version, 'Build override differs from the release source')
  assert.equal(typeof notes.runtime, 'boolean', 'Release notes must declare application runtime impact')
  const markerPath = '.unfogy/runtime-release.json'
  if (notes.runtime) {
    if (sync) writeFileSync(resolve(root, markerPath), `${JSON.stringify({ version }, null, 2)}\n`)
    else assert.equal(JSON.parse(read(root, markerPath)).version, version, 'Run version:sync; runtime release marker is stale')
  }
  if (image) assert.equal(notes.runtime, true, 'This release has no application image; do not run a manual build')
  assert.ok(!(metadataOnly && image), 'Image eligibility requires the exact source delta')
  if (metadataOnly) return { version }
  let runtimeImpact = false
  if (base) {
    base = git(root, 'rev-parse', '--verify', '--end-of-options', `${base}^{commit}`)
    const previous = versionAt(root, config.source, base)
    const paths = git(root, 'diff', '--name-only', '-z', base, '--').split('\0').filter(Boolean)
    const untracked = git(root, 'ls-files', '--others', '--exclude-standard', '-z').split('\0').filter(Boolean)
    paths.push(...untracked)
    if (previous !== null) {
      parseVersion(previous)
      if (version !== previous) assert.equal(version, nextVersion(previous, notes.impact, notes.stabilize === true), 'Incorrect increment against the exact base; refresh the candidate')
      else assert.equal(paths.some(path => matches(path, config.releasePaths)), false, 'Release-affecting changes require a version increment and new release notes')
    } else assert.equal(notes.impact, 'initial', 'A new version source needs initial release provenance')
    for (const path of paths.filter(path => path.startsWith('.unfogy/releases/'))) {
      assert.equal(read(root, path, base), null, 'Existing release notes are immutable')
    }
    runtimeImpact = runtimeChanged(root, paths, config, base)
    if (version !== previous) assert.equal(notes.runtime, runtimeImpact, 'Declared runtime impact differs from the actual application inputs')
    if (runtimeImpact) assert.ok(paths.includes(markerPath), 'Application changes require a new native publication marker')
    else assert.equal(paths.includes(markerPath), false, 'Non-runtime changes must not request an application image')
    if (version !== previous) {
      const tags = git(root, 'tag', '--list', `v${version}`)
      if (tags) assert.equal(git(root, 'rev-parse', `refs/tags/v${version}^{commit}`), git(root, 'rev-parse', 'HEAD'), 'Version already belongs to another commit')
    }
  }
  if (image) assert.ok(base && runtimeImpact, 'No runtime change in the exact candidate; reuse its existing artifact instead of building')
  return { version, base: base || null, runtimeImpact }
}
export function ciBase(root) {
  const branchBase = () => {
    const current = git(root, 'rev-parse', 'origin/main')
    const base = git(root, 'merge-base', 'HEAD', current)
    assert.equal(base, current, 'Refresh the branch against current main before version verification')
    return base
  }
  const event = process.env.CI_PIPELINE_EVENT
  if (event === 'pull_request') {
    assert.equal(process.env.CI_COMMIT_TARGET_BRANCH || 'main', 'main', 'Version checks require the reviewed main target')
    return branchBase()
  }
  if (event === 'push') {
    return process.env.CI_COMMIT_BRANCH === 'main' ? git(root, 'rev-parse', 'HEAD^1') : branchBase()
  }
  assert.equal(event, 'manual', 'CI version checks require an admitted event')
  return process.env.CI_COMMIT_BRANCH === 'main' ? git(root, 'rev-parse', 'HEAD^1') : branchBase()
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2)
    assert.ok(args.every(arg => ['--sync', '--ci', '--metadata-only', '--image'].includes(arg) || /^--base=.+$/.test(arg)), 'Unknown version verification argument')
    const root = resolve(fileURLToPath(new URL('../../', import.meta.url)))
    const explicitBase = args.find(arg => arg.startsWith('--base='))?.slice(7)
    const ci = args.includes('--ci')
    const result = verify(root, { base: explicitBase || (ci ? ciBase(root) : undefined), sync: args.includes('--sync'), metadataOnly: args.includes('--metadata-only'), image: args.includes('--image') })
    console.log(JSON.stringify({ status: 'PASS', ...result }))
  } catch (error) {
    console.error(`Version verification failed: ${error.message}`)
    process.exitCode = 1
  }
}
