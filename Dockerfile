# Install npm packages
FROM node:12-alpine as builder

WORKDIR /app

COPY package.json .

RUN npm install

# Push js files
FROM node:12-alpine

WORKDIR /app

COPY --from=builder /app/ /app/

COPY ./pages ./pages

COPY ./src ./src

COPY ./styles ./styles

RUN npm run build

CMD npm run start