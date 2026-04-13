#!/bin/bash

cd backEnd/demo
set -e  # يوقف السكريبت إلا وقع أي error
echo "🚀 Starting database with Docker Compose..."
docker compose up 

echo "⏳ Waiting for database to be ready..."
sleep 5  # تقدر تبدلها حسب DB ديالك (MySQL/Postgres...)

echo "📂 Navigating to Spring Boot project..."

echo "🔧 Making mvnw executable..."
chmod +x mvnw

echo "🔥 Running Spring Boot application..."
./mvnw spring-boot:run
