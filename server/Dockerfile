# ==============================================
# BOOKSNAP BACKEND - Multi-stage Dockerfile
# ==============================================
# Stage 1: Build with Maven
# Stage 2: Runtime with JRE
# ==============================================

# ----------------------------------------------
# STAGE 1: BUILD (Maven)
# ----------------------------------------------
FROM maven:3.9-eclipse-temurin-17-alpine AS builder

WORKDIR /build

# Copy only pom.xml first (Docker cache optimization)
# Maven dependencies change rarely → layer is cached
COPY pom.xml .

# Download all dependencies (offline mode)
RUN mvn dependency:go-offline -B

# Copy the source code
COPY src ./src

# Build the project (skip tests to speed up, tests run in CI/CD)
RUN mvn clean package -DskipTests -B

# Verify that the JAR was created
RUN ls -lh /build/target/*.jar

# ----------------------------------------------
# STAGE 2: RUNTIME (JRE uniquement)
# ----------------------------------------------
FROM eclipse-temurin:17-jre-alpine

# Image metadata
LABEL maintainer="Swann Julien <https://github.com/SwannJulien>"
LABEL description="Booksnap Backend - Spring Boot API"

# Timezone and locale configuration
ENV TZ=Europe/Madrid \
    LANG='en_US.UTF-8' \
    LANGUAGE='en_US:en'

# Install tzdata then configure the timezone
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Europe/Madrid /etc/localtime && \
    echo "Europe/Madrid" > /etc/timezone && \
    apk del tzdata

# Create a non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring

WORKDIR /app

# Copy the JAR from the builder stage
COPY --from=builder /build/target/*.jar app.jar

# Change ownership to the non-root user
RUN chown spring:spring app.jar

# Switch to the non-root user
USER spring

# Expose the Spring Boot port
EXPOSE 8080

# Healthcheck (verifies that Spring Boot responds)
# Note: Requires Spring Boot Actuator enabled
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Start the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
