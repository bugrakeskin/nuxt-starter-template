# Unfogy Nuxt Starter

Nuxt 4 and Nuxt UI foundation for Unfogy customer applications. The verified
scope currently includes container-native development, public runtime
configuration, deterministic application health, lint, typecheck and production
build. Supabase, authentication and migrations are the next contract slice.

## Development

Connect to the Unfogy Control Server with VS Code Remote SSH, then run from this
admitted repository root:

```bash
cd /home/unfogy/unfogy-control-plane/workspaces/nuxt-starter-template
unfogy dev up
```

The command prints a forwarded `http://localhost:<port>` URL. Source is
bind-mounted from this checkout; Node, pnpm, dependencies and generated output
remain isolated in project-scoped container storage.

Running `unfogy dev up` from the Control Plane root is intentionally blocked.
The CLI does not infer a target repository.

Operational commands:

```bash
unfogy dev status
unfogy dev logs
unfogy dev down
unfogy dev rebuild
unfogy dev purge
```

`down` preserves project volumes. `purge` requires the exact repository identity
before removing this project's containers, volumes and local image.

## Runtime configuration

Copy `.env.example` to `.env` only when a local override is needed. `.env` is
ignored by Git and Coolify supplies deployment values through its own encrypted
environment configuration.

| Variable | Exposure | Default |
| --- | --- | --- |
| `NUXT_PUBLIC_APP_NAME` | Browser and server | `Unfogy Starter` |

Only values declared under Nuxt `runtimeConfig.public` may be exposed to the
browser. Secret configuration must never use the `NUXT_PUBLIC_` prefix.

## Health contract

`GET /api/health` returns a non-cached response:

```json
{
  "status": "ok",
  "service": "Unfogy Starter",
  "contractVersion": 1
}
```

The development container healthcheck uses this endpoint. Future dependency
checks may extend the response without exposing credentials.

## Production build check

Run production verification with the same container contract, not host pnpm:

```bash
docker compose \
  --env-file .devcontainer/.env \
  --file .devcontainer/compose.yaml \
  run --rm --no-deps app pnpm build
```

Coolify deployment remains a separate controlled workflow.
