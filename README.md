
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
- Editor.js rich text editor
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

> The backend uses PostgreSQL with the following default settings configured in `src/main/resources/application.properties`:
>
> - `spring.datasource.url=jdbc:postgresql://localhost:5432/blog_db`
> - `spring.datasource.username=bloguser`
> - `spring.datasource.password=blogpassword`
>
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

## Notes

- The backend and frontend can run simultaneously in development.
- Configure API endpoints in the Angular app if the backend is not running on the default host and port.
- For production deployment, build the frontend (`npm run build`) and serve the generated `dist/` content through a web server or integrate it with the backend.
