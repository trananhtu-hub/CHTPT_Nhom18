#!/bin/bash
echo "=============================================================="
echo "  DANG DONG GOI VA KHOI CHAY DOCKER COMPOSE TOAN DIEN (MAC)"
echo "=============================================================="
echo ""

echo "[1/2] Dang bien dich cac file JAR Java microservices..."

echo "Bien dich Service Registry..."
cd service-registry && ./mvnw clean package -DskipTests && cd ..

echo "Bien dich Zuul Gateway..."
cd gateway && ./mvnw clean package -DskipTests && cd ..

echo "Bien dich Multiplication..."
cd social-multiplication && ./mvnw clean package -DskipTests && cd ..

echo "Bien dich Gamification..."
cd gamification && ./mvnw clean package -DskipTests && cd ..

echo "Bien dich Quest Service..."
cd quest-service && ./mvnw clean package -DskipTests && cd ..
echo ""

echo "[2/2] Dang khoi dong toan bo cac containers qua Docker Compose..."
docker-compose up --build -d

echo ""
echo "=============================================================="
echo "  DOCKER COMPOSE DANG HOAT DONG NGAM THANH CONG!"
echo "  * Eureka Registry: http://localhost:8761"
echo "  * Web UI Game: http://localhost:8082"
echo "  * API Gateway: http://localhost:8000"
echo "  * RabbitMQ Admin: http://localhost:15672"
echo "  * De dung va xoa cac container, chay: docker-compose down"
echo "=============================================================="