# Install npm packages
FROM node:12-alpine as builder

WORKDIR /app

COPY package.json .

RUN yarn install

# Push js files
FROM node:12-alpine

WORKDIR /app

COPY --from=builder /app/ /app/

COPY ./pages ./pages

COPY ./src ./src

COPY ./styles ./styles

COPY ./public ./public

RUN yarn build

CMD yarn start