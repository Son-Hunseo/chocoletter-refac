FROM node:20-alpine AS build-stage

WORKDIR /app

ARG VITE_API_SERVER_URL=https://chocoletter-server.sonhs.com
ARG VITE_KAKAOTALK_JAVASCRIPT_KEY=f498644527a9cae748dcfb9a626a9a85
ARG VITE_OPENVIDU_SERVER_URL=http://dummy
ARG VITE_OPENVIDU_SECRET_BASE=dummy
ARG VITE_EVENT_DAY=0214
ARG VITE_CHAT_WEBSOCKET_ENDPOINT=wss://chocoletter-chat.sonhs.com
ARG VITE_CHAT_API_URL=http://chocoletter-chat.sonhs.com
ARG VITE_GOOGLE_ANALYTICS_ID=dummy

# package.json 이랑 package-lock.json 둘다
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:stable-alpine AS production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

# SPA 라우팅을 위한 Nginx 설정 (try_files 추가)
# 이 설정 없으면 카카오 로그인 과정에서 404 에러뜸
RUN echo 'server { \
    listen 80; \
    location / { \
        root   /usr/share/nginx/html; \
        index  index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    error_page   500 502 503 504  /50x.html; \
    location = /50x.html { \
        root   /usr/share/nginx/html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]