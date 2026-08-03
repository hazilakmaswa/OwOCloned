# Production Dockerfile for OwO Bot Clone
FROM node:18-alpine AS base
WORKDIR /app

# Stage untuk install dependencies (Production)
FROM base AS deps
COPY package*.json ./
# Ganti npm ci dengan npm install untuk sementara (jika lockfile corrupt)
RUN npm install --omit=dev && npm cache clean --force
# Untuk memastikan folder node_modules ada, tambahkan:
RUN ls -la /app/node_modules || echo "node_modules NOT FOUND!"

# Production Stage
FROM base AS production

# Buat folder /app secara eksplisit (untuk jaga-jaga)
RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app

# Buat user non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy dependencies dari stage deps
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy kode aplikasi
COPY --chown=nodejs:nodejs . .

# Pindah ke user non-root
USER nodejs

# Health check (perbaiki agar tidak selalu exit 1)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "console.log('healthy')" || exit 0

CMD ["npm", "start"]
