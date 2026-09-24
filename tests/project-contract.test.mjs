import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const root = new URL('../', import.meta.url)

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, root), 'utf8'))
}

test('one MWO config carries the provisioning and deploy desired state', async () => {
  const schema = await readJson('.unfogy/schema/config.schema.json')
  assert.deepEqual(schema.required, [
    'schema_version', 'kind', 'customer_id', 'mwo_id', 'shortname',
    'template', 'server', 'preview', 'production'
  ])
  assert.equal(schema.properties.kind.const, 'UnfogyMWOConfig')
  assert.equal(schema.properties.customer_id.pattern, '^CST[0-9]+$')
  assert.equal(schema.properties.mwo_id.pattern, '^MWO[0-9]+$')
  assert.equal(schema.properties.shortname.pattern, '^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$')
  assert.deepEqual(schema.$defs.environment.required, [
    'domain', 'application', 'database', 'deploy'
  ])
})

test('starter config contains placeholders instead of allocated identity', async () => {
  const content = await readFile(new URL('.unfogy/config.yaml', root), 'utf8')
  assert.match(content, /__CUSTOMER_ID__/)
  assert.match(content, /__MWO_ID__/)
  assert.match(content, /__CUSTOMER_SERVER__/)
  assert.doesNotMatch(content, /CST[0-9]+/)
  assert.doesNotMatch(content, /MWO[0-9]+/)
})
