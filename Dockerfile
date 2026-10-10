# ===============================
# 1) Dependencies
# ===============================
FROM node:22-alpine AS deps
WORKDIR /app

# Prisma + SQL Server adapter ต้องใช้ openssl และ libc6-compat
RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --ignore-scripts

# ===============================
# 2) Build
# ===============================
FROM node:22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* ถูก inline เข้า client bundle ตอน build เท่านั้น
# ต้องส่งผ่าน build args (กำหนดใน docker-compose.yml -> build.args)
ARG NEXT_PUBLIC_API_BASE
ARG NEXT_PUBLIC_REWARDS_BASE_URL
ARG NEXT_PUBLIC_BASE_PATH
ARG NEXT_PUBLIC_PDF_API_URL
ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE \
    NEXT_PUBLIC_REWARDS_BASE_URL=$NEXT_PUBLIC_REWARDS_BASE_URL \
    NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH \
    NEXT_PUBLIC_PDF_API_URL=$NEXT_PUBLIC_PDF_API_URL

# 🔧 FIX react2shell / next issues
RUN npx fix-react2shell-next
RUN DATABASE_URL="sqlserver://localhost:1433;database=build;user=build;password=build;encrypt=false;trustServerCertificate=true" \
    npx prisma generate --schema=prisma/schema

# Build Next.js
RUN npm run build -- --webpack

# ===============================
# 3) Runtime
# ===============================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl libc6-compat

# security: ไม่รันเป็น root
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/server.cjs ./server.cjs

USER nextjs

EXPOSE 3302

CMD ["node", "server.cjs"]
