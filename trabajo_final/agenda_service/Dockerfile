FROM node:18-alpine

WORKDIR /usr/src/app

# Copia primero los archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

# Expone el puerto
EXPOSE 4000

CMD ["node", "src/app.js"]