FROM node:16

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

EXPOSE 8080

CMD [ "node", "src/index.js" ]