FROM nginx:1-alpine

# Set HOME so ~/js/ and ~/keycloak.json resolve inside the nginx serve root
ENV HOME=/opt/app-root/src

RUN apk add --no-cache gettext \
    && mkdir -p /opt/app-root/src \
    /opt/app-root/etc/nginx.d \
    /opt/app-root/etc/nginx.default.d

# Copy all static app files to the nginx serve root
COPY application/ /opt/app-root/src/application/
COPY index.html /opt/app-root/src/
COPY keycloak.json.tmpl /opt/app-root/src/keycloak.json.tmpl

# Copy nginx config template and start script
COPY nginx.conf.tmpl /tmp/src/nginx.conf.tmpl
COPY nginx-start/start.sh /docker-entrypoint.d/10-start.sh
RUN chmod +x /docker-entrypoint.d/10-start.sh

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
