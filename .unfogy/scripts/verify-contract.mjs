import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { parse } from 'yaml'

const root = new URL('../../', import.meta.url)
const contract = parse(await readFile(new URL('.unfogy/contract.yaml', root), 'utf8'))
const packageJson = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
const envExample = await readFile(new URL('.env.example', root), 'utf8')
const healthHandler = await readFile(new URL('server/api/health.get.ts', root), 'utf8')
const dockerfile = await readFile(new URL('Dockerfile', root), 'utf8')
const validateWorkflow = parse(await readFile(new URL('.woodpecker/validate.yaml', root), 'utf8'))
const publishWorkflow = parse(await readFile(new URL('.woodpecker/publish.yaml', root), 'utf8'))

assert.equal(Number.isInteger(contract.contractVersion), true, 'contractVersion must be an integer')
assert.equal(contract.contractVersion > 0, true, 'contractVersion must be positive')
assert.equal(contract.tools.contractVerifier, '.unfogy/scripts/verify-contract.mjs')
assert.equal(contract.tools.harborScanVerifier, '.unfogy/scripts/verify-harbor-scan.mjs')
assert.equal(contract.application.root, '/')
assert.equal(contract.application.nodeMajor, 22)
assert.equal(contract.application.packageManager, 'pnpm@12.4.1')
assert.equal(contract.delivery.sourceRef, 'main')
assert.equal(contract.delivery.buildAuthority, 'woodpecker-dockerfile')
assert.equal(contract.delivery.artifactAuthority, 'harbor-immutable-image')
assert.equal(contract.delivery.runtimeAuthority, 'coolify-docker-image')
assert.equal(contract.runtime.healthEndpoint, '/api/health')
assert.equal(Number.isInteger(contract.delivery.contractVersion), true, 'delivery.contractVersion must be an integer')
assert.equal(contract.delivery.contractVersion > 0, true, 'delivery.contractVersion must be positive')
assert.equal(contract.delivery.runtime.start, 'node scripts/runtime-entrypoint.mjs')
assert.equal(contract.delivery.runtime.migrate, 'node .output/migrate.mjs')

await readFile(new URL(contract.delivery.dockerfile, root), 'utf8')
for (const workflow of contract.delivery.workflows) {
  await readFile(new URL(workflow, root), 'utf8')
}
await readFile(new URL(contract.tools.harborScanVerifier, root), 'utf8')

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
assert.match(healthHandler, /revision:\s*config\.buildRevision/)
assert.match(dockerfile, /ARG BUILD_REVISION/)
assert.match(dockerfile, /org\.opencontainers\.image\.revision=\$BUILD_REVISION/)
assert.match(dockerfile, /npm install --global --no-audit --no-fund pnpm@12\.4\.1/)
assert.equal(dockerfile.includes('corepack prepare'), false)
assert.match(dockerfile, /FROM node:22-alpine3\.23@sha256:[a-f0-9]{64} AS runtime/)
assert.match(dockerfile, /rm -rf \/usr\/local\/lib\/node_modules\/npm \/usr\/local\/lib\/node_modules\/corepack/)

assert.deepEqual(validateWorkflow.when, [
  { event: 'pull_request' },
  { event: 'push', branch: ['task/*', 'feature/*', 'main'] },
  { event: 'manual', branch: 'main' }
])
assert.equal(JSON.stringify(validateWorkflow).includes('from_secret'), false, 'validation must not receive secrets')
assert.ok(validateWorkflow.steps[0].commands.includes('npm install --global --no-audit --no-fund pnpm@12.4.1'))
assert.equal(JSON.stringify(validateWorkflow).includes('corepack prepare'), false)

assert.deepEqual(publishWorkflow.depends_on, ['validate'])
assert.deepEqual(publishWorkflow.when, [
  { event: 'push', branch: 'main' },
  { event: 'manual', branch: 'main' }
])
const publishBuild = publishWorkflow.steps.find(step => step.name === 'publish-image')
assert.equal(publishBuild.image, 'woodpeckerci/plugin-docker-buildx@sha256:0a8e69cad4a25d641bdb51daea53ce309692c7bda1193ae04a990bb88486edd8')
assert.equal(publishBuild.dns, '10.77.30.1')
assert.equal(publishBuild.settings.custom_dns, '10.77.30.1')
assert.deepEqual(publishBuild.settings.tags, ['${CI_COMMIT_SHA}'])
assert.equal(publishBuild.settings.build_args, 'BUILD_REVISION=${CI_COMMIT_SHA}')
assert.equal(publishBuild.settings.username.from_secret, 'harbor_app_push_username')
assert.equal(publishBuild.settings.password.from_secret, 'harbor_app_push_password')
const publishScan = publishWorkflow.steps.find(step => step.name === 'verify-harbor-scan')
assert.equal(publishScan.environment.HARBOR_REFERENCE, '${CI_COMMIT_SHA}')
assert.equal(publishScan.environment.HARBOR_USERNAME.from_secret, 'harbor_app_push_username')
assert.equal(publishScan.environment.HARBOR_PASSWORD.from_secret, 'harbor_app_push_password')
const serializedPublish = JSON.stringify(publishWorkflow)
for (const forbidden of ['coolify_', 'SUPABASE_DB_URL', 'preview_database_url', 'deployment']) {
  assert.equal(serializedPublish.includes(forbidden), false, `publish workflow must not contain ${forbidden}`)
}

console.log(`Starter contract v${contract.contractVersion}, delivery v${contract.delivery.contractVersion} is valid.`)
