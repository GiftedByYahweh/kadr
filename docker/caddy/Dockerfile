FROM node:24-alpine AS build
RUN npm i -g pnpm@12.11.2
WORKDIR /repo
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch
COPY . .
RUN pnpm install --offline --frozen-lockfile \
  --filter @kadr/admin... --filter @kadr/gallery... --filter @kadr/portfolio...
RUN pnpm --filter @kadr/admin --filter @kadr/gallery --filter @kadr/portfolio build

FROM caddy:2.10-alpine
COPY docker/caddy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /repo/apps/admin/dist /srv/admin
COPY --from=build /repo/apps/gallery/dist /srv/gallery
COPY --from=build /repo/apps/portfolio/dist /srv/portfolio
