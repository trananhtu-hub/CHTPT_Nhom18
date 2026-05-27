FROM eclipse-temurin:17-jdk-alpine
COPY target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "--add-opens", "java.base/java.lang=ALL-UNNAMED", "-jar", "/app.jar"]
