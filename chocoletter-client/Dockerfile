FROM node:20-alpine AS build-stage

WORKDIR /app

ARG VITE_API_SERVER_URL=http://chocoletter.svc.chocoletter-server-service.cluster.local
ARG VITE_KAKAOTALK_JAVASCRIPT_KEY=f498644527a9cae748dcfb9a626a9a85
ARG VITE_OPENVIDU_SERVER_URL=http://dummy
ARG VITE_OPENVIDU_SECRET_BASE=dummy
ARG VITE_EVENT_DAY=0214
ARG VITE_CHAT_WEBSOCKET_ENDPOINT=wss://chocoletter.svc.chocoletter-chat-service.cluster.local
ARG VITE_CHAT_API_URL=http://chocoletter.svc.chocoletter-chat-service.cluster.local
ARG VITE_GOOGLE_ANALYTICS_ID=dummy

# package.json 이랑 package-lock.json 둘다
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:stable-alpine AS production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]