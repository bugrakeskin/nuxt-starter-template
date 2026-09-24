# Testing

The baseline intentionally has no browser E2E or screenshot test package.

- `pnpm test:contract` checks allocation-free project metadata contracts.
- `pnpm contract:verify` checks secret boundaries, immutable delivery tags,
  deploy ordering, build revision metadata, and the bootstrap canary context.
- `pnpm test:unit` checks pure utilities and server policy helpers.
- `pnpm test:nuxt` checks behavior that requires an initialized Nuxt context.
- `pnpm test` runs all of the above.
- `pnpm smoke` checks a running production build over HTTP.

Set `EXPECTED_BUILD_REVISION` when smoke-testing a container to require
`/api/health` to report that exact image build revision.

Tests use synthetic configuration only. Do not put live keys or customer data
in fixtures, snapshots or CI variables. Database projects add pgTAP tests for
RLS, policies and functions alongside their schemas.
