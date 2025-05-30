ARG VERSION=lts-alpine

FROM node:$VERSION

ARG NODE_ENV="development"

RUN mkdir -p /server /public/images /var/www/html/images

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]