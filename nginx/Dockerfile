FROM nginx
RUN mkdir -p /etc/nginx/templates
COPY default.conf.template /etc/nginx/templates/default.conf.template
CMD envsubst '\$COMPANY_IP' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'