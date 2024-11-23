FROM node:18.20-alpine

WORKDIR /backend

COPY package* .

RUN npm install

COPY . .

ENTRYPOINT ["npm", "run"]
CMD ["dev"]