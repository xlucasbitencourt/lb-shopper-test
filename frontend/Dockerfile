FROM node:18.20-alpine

WORKDIR /frontend

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

ENTRYPOINT [ "npm" ]
CMD [ "run", "dev" ]
