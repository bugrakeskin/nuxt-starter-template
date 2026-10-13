import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { verify, nextVersion, parseVersion, ciBase } from './verify-version.mjs'

test('version increments preserve SemVer and explicit 0.x breaking semantics', () => {
  assert.equal(nextVersion('1.2.3', 'patch'), '1.2.4')
  assert.equal(nextVersion('1.2.3', 'minor'), '1.3.0')
  assert.equal(nextVersion('1.2.3', 'major'), '2.0.0')
  assert.equal(nextVersion('0.2.3', 'major'), '0.3.0')
  assert.equal(nextVersion('0.2.3', 'major', true), '1.0.0')
  assert.throws(() => nextVersion('0.2.3', 'patch', true))
  for (const value of ['01.2.3', '1.02.3', '1.2', '1.2.3-production', '1.2.3\n']) assert.throws(() => parseVersion(value))
})
test('checks the exact base, missing bump, metadata drift, duplicate version and immutable notes', () => {
  const root = mkdtempSync(join(tmpdir(), 'unfogy-version-'))
  const git = (...args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim()
  const put = (path, text) => {
    mkdirSync(join(root, path, '..'), { recursive: true })
    writeFileSync(join(root, path), text)
  }
  const json = (path, value) => put(path, `${JSON.stringify(value, null, 2)}\n`)
  try {
    git('init', '-q')
    git('config', 'user.name', 'Synthetic test')
    git('config', 'user.email', 'synthetic@example.invalid')
    const pkg = { name: 'synthetic', version: '0.1.0', scripts: { build: 'node app.mjs' } }
    json('package.json', pkg)
    json('cli/package.json', { version: '0.1.0' })
    json('.unfogy/versioning.json', { policy: 'unfogy-semver-v1', source: 'package.json', linkedPackages: ['cli/package.json'], releasePaths: ['app/', 'app.mjs', 'cli/', 'package.json'], runtimePaths: ['app/', 'app.mjs', 'package.json'] })
    json('.unfogy/releases/0.1.0.json', { impact: 'initial', summary: 'Synthetic baseline', runtime: true })
    put('Dockerfile', 'ARG BUILD_VERSION=0.1.0\n')
    put('app.mjs', 'original')
    put('app/ş.vue', 'original')
    put('README.md', 'original')
    json('.unfogy/runtime-release.json', { version: '0.1.0' })
    git('add', '.')
    git('commit', '-qm', 'baseline')
    const base = git('rev-parse', 'HEAD')
    git('update-ref', 'refs/remotes/origin/main', base)
    process.env.CI_PIPELINE_EVENT = 'pull_request'
    assert.equal(ciBase(root), base)
    git('checkout', '-qb', 'main-divergence')
    put('other.txt', 'parallel change')
    git('add', '.')
    git('commit', '-qm', 'parallel main')
    git('update-ref', 'refs/remotes/origin/main', git('rev-parse', 'HEAD'))
    git('checkout', '--detach', base)
    assert.throws(() => ciBase(root), /Refresh the branch/)
    git('update-ref', 'refs/remotes/origin/main', base)
    delete process.env.CI_PIPELINE_EVENT
    put('README.md', 'documentation')
    assert.equal(verify(root, { base }).runtimeImpact, false)
    assert.throws(() => verify(root, { base, image: true }), /No runtime change/)
    put('app/ş.vue', 'updated')
    assert.throws(() => verify(root, { base }), /require a version increment/)
    put('app/ş.vue', 'original')
    put('app/new\nfile.vue', 'new')
    assert.throws(() => verify(root, { base }), /require a version increment/)
    rmSync(join(root, 'app/new\nfile.vue'))
    put('app.mjs', 'updated')
    assert.throws(() => verify(root, { base }), /require a version increment/)
    pkg.version = '0.2.0'
    json('package.json', pkg)
    json('.unfogy/releases/0.2.0.json', { impact: 'minor', summary: 'New behavior', runtime: true })
    assert.throws(() => verify(root, { base }), /must match/)
    verify(root, { sync: true })
    assert.equal(verify(root, { base }).runtimeImpact, true)
    process.env.BUILD_VERSION = '9.9.9'
    assert.throws(() => verify(root), /Build override/)
    delete process.env.BUILD_VERSION
    git('tag', 'v0.2.0')
    git('add', '.')
    git('commit', '-qm', 'candidate')
    assert.throws(() => verify(root, { base }), /another commit/)
    git('tag', '-d', 'v0.2.0')
    const current = git('rev-parse', 'HEAD')
    put('cli/command.mjs', 'new command')
    pkg.version = '0.2.1'
    json('package.json', pkg)
    json('.unfogy/releases/0.2.1.json', { impact: 'patch', summary: 'CLI correction', runtime: false })
    verify(root, { sync: true })
    assert.equal(verify(root, { base: current }).runtimeImpact, false, 'CLI release metadata must not trigger an app image')
    json('.unfogy/releases/0.1.0.json', { impact: 'initial', summary: 'changed history', runtime: true })
    assert.throws(() => verify(root, { base: current }), /immutable/)
    json('.unfogy/releases/0.1.0.json', { impact: 'initial', summary: 'Synthetic baseline', runtime: true })
    pkg.version = '0.3.0'
    json('package.json', pkg)
    json('.unfogy/releases/0.3.0.json', { impact: 'patch', summary: 'Wrong increment', runtime: false })
    verify(root, { sync: true })
    assert.throws(() => verify(root, { base: current }), /Incorrect increment/)
    assert.ok(readFileSync(join(root, 'Dockerfile'), 'utf8').includes('0.3.0'))
  } finally {
    delete process.env.BUILD_VERSION
    delete process.env.CI_PIPELINE_EVENT
    rmSync(root, { recursive: true, force: true })
  }
})
