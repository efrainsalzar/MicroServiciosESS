# Usar la imagen oficial de Node.js
FROM node:18

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos del proyecto
COPY package*.json ./
RUN npm install
COPY . .

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "app.js"]
