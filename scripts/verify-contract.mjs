import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { parse } from 'yaml'

const root = new URL('../', import.meta.url)
const contract = parse(await readFile(new URL('.unfogy/starter.yaml', root), 'utf8'))
const packageJson = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
const envExample = await readFile(new URL('.env.example', root), 'utf8')
const healthHandler = await readFile(new URL('server/api/health.get.ts', root), 'utf8')
const pullRequestWorkflow = parse(await readFile(new URL('.woodpecker/build-pr.yaml', root), 'utf8'))
const protectedWorkflow = parse(await readFile(new URL('.woodpecker/build-protected.yaml', root), 'utf8'))

assert.equal(Number.isInteger(contract.contractVersion), true, 'contractVersion must be an integer')
assert.equal(contract.contractVersion > 0, true, 'contractVersion must be positive')
assert.equal(contract.runtime.healthEndpoint, '/api/health')
assert.equal(Number.isInteger(contract.delivery.contractVersion), true, 'delivery.contractVersion must be an integer')
assert.equal(contract.delivery.contractVersion > 0, true, 'delivery.contractVersion must be positive')
assert.equal(contract.delivery.runtime.start, 'node .output/server/index.mjs')
assert.equal(contract.delivery.runtime.migrate, 'node .output/migrate.mjs')

await readFile(new URL(contract.delivery.dockerfile, root), 'utf8')
for (const workflow of contract.delivery.workflows) {
  await readFile(new URL(workflow, root), 'utf8')
}

for (const [name, command] of Object.entries(contract.commands)) {
  const scriptName = name === 'migrate' ? 'db:migrate' : name
  assert.ok(packageJson.scripts[scriptName], `Missing package script: ${scriptName}`)
  assert.equal(command, `pnpm ${scriptName}`)
}

for (const name of contract.runtime.requiredEnvironment.public) {
  assert.match(envExample, new RegExp(`^${name}=`, 'm'), `Missing ${name} in .env.example`)
}

assert.match(healthHandler, new RegExp(`contractVersion:\\s*${contract.contractVersion}\\b`))
assert.equal(envExample.includes('SERVICE_ROLE'), false)
assert.equal(envExample.includes('SECRET_KEY'), false)
assert.match(packageJson.scripts.build, /pnpm build:migration/)

const pullRequestBuild = pullRequestWorkflow.steps.find(step => step.name === 'candidate-image')
assert.equal(pullRequestBuild.image, 'woodpeckerci/plugin-docker-buildx:5.0.0')
assert.equal(pullRequestBuild.settings.cache_images, undefined, 'PR builds must not write the stable cache')
assert.match(pullRequestBuild.settings.cache_from[0], /cache-stable$/)
assert.match(pullRequestBuild.settings.cache_to, /cache-pr-\$\{CI_COMMIT_PULL_REQUEST\}/)

const protectedBuild = protectedWorkflow.steps.find(step => step.name === 'protected-image')
assert.equal(protectedBuild.image, 'woodpeckerci/plugin-docker-buildx:5.0.0')
assert.deepEqual(protectedBuild.settings.cache_images, ['registry.unfogy.com/${CI_REPO_NAME}/cache-stable'])

console.log(`Starter contract v${contract.contractVersion}, delivery v${contract.delivery.contractVersion} is valid.`)
