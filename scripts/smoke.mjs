const baseUrl = (process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '')

async function request(path, assertion) {
  let lastError

  for (let attempt = 1; attempt <= 20; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}${path}`, { redirect: 'manual' })
      await assertion(response)
      console.log(`${response.status} ${path}`)
      return
    } catch (error) {
      lastError = error
      if (attempt < 20) await new Promise(resolve => setTimeout(resolve, 250))
    }
  }

  throw lastError
}

await request('/api/health', async (response) => {
  const body = await response.json()
  if (response.status !== 200 || body.status !== 'ok' || body.contractVersion !== 1) {
    throw new Error(`Health check failed: ${response.status} ${JSON.stringify(body)}`)
  }
})

await request('/login', async (response) => {
  if (response.status !== 200) throw new Error(`Login smoke failed: ${response.status}`)
})
