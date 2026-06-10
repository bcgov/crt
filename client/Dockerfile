FROM node:18-alpine AS builder
WORKDIR /app

# Add building tools to mimic the legacy node-python builder
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

FROM nginx:1.25-alpine

# Set HOME so ~/js/env.config.js resolves inside the nginx serve root
ENV HOME=/opt/app-root/src

RUN apk add --no-cache gettext \
    && mkdir -p /opt/app-root/src/js \
    /opt/app-root/etc/nginx.d \
    /opt/app-root/etc/nginx.default.d

# Copy built React app to the serve root
COPY --from=builder /app/build /opt/app-root/src

# Copy nginx config template and start script
COPY nginx.conf.tmpl /tmp/src/nginx.conf.tmpl
COPY nginx-start/start.sh /docker-entrypoint.d/10-start.sh
RUN chmod +x /docker-entrypoint.d/10-start.sh

RUN chmod -R 770 /var/cache/nginx /var/run /run /var/log/nginx
RUN chmod 0770 /etc/nginx/nginx.conf
RUN touch /opt/app-root/src/js/env.config.js && chmod 0770 /opt/app-root/src/js/env.config.js

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]