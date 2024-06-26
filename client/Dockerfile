FROM node:18-alpine

WORKDIR /usr/src/app/client

RUN apk add yarn

COPY . .

# Copy all files in host dir to container
RUN yarn install --check-files

EXPOSE 5173