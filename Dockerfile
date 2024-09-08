# syntax=docker/dockerfile:1
FROM node:21.7.3-slim
WORKDIR /usr/src/app
COPY . .
RUN npm install && npm run build:prod && npm cache clean --force

FROM node:21.7.3-slim
RUN groupadd -r appuser && useradd -r -g appuser -s /sbin/nologin -d /usr/src/app appuser \
    && mkdir -p /usr/src/app \
    && chown -R appuser:appuser /usr/src/app 

WORKDIR /usr/src/app
COPY --from=0 /usr/src/app/ ./
USER appuser
EXPOSE 3000
CMD ["npm", "run", "start:prod"]