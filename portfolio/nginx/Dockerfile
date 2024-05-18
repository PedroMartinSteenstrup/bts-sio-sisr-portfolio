FROM nginx:bookworm

RUN rm /etc/nginx/conf.d/default.conf

RUN mkdir /etc/nginx/ssl
RUN chown -R root:root /etc/nginx/ssl
RUN chmod -R 600 /etc/nginx/ssl

# COPY ./certs/origin_ca.pem /etc/nginx/ssl/default.cert
# COPY ./certs/origin_ca.key /etc/nginx/ssl/default.key

COPY nginx.conf /etc/nginx/templates/default.conf.conf

# CMD ["nginx", "-g", "daemon off;"]