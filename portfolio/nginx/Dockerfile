FROM nginx:bookworm

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/templates/default.conf.conf

# CMD ["nginx", "-g", "daemon off;"]