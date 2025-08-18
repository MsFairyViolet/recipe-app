# Stage 1: Build Next.js frontend
FROM node:18 AS frontend-builder
WORKDIR /frontend
COPY recipe-app-front-end/package.json recipe-app-front-end/package-lock.json ./
RUN npm install
COPY recipe-app-front-end ./
RUN npm run build

# Stage 2: Build Spring Boot backend
FROM eclipse-temurin:17-jdk AS backend-builder
WORKDIR /app
COPY recipe-app-back-end ./
RUN ./gradlew build

# Stage 3: Final production container
FROM eclipse-temurin:17-jdk

RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Spring Boot JAR
COPY --from=backend-builder /app/build/libs/*.jar app.jar

# Copy Next.js build
COPY --from=frontend-builder /frontend/.next /frontend/.next
COPY --from=frontend-builder /frontend/node_modules /frontend/node_modules
COPY --from=frontend-builder /frontend/public /frontend/public
COPY --from=frontend-builder /frontend/package.json /frontend/

# Install PM2 (Process Manager for Node.js)
RUN npm install -g pm2

# Copy the startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8080 3000

# Start both Spring Boot and Next.js
CMD ["/bin/sh", "/docker-entrypoint.sh"]
