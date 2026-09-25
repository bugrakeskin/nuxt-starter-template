const role = process.env.UNFOGY_PROCESS_ROLE || 'web'

if (role === 'web') {
  await import('../.output/server/index.mjs')
} else if (role === 'migration-runner') {
  setInterval(() => {}, 60_000)
} else {
  throw new Error(`Unsupported UNFOGY_PROCESS_ROLE: ${role}`)
}
