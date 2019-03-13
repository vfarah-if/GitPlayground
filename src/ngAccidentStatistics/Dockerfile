# Multi Stage setup
FROM node:8.15.1-jessie AS build 

WORKDIR /angular_accident_statistics

COPY . /angular_accident_statistics

RUN npm install -g typescript@3.2 && \
    npm install ts-node && \
    npm install -g @angular/cli && \
    npm install node-sass && \
    npm install && \
    npm run build --prod

# Previous mechanism that did not use the multi stage mechanism
# EXPOSE 4200

# CMD ["npm", "run", "start-docker"]

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html

COPY --from=build /angular_accident_statistics/dist/ngAccidentStatistics .
