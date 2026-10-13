# Blog Platform

The Blog Platform is a blogging application built with Spring Boot and Spring Security, using JWT
authentication, with a React frontend.

## What's In This Repo

| Directory   | Contents                 |
| ----------- | ------------------------ |
| `backend/`  | The Spring Boot backend  |
| `frontend/` | The React frontend       |

## Running It

You'll need Docker and Node 20 (or later).

```bash
# Start PostgreSQL (and Adminer) and run the backend
cd backend
docker compose up --build

# Run the frontend, in a second terminal
cd frontend
npm install
npm run dev
```

The frontend proxies API calls to the backend on port 8080. Adminer, a database management interface,
is available at http://localhost:8888.

## The Build Guide

The full step-by-step write-up of the build lives in [docs/blog-app-combined.md](docs/blog-app-combined.md).
It covers the project brief, the domain design, and then builds the backend up endpoint by endpoint,
including the Spring Security and JWT authentication setup.

Copyright © 2024 Devtiro Ltd.
