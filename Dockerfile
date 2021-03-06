FROM node:12-alpine AS build

WORKDIR /tmp

COPY package*.json ./
RUN npm install --ignore-scripts

COPY . .
RUN npm run build

FROM node:12-alpine

ENV NODE_ENV production

WORKDIR /home/node/app

COPY package*.json ./
RUN npm install --ignore-scripts

COPY --from=build /tmp/.next ./.next

EXPOSE 80
CMD ["npm", "start"]