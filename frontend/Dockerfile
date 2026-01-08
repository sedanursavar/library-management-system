# Node.js LTS sürümü
FROM node:20-alpine

WORKDIR /app

# Paketleri yükle
COPY package*.json ./
RUN npm install

# Kaynak kodları kopyala
COPY . .

# Vite'in varsayılan portu
EXPOSE 5173

# ÖNEMLİ: "--host" parametresi konteyner dışından erişim için şarttır!
CMD ["npm", "run", "dev", "--", "--host"]