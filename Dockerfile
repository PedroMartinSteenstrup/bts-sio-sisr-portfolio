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
