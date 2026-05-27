FROM eclipse-temurin:17-jdk-alpine
COPY target/*.jar app.jar
EXPOSE 8000
ENTRYPOINT ["java", "--add-opens", "java.base/java.lang=ALL-UNNAMED", "--add-opens", "java.base/java.util=ALL-UNNAMED", "--add-opens", "java.base/java.lang.reflect=ALL-UNNAMED", "--add-opens", "java.base/java.util.concurrent=ALL-UNNAMED", "--add-opens", "java.base/java.text=ALL-UNNAMED", "--add-opens", "java.desktop/java.awt.font=ALL-UNNAMED", "--add-opens", "java.desktop/java.awt=ALL-UNNAMED", "-jar", "/app.jar"]
