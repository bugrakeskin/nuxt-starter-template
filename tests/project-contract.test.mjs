import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const root = new URL('../', import.meta.url)

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, root), 'utf8'))
}

test('project metadata belongs to a permanent MWO application', async () => {
  const schema = await readJson('.unfogy/schema/project.schema.json')
  const project = schema.properties.project

  assert.deepEqual(project.required, [
    'customer_ref',
    'mwo_ref',
    'title',
    'summary'
  ])
  assert.equal(project.additionalProperties, false)
  assert.deepEqual(project.properties.folders.propertyNames.pattern, '^(?:\\.[a-z][a-z0-9-]*|[a-z][a-z0-9-]*)$')
  assert.equal(project.properties.mwo_ref.pattern, '^MWO[0-9]+$')
  assert.ok(project.properties.shortname)
})

test('shortnames use the lowercase path-safe naming contract', async () => {
  const projectSchema = await readJson('.unfogy/schema/project.schema.json')
  const projectPattern = new RegExp(projectSchema.properties.project.properties.shortname.pattern)
  const projectMaxLength = projectSchema.properties.project.properties.shortname.maxLength
  const valid = ['a', 'project-001', 'customer2-app9']
  const invalid = ['../escape', 'Project-001', 'project_001', '-project', 'project-', 'project.id', 'p'.repeat(64)]

  for (const value of valid) {
    assert.equal(value.length <= projectMaxLength && projectPattern.test(value), true, value)
  }
  for (const value of invalid) {
    assert.equal(value.length <= projectMaxLength && projectPattern.test(value), false, value)
  }
})

test('environment metadata is scoped to MWO and environment', async () => {
  const schema = await readJson('.unfogy/schema/environment.schema.json')

  assert.deepEqual(schema.required, [
    'schema_version',
    'kind',
    'mwo_ref',
    'environment',
    'recipe',
    'domains',
    'required_environment_keys'
  ])
  assert.deepEqual(schema.properties.environment.enum, ['preview', 'production'])
  assert.deepEqual(schema.properties.required_environment_keys.items.pattern, '^[A-Z][A-Z0-9_]*$')
  assert.equal(schema.properties.mwo_ref.pattern, '^MWO[0-9]+$')
  assert.equal(schema.properties.approval, undefined)
  assert.equal(schema.properties.lease, undefined)
  assert.equal(schema.properties.status, undefined)
})

test('starter templates contain no customer or MWO identity', async () => {
  const paths = [
    '.unfogy/templates/project.yaml',
    '.unfogy/templates/environments/preview.yaml',
    '.unfogy/templates/environments/production.yaml'
  ]

  for (const path of paths) {
    const content = await readFile(new URL(path, root), 'utf8')
    assert.equal(/CST[0-9]+/.test(content), false, path)
    assert.equal(/MWO[0-9]+/.test(content), false, path)
  }
})
