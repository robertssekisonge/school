# Frontend Dockerfile - Build with Node, serve with Nginx

# 1) Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2) Nginx serve stage
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# Copy built assets
COPY --from=builder /app/dist .

# Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# Default command
CMD ["nginx", "-g", "daemon off;"]


