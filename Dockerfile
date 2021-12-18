FROM node:14

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .
COPY .env.production .env

RUN yarn build

ENV NODE_ENV production

EXPOSE 8080

ENV NODE_ENV production
CMD ["yarn", "start"]
