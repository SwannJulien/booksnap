# ==============================================
# BOOKSNAP FRONTEND - Multi-stage Dockerfile
# ==============================================
# Stage 1: Build with Node.js + Vite
# Stage 2: Runtime with Nginx Alpine
# ==============================================

# ----------------------------------------------
# STAGE 1: BUILD
# ----------------------------------------------
FROM node:24-alpine AS builder

WORKDIR /app

# Copy only package*.json first (Docker cache optimization)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all the source code
COPY . .

# Production build with Vite
# VITE_* environment variables must be passed at build time
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# Verify that the dist folder was created
RUN ls -la /app/dist

# ----------------------------------------------
# STAGE 2: RUNTIME (Nginx)
# ----------------------------------------------
FROM nginx:1.27-alpine

# Image metadata
LABEL maintainer="Swann Julien <https://github.com/SwannJulien>"
LABEL description="Booksnap Frontend - Lit + Vite + Nginx"

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove Nginx's default config (if it exists)
RUN rm -f /etc/nginx/conf.d/default.conf.default

# Expose port 80 (HTTP)
EXPOSE 80

# Healthcheck (verifies that Nginx responds)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start Nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]
