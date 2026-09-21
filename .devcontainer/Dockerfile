FROM node:22-bookworm-slim@sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9

RUN apt-get update \
    && apt-get install --yes --no-install-recommends ca-certificates curl git \
    && rm -rf /var/lib/apt/lists/* \
    && corepack disable \
    && npm install --global pnpm@12.5.1 \
    && mkdir -p /pnpm/store /workspace/node_modules /workspace/.nuxt \
    && chown -R node:node /pnpm /workspace

WORKDIR /workspace

ENV NUXT_TELEMETRY_DISABLED=1

CMD ["sleep", "infinity"]
