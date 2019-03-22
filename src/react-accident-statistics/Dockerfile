# Multi Stage setup

# Stage 1 - the build process
FROM node:8.15.1-jessie as build

WORKDIR /react_accident_statistics

COPY . /react_accident_statistics

RUN npm install -g typescript@3.2 && \
    npm install node-sass-chokidar && \
    npm install && \
    npm run build

# Utlised before the multi stage setup
# EXPOSE 3000
# CMD ["npm", "run", "start"]

# Stage 2 - the production environment#
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html

COPY --from=build /react_accident_statistics/build .
