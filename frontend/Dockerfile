# Usa una imagen base de Node.js
FROM node:16 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

# Construye la aplicación de React
RUN npm run build

# Usa una imagen base de Nginx para servir los archivos estáticos
FROM nginx:alpine

# Copia los archivos compilados al directorio de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expone el puerto en el que Nginx sirve la app
EXPOSE 80

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]