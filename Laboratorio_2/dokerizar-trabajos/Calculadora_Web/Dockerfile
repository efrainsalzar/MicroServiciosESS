# Usa una imagen base de Node.js
FROM node:14

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de tu aplicación
COPY . .

# Expone el puerto en el que tu app correrá
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "app.js"]