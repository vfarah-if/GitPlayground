FROM node:8.15.1-jessie

WORKDIR /react_accident_statistics

COPY . /react_accident_statistics

RUN npm install -g typescript@3.2 && \
    npm install node-sass-chokidar && \
    npm install && \
    npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]