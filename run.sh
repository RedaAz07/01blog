#!/bin/bash

cd backEnd/demo
set -e  # يوقف السكريبت إلا وقع أي error
echo "🚀 Starting database with Docker Compose..."
nohup dockerd-rootless.sh > ~/docker-rootless.log 2>&1 &
docker compose up  -d  # -d باش يخليها في الخلفية
 
echo "⏳ Waiting for database to be ready..."
sleep 3  # تقدر تبدلها حسب DB ديالك (MySQL/Postgres...)
cd ../../frontEnd
echo "📂 Navigating to Angular project..."
ng serve 
cd ../backEnd/demo
echo "📂 Navigating to Spring Boot project..."

echo "🔧 Making mvnw executable..."
chmod +x mvnw

echo "🔥 Running Spring Boot application..."
./mvnw spring-boot:run
