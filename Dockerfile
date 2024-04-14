# pull official base image
FROM node:20-bookworm-slim as build

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# bring the code
COPY public/ /app/public
COPY scripts/ /app/scripts
COPY src/ /app/src

# install app dependencies
COPY src/package*.json .

WORKDIR /app/src

RUN npm install
# RUN npm run build

# # start app
CMD ["node", "index.js"]

# production environment
FROM nginx:stable-alpine as prod

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]