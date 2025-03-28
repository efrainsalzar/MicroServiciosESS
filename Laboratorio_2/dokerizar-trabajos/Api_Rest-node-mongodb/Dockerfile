# Usar la imagen oficial de Node.js
FROM node:16

# Crear el directorio de la app
WORKDIR /app

# Copiar los archivos de la aplicación
COPY package*.json ./
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Exponer el puerto en el que la app estará escuchando
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "app.js"]
