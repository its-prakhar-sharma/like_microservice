FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./

# Install dependencies
RUN npm ci

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
