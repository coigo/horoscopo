# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copia package.json
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia código-fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copia apenas arquivos necessários do builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/horoscopes.json ./horoscopes.json

# Instala apenas dependências de produção
RUN npm ci --only=production

# Porta de exposição
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start da aplicação
CMD ["npm", "start"]
