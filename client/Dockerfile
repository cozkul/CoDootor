FROM node:18-alpine

WORKDIR /usr/src/app/frontend

COPY package*.json ./
RUN npm install && npm install --save-dev @types/estree

COPY . .

EXPOSE 3000