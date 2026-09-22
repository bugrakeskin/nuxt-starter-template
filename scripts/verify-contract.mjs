import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { parse } from 'yaml'

const root = new URL('../', import.meta.url)
const contract = parse(await readFile(new URL('.unfogy/starter.yaml', root), 'utf8'))
const packageJson = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
const envExample = await readFile(new URL('.env.example', root), 'utf8')
const healthHandler = await readFile(new URL('server/api/health.get.ts', root), 'utf8')

assert.equal(Number.isInteger(contract.contractVersion), true, 'contractVersion must be an integer')
assert.equal(contract.contractVersion > 0, true, 'contractVersion must be positive')
assert.equal(contract.runtime.healthEndpoint, '/api/health')

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

console.log(`Starter contract v${contract.contractVersion} is valid.`)
