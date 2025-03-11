FROM nginx:latest as dev
WORKDIR /app/frontend

COPY nginx.conf /etc/nginx/nginx.conf

FROM dev as prod

COPY . .