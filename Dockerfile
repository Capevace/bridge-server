FROM node:16-alpine

# Create app directory
WORKDIR /app

RUN apt-get update && \
    apt-get install -y \
      build-essential \
      bluez bluez-tools \
      libglib2.0-dev libbluetooth-dev

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "node", "src/index.js" ]