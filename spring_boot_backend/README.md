# Spring Boot Backend

## Description

This project is a production-ready REST API with Spring Boot. It includes :

  - Secured authentication based on JWT with Refresh Token,
  - Secured data manipulation using Spring Data JPA for database access and Spring validation for quality,

## Prerequisites

MySQL : [MySQL installation page](https://dev.mysql.com/downloads/installer/)

## Configuration

Create a ```.env``` file in the root folder.
```
# MySQL Configuration
DB_ROOT_PASSWORD=yourdbrootpassword
MYSQL_DATABASE=yourdbname
MYSQL_USER=yourdbuser
MYSQL_PASSWORD=yourdbpassword
# JWT configuration
JWT_SECRET_KEY=yourjwtsecretkey
JWT_EXPIRATION_TIME_MINUTE=60 (1 hour)
JWT_REFRESH_EXPIRATION_TIME_MINUTE=3600 (1 day)
# CORS Request
ALLOWED_ORIGINS=http://localhost:4200 (Angular),yourotherorigins
# Admin User Initialisation
ADMIN_USERNAME=administratorname
ADMIN_PASSWORD=administratorpassword
```

Then, in the MySQL Workbench, create a new schema corresponding to your DB credentials.

## Running the application

To run the application, go in the folder spring_boot_backend and run the command :
```
mvn clean spring-boot:run
```
The API will be accessible at http://localhost:8080.