# FROM node:19
# WORKDIR /app
# COPY package.json .
# RUN npm install
# COPY . .
# EXPOSE 8088
# CMD [ "npm", "start" ]

FROM node:14.17-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]
