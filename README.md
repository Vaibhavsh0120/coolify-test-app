# coolify-test-app 🚀

A modern Express.js web application with a charcoal glassmorphism UI, designed for deployments on [Coolify](https://coolify.io).

## Features

- **Modern Charcoal Glassmorphism UI**: Frosted glass container, live-ticking server synchronized clock, and subtle dark ambient lighting.
- **Health Check Endpoint**: `GET /health` returns `{ "status": "healthy" }`.
- **Dockerized**: Containerized with Node.js 20 on Alpine Linux.

## Endpoints

- `GET /` — Main page with greeting & live clock.
- `GET /health` — Health check endpoint.

## Local Development

```bash
# Install dependencies
npm install

# Start the server
npm start
```

## Docker

```bash
# Build Docker image
docker build -t coolify-test-app .

# Run Docker container
docker run -p 3000:3000 coolify-test-app
```
