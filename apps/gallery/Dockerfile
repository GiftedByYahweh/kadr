FROM node:24-alpine AS build
RUN npm i -g pnpm@12.11.2
WORKDIR /repo
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch
COPY . .
RUN pnpm install --offline --frozen-lockfile --filter @kadr/gallery...
RUN pnpm --filter @kadr/gallery build

FROM nginx:1.29-alpine
COPY apps/gallery/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/gallery/dist /usr/share/nginx/html
