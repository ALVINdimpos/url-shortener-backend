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

## Introduction

This project is a scalable URL shortener application that allows users to shorten long URLs, manage them, and view analytics. It includes features such as user authentication, JWT-based security, and a modern user interface built with React/Next.js.

## Features

- **User Authentication**: Secure registration, login, and JWT-based authentication.
- **URL Management**: Create, view, and manage shortened URLs.
- **Analytics**: Track clicks and usage statistics for each shortened URL.
- **Modern UI**: Built with React/Next.js and TailwindCSS.
- **Scalable Backend**: Built with Node.js/NestJS, Python/FastAPI, or Java/Spring Boot.
- **Database**: Relational database using MySQL/PostgreSQL.

## Technology Stack

- **Frontend**: React/Next.js/Angular with TailwindCSS
- **Backend**: Node.js/NestJS, Python/FastAPI, or Java/Spring Boot
- **Database**: MySQL/PostgreSQL
- **Authentication**: JWT/OAuth
- **Deployment**: Docker, Local/Cloud

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

3. Set up the database:

   Create a database and update the configuration in config/config.js.

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

1. Register/Login: Create an account or log in to access the URL shortening service.
2. Shorten URLs: Use the input field to shorten long URLs.
3. Manage URLs: View and manage your shortened URLs from the dashboard.
4. View Analytics: Check the click and usage statistics for each URL.
5. API Documentation

The API endpoints are documented using Swagger. You can access the API documentation at /swagger-docs after starting the application.

Key Endpoints

1. POST /auth/register: User registration
2. POST /auth/login: User login & JWT token generation
3. POST /auth/logout: Logout & token invalidation
4. POST /shorten: Shorten URLs (authenticated)
5. GET /urls: Fetch user-specific URLs
6. GET /analytics/: Get URL stats
Authentication

api docs: [API Documentation](http://localhost:3000/swagger-docs)

Testing
The project includes unit and integration tests. To run the tests:

```bash
npm test
```

Achieving 80% Test Coverage
To achieve 80% test coverage, ensure that:

All critical functions and methods are covered by unit tests.
Integration tests cover the main user flows, such as registration, login, URL shortening, and analytics.
Use tools like Jest and Supertest to write and run your tests.
Regularly check test coverage reports to identify and address gaps.
Deployment
The application can be deployed locally or to the cloud. Docker is used for containerization, and a docker-compose.yml file is provided for local setup.
