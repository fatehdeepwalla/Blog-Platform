# Devtiro Blog App

This is the backend and frontend source code for the Devtiro blog app build published December 2024.

The Blog Platform is a blogging application built with Spring Boot and Spring Security, using JWT
authentication, with a React frontend.

You can check out the build video [here](https://youtu.be/Gd6AQsthXNY).

## The Build Guide

The full step-by-step write-up of the build lives in [docs/blog-app-combined.md](docs/blog-app-combined.md).
It covers the project brief, the domain design, and then builds the backend up endpoint by endpoint,
including the Spring Security and JWT authentication setup.

## What's In This Repo

| Directory   | Contents                                                          |
| ----------- | ----------------------------------------------------------------- |
| `docs/`     | The build guide                                                   |
| `backend/`  | The Spring Boot backend, as built in the video                    |
| `frontend/` | The React frontend, provided for you to interact with the backend |

## Running It

You'll need JDK 21, Node 20 or later, and Docker.

```bash
# Start PostgreSQL (and Adminer) and run the backend
cd backend
docker compose up -d
./mvnw spring-boot:run

# Run the frontend, in a second terminal
cd frontend
npm install
npm run dev
```

The frontend proxies API calls to the backend on port 8080. Adminer, a database management interface,
is available at http://localhost:8888.

> [!WARNING]
> This project is pinned to **Java 21** and **Spring Boot 3.4.0**. It was built and tested against
> those versions only. Newer versions of Spring Boot and Java may require changes to the code and
> configuration in this repo, and the guide's instructions may no longer match what you see.

> [!CAUTION]
> **This is intended for your local development environment only.** It is not production-ready.
>
> The authentication here exists to show you how Spring Security and JWTs fit together — it is a
> teaching aid, not a foundation to build on. **For a real application, don't hand-roll auth: consider using an
> OIDC provider**.

> [!IMPORTANT]
> This is a teaching project. It's written to demonstrate how a Spring Boot application is designed
> and built, following the same practices I'd use on real work — a layered architecture, DTOs and
> mappers at the API boundary, constructor injection, and centralised error handling.
>
> That said, it was built live, and its scope is deliberately limited to what the build covers. It
> may contain bugs, and some things a production system would need — refresh tokens, CSRF
> protection, comprehensive input validation, a full test suite — are out of scope by design rather
> than by oversight.

## Licence

This repo is licensed in two parts.

**The code** — `backend/` and `frontend/` — is [MIT licensed](LICENSE). Use it, change it, build on
it, no strings attached.

**The build guide** — everything in [`docs/`](docs/LICENSE) — is licensed under
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). You're welcome to share it,
translate it, and build on it, but please credit Devtiro, don't sell it or put it behind a paywall,
and keep any adaptations under the same licence.

Copyright © 2024 Devtiro Ltd.
