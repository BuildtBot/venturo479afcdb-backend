FROM node

WORKDIR /app

COPY . .

RUN npm install

RUN npm install -g ts-node

CMD ["npm", "run", "start"]
