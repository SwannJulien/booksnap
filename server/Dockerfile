# Use a slim OpenJDK 17 base image
FROM eclipse-temurin:17-jdk-alpine

# Set time zone and locale
ENV TZ=Europe/Madrid \
    LANG='en_US.UTF-8' \
    LANGUAGE='en_US:en'

RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Europe/Madrid /etc/localtime \
    && echo "Europe/Madrid" > /etc/timezone \
    && apk del tzdata

# Create a non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring

# Set working directory inside the container
WORKDIR /app

# Copy the jar file into the container
COPY target/*.jar app.jar

# Change ownership to non-root user
RUN chown spring:spring app.jar

# Switch to the non-root user
USER spring

# Expose the port your app runs on
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]