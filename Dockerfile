FROM node:20-alpine3.19 AS builder
ARG BUILD_ENV='npm run build:dev'
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run lint -- --fix
RUN ${BUILD_ENV}

FROM nginx:1.23-alpine
WORKDIR /app
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /app
EXPOSE 80
