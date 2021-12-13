# common build stage
FROM node:14 as common-build-stage

COPY . ./app

WORKDIR /app

RUN yarn install

EXPOSE 8080

# development build stage
FROM common-build-stage as development-build-stage

ENV NODE_ENV development

CMD ["yarn", "dev"]

# production build stage
FROM common-build-stage as production-build-stage

ENV NODE_ENV production

CMD ["yarn", "start"]
