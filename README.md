# coolify-test-app 🚀

A modern Express.js web application with a charcoal glassmorphism UI and PostgreSQL database integration, built for [Coolify](https://coolify.io).

## Features

- **Modern Charcoal Glassmorphism UI**: Frosted glass container, live-ticking clock, and ambient lighting.
- **Message Persistence**: Form to submit messages saved to a connected PostgreSQL database.
- **Auto Table Creation**: Automatically creates `messages` table on startup (`id SERIAL PRIMARY KEY, content TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`).
- **Health Check Endpoint**: `GET /health` returns `{ "status": "healthy", "databaseConnected": boolean }`.
- **Dockerized**: Containerized with Node.js 20 on Alpine Linux.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | HTTP port the server listens on | `3000` |
| `DATABASE_URL` | PostgreSQL connection string (e.g., `postgres://user:pass@host:5432/dbname`) | `undefined` |

## Endpoints

- `GET /` — Main page with greeting, live clock, message submission form, and database records.
- `POST /message` — Accepts `content` in request body, saves to PostgreSQL, and redirects to `/`.
- `GET /health` — Health check returning `{ "status": "healthy", "databaseConnected": boolean }`.

## Connecting PostgreSQL in Coolify

1. In your Coolify Project, click **+ New Resource** > **Databases** > **PostgreSQL**.
2. Once the PostgreSQL database is deployed, copy its internal connection URL.
3. In your `coolify-test-app` service on Coolify, go to **Environment Variables** and add:
   ```env
   DATABASE_URL=postgres://user:password@<db-container-name>:5432/db
   ```
4. Redeploy the application. The status indicator will turn green (`● PostgreSQL Connected`) and messages will persist across restarts!
