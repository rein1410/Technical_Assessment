FROM node:22-alpine as base
RUN npm i -g pnpm
WORKDIR /app

FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile
COPY . .
RUN pnpm build

FROM base AS production
COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile -P
COPY --from=build /app/dist dist
EXPOSE 3000
CMD ["node", "dist/main.js"]