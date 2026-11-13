FROM node:24-alpine AS build
RUN npm i -g pnpm@12.11.2
WORKDIR /repo
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch
COPY . .
RUN pnpm install --offline --frozen-lockfile --filter @kadr/api...
RUN pnpm deploy --filter @kadr/api --prod /out

FROM node:24-alpine
WORKDIR /repo/apps/api
COPY --from=build /repo/tsconfig.base.json /repo/tsconfig.base.json
COPY --from=build /out .
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4000
EXPOSE 4000
USER node
CMD ["node", "--import", "tsx", "src/main.ts"]
