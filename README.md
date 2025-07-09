# Spring-Boot-Angular-Authentication-App

## Project Overview

This project is a modern, real-world **full-stack authentication and user management application** designed for being used as a boilerplate to build production-ready application. It is built with:

- **Spring Boot** for the backend REST API
- **Angular (v.20)** for the frontend single-page application (SPA)

The project demonstrates a modern, secure authentication flow using JWT (JSON Web Tokens) with refresh tokens, role-based access control, and a clean separation of concerns between backend and frontend.

---

## Features

- **Latest version** of every frameworks (Angular v.20 & )
- **RESTful API** for authentication, user and role management
- **JWT-based authentication** with refresh token support
- **Role-based authentication** securing access to functionnalities
- **Environment-based configuration** via `.env` and `application.yml`

---

## Security Mechanisms

- **JWT Authentication**: Stateless, signed tokens for user sessions.
- **Refresh Tokens**: Securely issued and stored for session renewal.
- **Password Encoding**: User passwords are hashed using a strong encoder.
- **Spring Data JPA**: for database access
- **Input validation** for API requests
- **CORS**: Only allows requests from trusted origins (e.g., Angular app).
- **Exception Handling**: Centralized error responses to avoid information leaks.

- **Route Guards**: Prevent unauthorized access to protected routes.
- **Token Management**: JWT and refresh tokens are stored securely in local storage.
- **Interceptor**: Automatically attaches JWT to outgoing API requests.

---

## Getting Started

Each project have its own README with steps to run it.

---

## Credentials

The Spring Boot part of this project is inspired by this [repository](https://github.com/rimmelasghar/SpringBoot-boilerPlate/tree/main).

The Angular part of this project is inspired by this [repository](https://github.com/Ismaestro/angular-example-app/tree/master?tab=readme-ov-file).