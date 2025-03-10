# URL Shortener

A full-stack URL shortener web application with a modern UI, secure authentication, and a scalable backend, similar to Bit.ly.

## Table of Contents

- [URL Shortener](#url-shortener)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Technology Stack](#technology-stack)
  - [Setup Instructions](#setup-instructions)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
- [Author](#author)

## Introduction

This project is a scalable URL shortener application that allows users to shorten long URLs, manage them, and view analytics. It includes features such as user authentication, JWT-based security, and a modern user interface built with React/Next.js.

## Features

- **User Authentication**: Secure registration, login, and JWT-based authentication.
- **URL Management**: Create, view, and manage shortened URLs.
- **Analytics**: Track clicks and usage statistics for each shortened URL.
- **Scalable Backend**: Built with Node.js/Typescript.
- **Database**: Relational database using PostgreSQL.

## Technology Stack

- **Frontend**: React/Next.js with TailwindCSS
- **Backend**: Node.js/Typescript
- **Database**: PostgreSQL
- **Authentication**: JWT/OAuth
- **Deployment**: Docker

## Setup Instructions

### Prerequisites

- Node.js/Typescript and npm installed
- Docker installed (for containerization)
- PostgreSQL database setup

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ALVINdimpos/url-shortener-backend.git
   cd url-shortener-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables:

   Create a .env file  and use the .env.example file as a reference to set up the environment variables.

4. Run the migrations:

   ```bash
   npm run migrate
   ```

5. Start the application:

   ```bash
   npm start
   ```

   For Docker:

   ```bash
   docker-compose up --build
   ```

6. Usage

7. Register/Login: Create an account or log in to access the URL shortening service.
8. Shorten URLs: Use the input field to shorten long URLs.
9. Manage URLs: View and manage your shortened URLs from the dashboard.
10. View Analytics: Check the click and usage statistics for each URL.
11. API Documentation

The API endpoints are documented using Swagger. You can access the API documentation at /swagger-docs after starting the application.

Key Endpoints

1. POST /auth/register: User registration
2. POST /auth/login: User login & JWT token generation
3. POST /auth/logout: Logout & token invalidation
4. POST /shorten: Shorten URLs (authenticated)
5. GET /urls: Fetch user-specific URLs
6. GET /analytics/: Get URL stats
Authentication

api docs: [API Documentation](https://url-shortener-backend-5qi6.onrender.com/api-docs/#/)

Testing
The project includes unit and integration tests. To run the tests:

```bash
npm test
```

Achieved 80% Test Coverage

![Test Coverage](./screenshots/Screenshot%202025-03-10%20at%2012.42.57 PM.png)

# Author

[Niyigena Fiston Alvin](https://www.linkedin.com/in/fistonalvin/)