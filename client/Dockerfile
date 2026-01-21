
# Stage 1: Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app

# Enable corepack for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies (only needed for build)
RUN pnpm config set network-timeout 300000 && \
    pnpm install --frozen-lockfile

# Stage 2: Build the application
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
# NEXT_PUBLIC_API_BASE_URL is needed at build time IF it's used in getStaticProps (not common for this app)
# but usually client-side env vars are baked in at build time.
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

# Build the application
RUN npm run build

# Stage 3: Production runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Next.js collects anonymous telemetry data by default. Disable it.
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone build
# This includes the strictly necessary node_modules and the server
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Start the standalone server
CMD ["node", "server.js"]
