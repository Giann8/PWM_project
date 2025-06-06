FROM node:lts-alpine as base
WORKDIR /app/backend

COPY package*.json .
RUN npm install

FROM base as dev
RUN npm install -g nodemon
CMD ["nodemon", "src/index.js"]


FROM base as prod
COPY . .
CMD ["node", "src/index.js"]