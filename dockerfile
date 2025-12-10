FROM node:20-alpine AS development

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:20-alpine AS production

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm
RUN pnpm install --only=production

COPY --from=development /app/dist ./dist

CMD ["npm", "run", "start:prod"]
