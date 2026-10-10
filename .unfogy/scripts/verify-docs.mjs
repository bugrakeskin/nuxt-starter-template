import { readdir, readFile, stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { lint } from 'markdownlint/promise'
import { fileURLToPath, pathToFileURL } from 'node:url'

export function localLinks(markdown) {
  const text = markdown.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, '').replace(/`[^`\n]+`/g, '')
  const targets = []
  for (const match of text.matchAll(/!?\[[^\]]*\]\(\s*(<[^>]+>|[^\s)]+)(?:\s+[^)]*)?\)/g)) targets.push(match[1])
  for (const match of text.matchAll(/^\s{0,3}\[[^\]]+\]:\s*(<[^>]+>|\S+)/gm)) targets.push(match[1])
  return targets.map(value => value.replace(/^<|>$/g, '')).filter(value => value && !value.startsWith('#') && !value.startsWith('//') && !/^[a-z][a-z\d+.-]*:/i.test(value))
}

export async function checkDocument(path) {
  const errors = []
  for (const target of localLinks(await readFile(path, 'utf8'))) {
    try {
      const file = decodeURIComponent(target.split(/[?#]/)[0])
      if (file) await stat(resolve(dirname(path), file))
    } catch {
      errors.push(`${path}: missing or invalid local link ${target}`)
    }
  }
  return errors
}

export async function checkStructure(path, root) {
  const errors = []
  for (const match of (await readFile(path, 'utf8')).matchAll(/^\| `([^`]+)` \|/gm)) {
    try {
      await stat(resolve(root, match[1]))
    } catch {
      errors.push(`${path}: missing documented source path ${match[1]}`)
    }
  }
  return errors
}

export async function markdownFiles(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory() && entry.name !== '.archive') files.push(...await markdownFiles(path))
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(path)
  }
  return files
}

export async function verifyDocuments(documents) {
  const errors = (await Promise.all(documents.map(checkDocument))).flat()
  const report = await lint({ files: documents, config: { default: false, MD056: true, MD058: true } })
  for (const [path, findings] of Object.entries(report)) {
    for (const finding of findings) errors.push(`${path}:${finding.lineNumber}: ${finding.ruleNames[0]} ${finding.errorDescription}`)
  }
  return { documents: documents.length, errors }
}

export async function verifyDocs(root) {
  const documents = [
    'README.md', 'AGENTS.md', 'supabase/schemas/README.md',
    'supabase/migrations/README.md'
  ].map(path => join(root, path))
  documents.push(...await markdownFiles(join(root, 'docs')))
  documents.push(...await markdownFiles(join(root, 'knowledge')))
  const result = await verifyDocuments(documents)
  result.errors.push(...await checkStructure(join(root, 'docs/README.md'), root))
  return result
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = fileURLToPath(new URL('../../', import.meta.url))
  const result = await verifyDocs(root)
  if (result.errors.length) {
    process.stderr.write(`${result.errors.join('\n')}\n`)
    process.exitCode = 1
  } else process.stdout.write(`Documentation links valid: ${result.documents} documents.\n`)
}
