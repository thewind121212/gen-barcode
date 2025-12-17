FROM node:20-alpine AS builder
WORKDIR /app

# Define mandatory arguments (no default values)
ARG API_URL

# Validation: Build will fail if these are not provided
RUN if [ -z "$API_URL" ]; then \
      echo "ERROR: API_URL and BASE_URL are required."; \
      exit 1; \
    fi

# Set Envs for the build process
ENV VITE_API_BASE_URL=${API_URL}

# Install dependencies
COPY ./tsconfig.base.json /tsconfig.base.json
COPY ./fe/package.json ./fe/package-lock.json* ./
COPY ./fe/tsconfig*.json ./
COPY ./fe/vite.config.ts ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source code
COPY ./fe .

# Create a fresh .env.production file using the ARGs
# This replaces the "ADD" command
RUN echo "VITE_API_BASE_URL=${API_URL}" > .env.production
RUN echo "VITE_BASE_URL=${BASE_URL}" >> .env.production

RUN npm run build

# --- Runtime Stage ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4140

RUN npm install -g serve@14
COPY --from=builder /app/dist ./dist

RUN chown -R node:node /app
USER node

EXPOSE 4140
CMD ["serve", "-s", "dist", "-l", "4140"]