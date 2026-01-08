# Node.js LTS sürümünü kullanıyoruz
FROM node:20-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# Paket dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Kaynak kodların geri kalanını kopyala
COPY . .

# Projeyi derle (build)
RUN npm run build

# NestJS varsayılan portu 3000'dir
EXPOSE 3000

# Uygulamayı başlat
CMD ["npm", "run", "start:prod"]