# Blog Platform

- A Spring Boot based REST API for creating, editing, organizing, publishing, and discovering blog posts.
- **Backend**: Spring Boot for handling application logic, exposing REST APIs, and managing database operations.
- **Database**:  PostgreSQL for persistent data storage and H2 for testing.
- **Security & Authentication**: Spring Security and JWT for user authentication.
- **Containerization**: Docker and Docker Compose are used to containerize application components and to simplify application setup.
  
> **Note:** This App also has frontend component built using React, TypeScript, and Vite. The frontend was developed with **AI assistance** and integrates with the Spring Boot REST API. Frontend implementation details are kept brief, as the primary focus of this project is on the backend, which was my own effort.

---

## 🛠️ Tech Stack

| **Layer** | **Technology** |
|---|---|
| **Backend** | Java 21 \| Spring Boot 3.4.0 \| Spring MVC |
| **Security & Authentication** | Spring Security \| JWT |
| **Persistence & ORM** | Spring Data JPA \| Hibernate |
| **Validation** | Hibernate Validator |
| **Database** | PostgreSQL \| H2 (Testing) |
| **Object Mapping & Code Generation** | MapStruct \| Lombok |
| **Build Tools** | Apache Maven |
| **Containerization** | Docker \| Docker Compose |

---

## 🚀 Running Application
**Prerequisites**
- Docker
- Node.js 20 or later
  
**Start the Backend and Supporting Services**
  ```bash
  # Start PostgreSQL database
  # Start Adminer (web-based database management interface)
  # Build and start Spring Boot Application
  # This will launch three Docker Containers
  cd backend
  docker compose up --build
```

**Run the frontend**
  ```bash
  # In a second terminal
  cd frontend
  npm install
  npm run dev
  ```
---

## 🌐 Application Access

- The following services are available when the application is running:

  | Service | URL / Port | Description |
  |---|---|---|
  | Frontend | `http://localhost:5173` | Web application interface |
  | Backend API | `localhost:8080` | Handles API requests from the frontend |
  | PostgreSQL | `localhost:5432` | Application database |
  | Adminer | `http://localhost:8888` | Web-based database management interface |

- Access the PostgreSQL database through Adminer at `http://localhost:8888` using the following connection details:

  | Setting | Value |
  |---|---|
  | System | `PostgreSQL` |
  | Server | `db` |
  | Username | `postgres` |
  | Password | `changemeinprod!` |

- Default Login Credentials: Use the following credentials to log in to the application:
  | Field | Value |
  |---|---|
  | **Email** | `user@test.com` |
  | **Password** | `password` |

---

## 📋 The Project Brief
Our project is a Blog Platform that will allow writers to create, manage, and organize their content effectively.

**Core Concepts**
- At the heart of our blog platform are three fundamental concepts: posts, categories, and tags.
- Posts represent the primary content of our blog platform. Each post must have a title and content body, and it exists as either a draft or published post.
- Writers can format their content using elements like bold text, italics, headings, and lists. We'll also calculate estimated reading time for each post.
- Categories provide a way to organize posts into broad themes like Technology, Travel, or Personal Development. Every post must belong to exactly one category.
- Tags offer a more flexible way to describe post content. Unlike categories, tags are granular and versatile. A post about a Python machine learning project might belong to the Technology category but have multiple tags like "Python", "Machine Learning", and "Tutorial".

**System Requirements**
- The platform requires a content creation system with a rich text editor. Writers need to create posts, edit them, format their content, and manage them over time.
- For content organization, the system needs comprehensive management of both categories and tags. Users can create and delete these organizational elements, and our system will track post counts for each category and tag.
- The platform must support draft functionality. Writers can save works in progress, track when they were last modified, and preview before publishing.

**Summary**
- Rich text blogging platform with post drafts and publishing workflow
- Posts belong to one category but can have multiple tags for flexible organization
- Draft system for work-in-progress content management

---

## 🧩 Domain Overview

These objects and their relationships form the foundation of our application's data model.

**User**
- Users represent the authors of our blog platform.
- Each user requires a unique identifier and email address for authentication, along with a securely stored password.
- Users have a display name that appears on their posts and we track when they joined the platform.
- A single user can create multiple blog posts, and we maintain this relationship to properly attribute content and manage permissions.

**Post**
- Posts serve as the central content type in our platform.
- Each post contains a title and the main content body, along with metadata such as creation and update timestamps.
- Posts must be associated with an author (User) and assigned to a Category, while optionally being tagged with multiple Tags.
- Posts can exist in either a draft or published state, and we calculate an estimated reading time based on the content length.
- This object forms the heart of our platform, connecting to users, categories, and tags.

**Category**
- Categories provide a mandatory, high-level organization system for our content.
- Each category has a unique identifier and name, and it maintains a collection of all posts assigned to it.
- We track the number of published posts in each category to help with navigation and content discovery.
- Categories are straightforward but essential, as every post must belong to exactly one category to maintain clear content organization.

**Tag**
- Tags offer a flexible way to classify content beyond the primary categorization.
- Each tag has a unique identifier and name, and it can be associated with any number of posts. Unlike categories, tags are optional and posts can have multiple tags.
- We track the number of published posts associated with each tag to help users discover related content.
- Tags enable cross-cutting content organization that complements the hierarchical category structure.

**Domain Relationships**
- Our domain objects form an interconnected web of relationships that define how content is organized and accessed.
- Users create posts, establishing a one-to-many relationship where a single user can author many posts, but each post has exactly one author.
- Categories also have a one-to-many relationship with posts, as each post must belong to exactly one category, while categories can contain multiple posts.
- Tags and posts form a many-to-many relationship, allowing posts to have multiple tags and tags to be associated with multiple posts, requiring a join table in our database implementation.

**Summary**
- Users create and own posts
- Posts connect to users, categories, and tags
- Categories provide mandatory, high-level organization
- Tags enable flexible, optional content classification

---

## 🏗️ Architecture Overview

Our blog platform uses a three-tier architecture that consists of a React frontend, Spring Boot backend, and PostgreSQL database.

Each component focuses on specific responsibilities while communicating through well-defined interfaces.

**Frontend Layer**
- Our React frontend handles all user interactions and interface rendering.
- It manages client-side state, processes forms, and communicates with the backend through API calls.

**Backend Layer**
- The Spring Boot backend implements our core business logic and API endpoints.
- It handles data validation, authentication and our business logic.
- The backend serves as an intermediary between the frontend and database, ensuring data integrity and security.
  
**Data Layer**
- PostgreSQL provides our persistent data storage with ACID compliance and relational capabilities.
- It maintains data integrity while supporting complex queries and relationships needed for our blog platform.

**Component Communication**
- Frontend to Backend Communication
- Communication occurs through a REST API using JSON data format.
- HTTP methods map to specific operations while maintaining stateless communication.
- React components make HTTP requests to API endpoints and update the UI based on responses.

**Backend to Database Communication**
- Spring Data JPA eliminates direct SQL writing through powerful abstractions.
- It generates SQL queries from method names and handles entity mapping automatically.
- Repository interfaces define our database operations while Spring Data JPA implements them.

**Flow of Operations**
- When users interact with the React UI, it triggers HTTP requests to Spring Boot endpoints.
- The backend validates and processes these requests through business logic layers.
- Spring Data JPA converts operations to database queries, with results flowing back through layers to update the UI.

**Summary**
- Three-tier architecture separates concerns between frontend, backend, and database
- React frontend provides an interactive user interface
- Spring Boot backend manages business logic and API endpoints
- PostgreSQL ensures reliable data persistence


**Summary**
- Authentication uses JWT tokens for secure, stateless sessions
- Post endpoints support full content lifecycle management
- Category endpoints maintain primary content organization
- Tag endpoints enable flexible content classification
