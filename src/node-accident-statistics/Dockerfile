FROM node:8.15.1-jessie

WORKDIR /accident_statistics

COPY . /accident_statistics

RUN npm install -g typescript@3.2 && \
    npm install ts-node && \
    npm install npm-run-all && \
    npm install && \
    npm run build 

EXPOSE 9000

CMD ["npm", "run", "start"]