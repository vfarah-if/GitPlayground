FROM node:8.15.1-jessie

WORKDIR /angular_accident_statistics

COPY . /angular_accident_statistics

RUN npm install -g typescript@3.2 && \
    npm install ts-node && \
    npm install -g @angular/cli && \
    npm install node-sass && \
    npm install && \
    npm run build

EXPOSE 4200

CMD ["npm", "run", "start"]
