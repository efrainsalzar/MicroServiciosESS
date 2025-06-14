FROM node:18-alpine

WORKDIR /usr/src/app

# Crear directorio de logs
RUN mkdir -p logs

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto
EXPOSE 6000

# Comando por defecto
CMD ["node", "app.js"]