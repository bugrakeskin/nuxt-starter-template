import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { checkDocument, checkStructure, localLinks, verifyDocuments } from '../scripts/verify-docs.mjs'

test('local links cover images and references but exclude URLs and code examples', () => {
  assert.deepEqual(localLinks('[page](guide.md#section) ![image](asset.png)\n[ref]: <a%20b.md>\n[web](https://example.com) [anchor](#x)\n`[sample](absent.md)`\n```md\n[example](missing.md)\n```'), ['guide.md#section', 'asset.png', 'a%20b.md'])
})

test('missing and malformed targets fail; encoded paths and anchors resolve', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'unfogy-doc-links-'))
  try {
    const path = join(directory, 'README.md')
    await writeFile(join(directory, 'a b.md'), '# heading')
    await writeFile(path, '[valid](a%20b.md#heading) [missing](absent.md) [invalid](%ZZ.md)')
    const errors = await checkDocument(path)
    assert.equal(errors.length, 2)
    assert.ok(errors.some(error => error.includes('absent.md')))
    assert.ok(errors.some(error => error.includes('%ZZ.md')))
  } finally { await rm(directory, { recursive: true, force: true }) }
})

test('structure tables fail when a documented source path disappears', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'unfogy-doc-structure-'))
  try {
    const path = join(directory, 'README.md')
    await writeFile(path, '| `README.md` | Entry |\n| `absent/` | Module |')
    const errors = await checkStructure(path, directory)
    assert.equal(errors.length, 1)
    assert.ok(errors[0].includes('absent/'))
  } finally { await rm(directory, { recursive: true, force: true }) }
})

test('KB navigation rejects missing links and native-update table fragmentation', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'unfogy-kb-navigation-'))
  try {
    const path = join(directory, 'index.md')
    await writeFile(path, '# Map\n\n| Need | Read |\n| --- | --- |\n| Entry | [missing](absent.md) |\n* native update inserted entry\n| Other | value |\n')
    const result = await verifyDocuments([path])
    assert.ok(result.errors.some(error => error.includes('absent.md')))
    assert.ok(result.errors.some(error => error.includes('MD058')))
    await writeFile(path, '# Map\n\n| Need | Read |\n| --- | --- |\n| Entry | [self](index.md) |\n\n')
    assert.deepEqual((await verifyDocuments([path])).errors, [])
  } finally { await rm(directory, { recursive: true, force: true }) }
})
