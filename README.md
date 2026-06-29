
# 01blog

## Project Overview

`01blog` is a full-stack blog platform with a Spring Boot backend and an Angular frontend. The backend handles authentication, data storage, REST APIs, and media management, while the frontend provides a responsive UI for login, registration, post creation, and browsing.

## Project Structure

- `backEnd/demo/` - Spring Boot backend application
- `frontEnd/` - Angular frontend application

## Future Direction

This project can grow into a modern content platform with features such as:
- full author profiles and user roles
- advanced post editor and rich media support
- comments, likes, and social sharing
- search, tags, and categories
- deployment to Docker, cloud, or CI/CD pipelines
- integration with external APIs for analytics, notifications, or content moderation

## Technologies Used
### DataBase
- PostgreSQL
### Backend
- Java 17
- Spring Boot 4
- Spring Web
- Spring Data JPA
- Spring Security
- PostgreSQL driver
- JWT authentication (`jjwt`)
- Cloudinary media integration
- Apache Tika
- Lombok

### Frontend
- Angular 21
- Angular Material
- RxJS
- TypeScript
- Vitest for unit testing

## Running the Backend

1. Open a terminal at the backend folder:

```bash
cd backEnd/demo
```

2. Start the PostgreSQL database with Docker Compose:

```bash
docker compose up -d
```

3. Verify the database is running on `localhost:5432`.

4. Build and run the backend with Maven:

```bash
./mvnw spring-boot:run
```

5. The backend will start on the configured port (usually `http://localhost:8080`).


> The Docker Compose service is defined in `backEnd/demo/docker-compose.yml`.

## Running the Frontend

1. Open a terminal at the frontend folder:

```bash
cd frontEnd
```

2. Install dependencies (if not already installed):

```bash
npm install
```

3. Start the Angular development server:

```bash
npm start
```

4. Open the app in your browser:

```text
http://localhost:4200
```
> If you don't have the Angular CLI installed, you should install it first.

Run the following command:

```bash
npm install -g @angular/cli
```
> If it doesn't work because it requires elevated permissions (sudo), you can use NVM (Node Version Manager) instead:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash

source ~/.zshrc

nvm install --lts

nvm use --lts

npm install -g @angular/cli

```
