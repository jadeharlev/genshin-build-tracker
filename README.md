# Genshin Build Tracker

A full-stack web app for tracking your Genshin Impact characters, weapons, artifacts, builds, and teams.

## Tech Stack

- **Frontend**: React 19 + TypeScript (Vite)
- **Backend**: ASP.NET Core 8 (C#)
- **Database**: MySQL 8
- **Cache**: Redis
- **Auth**: Google OAuth 2.0 + JWT
- **Containerization**: Docker Compose

## Features

- Google OAuth sign-in
- Character, weapon, and artifact management
- Build creation linking characters, weapons, and artifacts
- Team composition tracking
- Artifact CSV export
- Collection stats dashboard
- Game data sync from external API (out of date, needs updating)

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) (for frontend dev server)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) (for backend development)
- Google OAuth credentials ([Google Cloud Console](https://console.cloud.google.com/))

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/jadeharlev/genshin-build-tracker.git
   cd genshin-build-tracker
   ```

2. Create environment files from the examples and fill in your values:

   ```bash
   cp .env.example .env
   cp Frontend/.env.example Frontend/.env
   ```

   `.env` requires your Google OAuth credentials, a JWT secret, and database passwords.
   `Frontend/.env` requires your Google OAuth client ID.

3. Start the backend services (MySQL, Redis, and API):

   ```bash
   docker compose up --build -d
   ```

   The database schema initializes automatically from the mounted scripts on first run.

4. Start the frontend dev server:

   ```bash
   cd Frontend
   npm i
   npm run dev
   ```

5. Visit [http://localhost:5173](http://localhost:5173)

## Stopping

```bash
docker compose down
```

> **Note**: `docker compose down -v` will delete the database volume and wipe all data.

## Architecture

### Overview

- Frontend (React)
- Backend (ASP.NET Core API)
- MySQL, Redis (cache)

### Backend

- **Controllers** expose REST API endpoints
- **Repositories** handle all MySQL queries via Dapper (micro-ORM)
- **Services** manage cross-cutting concerns (game data sync, auth, caching)
- Dependencies are wired up via built-in .NET dependency injection

### Auth Flow

1. User signs in via Google OAuth on the frontend
2. Google ID token is sent to `/api/auth/google`
3. Backend verifies the token with Google, finds or creates the user
4. Backend issues a JWT (access + refresh) back to the frontend
