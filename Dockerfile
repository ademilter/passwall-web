# Install npm packages
FROM node:12-alpine as builder

RUN apk add tar

WORKDIR /app

COPY package.json .

RUN npm install

# Push js files
FROM node:12-alpine

WORKDIR /app

COPY --from=builder /app/ /app/

ADD dist.tar.gz /

RUN tar -xvzf dist.tar.gz /app

RUN npm run build

CMD npm run start
