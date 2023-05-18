# FROM node:19
# WORKDIR /app
# COPY package.json .
# RUN npm install
# COPY . .
# EXPOSE 8088
# CMD [ "npm", "start" ]

FROM node:14.17-alpine
WORKDIR /usr/src/app
COPY ./package*.json /usr/src/app/
RUN npm install
COPY ./ /usr/src/app/
CMD [ "npm", "start" ]
