# Technical Assessment

## Overview
This project consists of a **backend** (NestJS, TypeORM, PostgreSQL) and a **frontend** (React, Vite, TanStack Query) for managing and displaying CSV data. Both can be run locally or with Docker Compose.

---

## Backend
- **Framework:** NestJS
- **Database:** PostgreSQL (via TypeORM)
- **Validation:** class-validator
- **API Docs:** Swagger (OpenAPI)

### How to Run Locally
1. Install dependencies:
   ```sh
   cd backend
   pnpm install
   ```
2. Set up a PostgreSQL database (default: `localhost:5432`).
3. Configure environment variables as needed (see `.env.example` if present).
4. Start the server:
   ```sh
   pnpm start:dev
   ```
5. API docs available at `http://localhost:3000/api` (Swagger UI).

### How to Run with Docker Compose
1. From the project root:
   ```sh
   docker compose up -d --build
   ```
2. Backend runs on `http://localhost:3000`.

### How to Test
- Unit & e2e tests:
  ```sh
  pnpm test
  # or for e2e
  pnpm test:e2e
  ```

---

## Frontend
- **Framework:** React (Vite)
- **State/Data:** TanStack Query
- **Testing:** Vitest
- **UI Components:** shadcn/ui + custom (see `src/components/ui`)

### How to Run Locally
1. Install dependencies:
   ```sh
   cd frontend
   pnpm install
   ```
2. Start the dev server:
   ```sh
   pnpm dev
   ```
3. App runs on `http://localhost:5173` (default Vite port).

### How to Run with Docker Compose
1. From the project root:
   ```sh
   docker compose up -d --build
   ```
2. Frontend runs on `http://localhost:3001`

### How to Test
- Run all tests:
  ```sh
  pnpm test
  ```

---

## Tools Used

### Backend
- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [class-validator](https://github.com/typestack/class-validator)
- [Swagger](https://swagger.io/)
- [Jest](https://jestjs.io/) (for testing)

### Frontend
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Vitest](https://vitest.dev/) (for testing)
- [nginx](https://nginx.org/) (for Docker container)

---

## Docker Compose
- Orchestrates backend, frontend, and database containers.
- See `docker-compose.yml` for service definitions.

---

## Additional Notes
- For production, use `docker-compose.production.yml`.
- Environment variables can be set in `.env` files or via Docker Compose `environment` sections.
- For orchestration in production, you can use Docker Swarm:
1. Initialize Swarm (if not already):
    ```sh
    docker swarm init
    ```
2. Build images
    ```sh
    docker compose -f docker-compose.production.yml build
    ```
3. Deploy the stack
    ```
    docker stack deploy -c docker-compose.production.yml tech-assessment
    ```
4. To remove the stack
    ```
    docker stack rm tech-assessment
    ```
- Access frontend via `frontend.docker.localhost` and backend via `backend.docker.localhost`.
