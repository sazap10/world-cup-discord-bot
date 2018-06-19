FROM node:8-alpine

WORKDIR /app

ADD package.json package-lock.json /app/

RUN npm install

ADD index.js /app

CMD ["node", "index.js"]
