# Angular Frontend – Authentication & User Management

## Overview

This project is the frontend SPA for the Spring Boot + Angular Authentication App. It provides a modern, responsive user interface for authentication, user management, and role-based access control, built with **Angular v20**.

## Features

- **User Authentication**: Login, registration, and JWT-based session management
- **Role-based Access**: Guards and UI logic for admin/user roles
- **User Management (Admin)**:
  - List users in a sortable, filterable table
  - Search by username, filter by role/status
  - Edit and delete users
  - Create new users with role selection
- **Responsive UI**: Modern design, reusable components
- **Token Storage**: Securely stores JWT and refresh tokens in local storage
- **API Integration**: Communicates with the Spring Boot backend for all operations
- **Route Guards**: Protects routes for authenticated/unauthenticated users
- **Theming**: Theme switcher for light/dark mode

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Setup & Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   ng serve
   ```
   The app will be available at [http://localhost:4200](http://localhost:4200).

3. Ensure the backend API is running at `http://localhost:8080` (or update the API URL in `src/environments/environment.ts`).

## Environment Configuration

Edit `src/environments/environment.ts` to set the backend API URL and other environment-specific settings.

## Customization
- **UI/Theme**: Modify styles in `src/styles/` or use the theme switcher.
- **Roles**: Update role logic in guards and user management components.
- **API Endpoints**: Adjust endpoints in the service files if your backend changes.

---

For backend setup and full-stack integration, see the root `README.md`.