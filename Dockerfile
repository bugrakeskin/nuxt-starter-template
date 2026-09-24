# syntax=docker/dockerfile:1.7

ARG BUILD_REVISION=development

FROM node:22.22.0-bookworm-slim@sha256:dd9d21971ec4395903fa6143c2b9267d048ae01ca6d3ea96f16cb30df6187d94 AS build

ARG BUILD_REVISION
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV NUXT_BUILD_REVISION=$BUILD_REVISION
WORKDIR /app

RUN npm install --global --no-audit --no-fund pnpm@12.4.1

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:22-alpine3.23@sha256:baf676f7d0e552f3231945c2f979055ca121bce128c152f7a34e6bd1728b1c5a AS runtime

ARG BUILD_REVISION
ENV HOST=0.0.0.0
ENV NODE_ENV=production
ENV PORT=3000
LABEL org.opencontainers.image.revision=$BUILD_REVISION
WORKDIR /app

# Runtime needs Node and /bin/sh for the Woodpecker migration command, but not
# package managers. Removing them shrinks the attack surface of the deployed image.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
    /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack /usr/local/bin/pnpm /usr/local/bin/pnpx

COPY --from=build --chown=node:node /app/.output ./.output
COPY --from=build --chown=node:node /app/supabase/migrations ./supabase/migrations

USER node
EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=6 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"]

CMD ["node", ".output/server/index.mjs"]
