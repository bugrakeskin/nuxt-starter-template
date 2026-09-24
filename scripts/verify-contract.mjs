import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { parse } from 'yaml'

const root = new URL('../', import.meta.url)
const contract = parse(await readFile(new URL('.unfogy/starter.yaml', root), 'utf8'))
const packageJson = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
const envExample = await readFile(new URL('.env.example', root), 'utf8')
const healthHandler = await readFile(new URL('server/api/health.get.ts', root), 'utf8')
const dockerfile = await readFile(new URL('Dockerfile', root), 'utf8')
const canaryDockerfile = await readFile(new URL('deploy/canary/Dockerfile', root), 'utf8')
const validateWorkflow = parse(await readFile(new URL('.woodpecker/validate.yaml', root), 'utf8'))
const previewWorkflow = parse(await readFile(new URL('.woodpecker/preview.yaml', root), 'utf8'))
const mainWorkflow = parse(await readFile(new URL('.woodpecker/main.yaml', root), 'utf8'))
const canaryWorkflow = parse(await readFile(new URL('.woodpecker/bootstrap-canary.yaml', root), 'utf8'))

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
assert.match(healthHandler, /revision:\s*config\.buildRevision/)
assert.match(dockerfile, /ARG BUILD_REVISION/)
assert.match(dockerfile, /org\.opencontainers\.image\.revision=\$BUILD_REVISION/)

assert.deepEqual(validateWorkflow.when, [
  { event: 'pull_request' },
  { event: 'push', branch: ['feature/*', 'preview', 'main'] }
])
assert.equal(JSON.stringify(validateWorkflow).includes('from_secret'), false, 'validation must not receive secrets')

assert.deepEqual(previewWorkflow.depends_on, ['validate'])
const previewBuild = previewWorkflow.steps.find(step => step.name === 'preview-image')
assert.equal(previewBuild.image, 'woodpeckerci/plugin-docker-buildx@sha256:0a8e69cad4a25d641bdb51daea53ce309692c7bda1193ae04a990bb88486edd8')
assert.equal(previewBuild.dns, '10.77.30.1')
assert.equal(previewBuild.settings.custom_dns, '10.77.30.1')
assert.deepEqual(previewBuild.settings.tags, ['${CI_COMMIT_SHA}', 'preview'])
assert.equal(previewBuild.settings.build_args, 'BUILD_REVISION=${CI_COMMIT_SHA}')
assert.deepEqual(previewBuild.settings.cache_images, ['registry.unfogy.com/${CI_REPO_NAME}/cache-stable'])
assert.equal(previewBuild.settings.username.from_secret, 'harbor_app_push_username')
assert.equal(previewBuild.settings.password.from_secret, 'harbor_app_push_password')
const previewScan = previewWorkflow.steps.find(step => step.name === 'verify-harbor-scan')
assert.equal(previewScan.dns, '10.77.30.1')
assert.equal(previewScan.environment.HARBOR_PROJECT, '${CI_REPO_NAME}')
assert.equal(previewScan.environment.HARBOR_REPOSITORY, 'app')
assert.equal(previewScan.environment.HARBOR_REFERENCE, '${CI_COMMIT_SHA}')
assert.equal(previewScan.environment.HARBOR_USERNAME.from_secret, 'harbor_app_push_username')
assert.equal(previewScan.environment.HARBOR_PASSWORD.from_secret, 'harbor_app_push_password')
assert.ok(previewWorkflow.steps.indexOf(previewScan) < previewWorkflow.steps.findIndex(step => step.name === 'deploy-preview'))
const deployStep = previewWorkflow.steps.find(step => step.name === 'deploy-preview')
assert.equal(deployStep.dns, '10.77.30.1')
assert.equal(deployStep.environment.COOLIFY_DEPLOY_TOKEN.from_secret, 'coolify_deploy_token')
assert.equal(deployStep.environment.COOLIFY_PREVIEW_RESOURCE_UUID.from_secret, 'coolify_preview_resource_uuid')
assert.match(deployStep.commands.join('\n'), /--request POST/)
assert.match(deployStep.commands.join('\n'), /https:\/\/platform\.unfogy\.com\/api\/v1\/deploy\?uuid=/)
assert.match(deployStep.commands.join('\n'), /force=false/)
const verifyStep = previewWorkflow.steps.find(step => step.name === 'verify-preview-revision')
assert.equal(verifyStep.environment.PREVIEW_HEALTH_URL.from_secret, 'preview_health_url')
assert.match(verifyStep.commands.join('\n'), /CI_COMMIT_SHA/)

assert.deepEqual(mainWorkflow.depends_on, ['validate'])
const mainBuild = mainWorkflow.steps.find(step => step.name === 'main-image')
assert.equal(mainBuild.image, 'woodpeckerci/plugin-docker-buildx@sha256:0a8e69cad4a25d641bdb51daea53ce309692c7bda1193ae04a990bb88486edd8')
assert.equal(mainBuild.dns, '10.77.30.1')
assert.equal(mainBuild.settings.custom_dns, '10.77.30.1')
assert.deepEqual(mainBuild.settings.tags, ['${CI_COMMIT_SHA}'])
assert.equal(mainBuild.settings.build_args, 'BUILD_REVISION=${CI_COMMIT_SHA}')
assert.equal(mainBuild.settings.username.from_secret, 'harbor_app_push_username')
assert.equal(mainBuild.settings.password.from_secret, 'harbor_app_push_password')
const mainScan = mainWorkflow.steps.find(step => step.name === 'verify-harbor-scan')
assert.equal(mainScan.environment.HARBOR_REFERENCE, '${CI_COMMIT_SHA}')
assert.equal(mainScan.environment.HARBOR_USERNAME.from_secret, 'harbor_app_push_username')
assert.equal(mainScan.environment.HARBOR_PASSWORD.from_secret, 'harbor_app_push_password')
assert.equal(JSON.stringify(mainWorkflow).includes('coolify_'), false, 'main must not deploy runtime state')

assert.deepEqual(canaryWorkflow.when, [{ event: 'manual' }])
const canaryBuild = canaryWorkflow.steps.find(step => step.name === 'canary-image')
assert.equal(canaryBuild.image, 'woodpeckerci/plugin-docker-buildx@sha256:0a8e69cad4a25d641bdb51daea53ce309692c7bda1193ae04a990bb88486edd8')
assert.equal(canaryBuild.dns, '10.77.30.1')
assert.equal(canaryBuild.settings.custom_dns, '10.77.30.1')
assert.equal(canaryBuild.settings.repo, 'registry.unfogy.com/unfogy-canary/runtime')
assert.deepEqual(canaryBuild.settings.tags, ['${CI_COMMIT_SHA}'])
assert.equal(canaryBuild.settings.context, 'deploy/canary')
assert.equal(canaryBuild.settings.dockerfile, 'deploy/canary/Dockerfile')
assert.equal(canaryBuild.settings.build_args, 'BUILD_REVISION=${CI_COMMIT_SHA}')
assert.deepEqual(canaryBuild.settings.cache_images, ['registry.unfogy.com/unfogy-canary/cache-canary'])
assert.equal(canaryBuild.settings.username.from_secret, 'harbor_canary_push_username')
assert.equal(canaryBuild.settings.password.from_secret, 'harbor_canary_push_password')
assert.match(canaryDockerfile, /^FROM busybox:1\.37\.0-musl@sha256:[a-f0-9]{64}$/m)
assert.match(canaryDockerfile, /EXPOSE 8080/)
assert.match(canaryDockerfile, /BUILD_REVISION/)

console.log(`Starter contract v${contract.contractVersion}, delivery v${contract.delivery.contractVersion} is valid.`)
