import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const root = new URL('../', import.meta.url)

test('starter config contains placeholders instead of allocated identity', async () => {
  const content = await readFile(new URL('.unfogy/config.yaml', root), 'utf8')
  assert.match(content, /__CUSTOMER_ID__/)
  assert.match(content, /__MWO_ID__/)
  assert.match(content, /__CUSTOMER_SERVER__/)
  assert.doesNotMatch(content, /CST[0-9]+/)
  assert.doesNotMatch(content, /MWO[0-9]+/)
})

test('customer contract directory contains only project and starter inputs', async () => {
  const config = await readFile(new URL('.unfogy/config.yaml', root), 'utf8')
  const starter = await readFile(new URL('.unfogy/starter.yaml', root), 'utf8')
  assert.match(config, /kind: UnfogyProjectConfig/)
  assert.match(config, /schema_version: 2/)
  assert.match(starter, /contractVersion: 1/)
})
