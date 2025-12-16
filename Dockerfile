#
# Frontend image build for Vite React app, served by Node (no nginx).
# Build args:
#   API_URL  -> sets VITE_API_BASE_URL for API calls
#   BASE_URL -> sets VITE_BASE_URL (optional base path)
#
# Example:
#   docker build -t jade-fe \
#     --build-arg API_URL=https://api.example.com \
#     --build-arg BASE_URL=/ \
#     .

FROM node:20-alpine AS builder
WORKDIR /app

# Build-time environment for Vite.
ARG API_URL=http://localhost:9190/api
ARG BASE_URL=/
ENV VITE_API_BASE_URL=${API_URL}
ENV VITE_BASE_URL=${BASE_URL}

# Install dependencies (npm ci if lockfile exists, otherwise npm install).
# Copy base tsconfig so project references resolve (fe/tsconfig.* extends ../tsconfig.base.json).
COPY ./tsconfig.base.json /tsconfig.base.json
COPY ./fe/package.json ./fe/package-lock.json* ./
COPY ./fe/tsconfig*.json ./
COPY ./fe/vite.config.ts ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source and build.
COPY ./fe .
RUN npm run build

# Runtime: serve static build with Node using `serve`.
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Fixed runtime port for container
ENV PORT=4140

# Install a tiny static server.
RUN npm install -g serve@14

# Copy built assets only.
COPY --from=builder /app/dist ./dist

# Use non-root user for safety.
RUN chown -R node:node /app
USER node

EXPOSE 4140
# Fixed port inside container; change host port via docker -p mapping only.
CMD ["serve", "-s", "dist", "-l", "4140"]
