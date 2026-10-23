import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { test } from 'node:test'
import { parse } from 'yaml'

const root = new URL('../../', import.meta.url)

test('starter provision and identity require explicit project binding', async () => {
  const provision = parse(await readFile(new URL('.unfogy/application.yaml', root), 'utf8'))
  const identity = provision.repository
  const generic = provision.repository.id === '__REPOSITORY_ID__'
  assert.match(provision.repository.id, generic ? /^__REPOSITORY_ID__$/ : /^[-a-z0-9]+$/)
  assert.equal(identity.id, provision.repository.id)
  assert.match(identity.owner, generic ? /^__OWNER_ID__$/ : /^(unfogy|cst-[0-9]{4,})$/)
  assert.match(provision.project, generic ? /^__PROJECT_ID__$/ : /^[-a-z0-9]+$/)
  const publish = parse(await readFile(new URL('.unfogy/woodpecker/publish.yaml', root), 'utf8'))
  const build = publish.steps.find(step => step.name === 'publish-image')
  assert.equal(provision.imageRepository, build.settings.repo.replace('${CI_REPO_NAME}', provision.repository.id))
  assert.equal(provision.imageRepository.split('/')[0], build.settings.registry)
  assert.deepEqual(Object.keys(provision.environments), ['preview', 'production'])
  assert.deepEqual(provision.ci.workflows, ['.unfogy/woodpecker/validate.yaml', '.unfogy/woodpecker/publish.yaml'])
  assert.equal(provision.database.studioAccess, 'private')
  assert.equal(provision.database.migrateEntrypoint, '.output/migrate.mjs')
  assert.deepEqual(provision.database.applicationBindings, { NUXT_PUBLIC_SUPABASE_URL: 'api-url', NUXT_PUBLIC_SUPABASE_KEY: 'anon-key' })
  assert.notEqual(provision.environments.preview.database.name, provision.environments.production.database.name)
  for (const retired of ['config.yaml', 'repository.yaml', 'provision.yaml']) await assert.rejects(access(new URL('.unfogy/' + retired, root)), { code: 'ENOENT' })
  for (const [name, settings] of Object.entries(provision.environments)) assert.equal(settings.placement.role, name === 'preview' ? 'preview-worker' : 'production-worker')
})
test('build compatibility metadata is separate from the sole provision input', async () => {
  const contract = parse(await readFile(new URL('.unfogy/contract.yaml', root), 'utf8'))
  assert.equal(contract.contractVersion, 1)
  assert.equal(contract.delivery.buildAuthority, 'woodpecker-dockerfile')
  assert.deepEqual(contract.delivery.workflows, ['.unfogy/woodpecker/validate.yaml', '.unfogy/woodpecker/publish.yaml'])
  assert.equal(contract.provision, undefined)
})
