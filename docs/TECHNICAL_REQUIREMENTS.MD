# Technical Requirements Document
**Project:** Community Pickleball App
**Version:** 1.0
**Date:** 2025-11-22

## 1. System Overview
The application will be a **Progressive Web App (PWA)** designed for mobile-first usage. It will be hosted on a **Synology NAS** using **Docker Compose**, exposed to the public internet via **Cloudflare Tunnel**. The system follows a standard Client-Server architecture with a decoupled frontend and backend.

## 2. Technology Stack

### 2.1. Infrastructure & DevOps
*   **Containerization:** Docker & Docker Compose
*   **Web Server / Reverse Proxy:** Nginx (serving static frontend & proxying API)
*   **Database:** PostgreSQL (latest stable)
*   **Message Broker:** Redis (for Celery)
*   **Tunneling:** Cloudflare Tunnel (`cloudflared`) for secure public access without port forwarding.

### 2.2. Backend
*   **Language:** Python 3.11+
*   **Framework:** Django 5.x
*   **API:** Django REST Framework (DRF)
*   **Authentication:** JWT (JSON Web Tokens) via `djangorestframework-simplejwt`
*   **Async Tasks:** Celery (for notifications, match timeouts, scheduled polls)
*   **WSGI Server:** Gunicorn
*   **Entrypoint Script:** `docker-entrypoint.sh` (handles DB wait, migrations, static collection)

### 2.3. Frontend
*   **Library:** React 18+
*   **State Management:** Redux Toolkit (RTK) & RTK Query (for API caching)
*   **Styling:** Material-UI (MUI) v5+ (for mature, responsive components) or Tailwind CSS (for custom styling). *Recommendation: MUI for speed of development.*
*   **PWA Support:** `vite-plugin-pwa` (Service Workers, Manifest for "Add to Home Screen")
*   **Routing:** React Router v6

## 3. Backend Architecture (Django)

### 3.1. App Structure
The project will be organized into modular Django apps:
*   `core`: System-wide utilities, base models, and management commands.
*   `users`: User authentication, profiles, skill levels (Emerging, Intermediate, Advanced), and admin approval workflows.
*   `community`: Feed posts, comments, likes, and announcements.
*   `scheduling`: Polls ("Who's In?"), calendar sessions, and RSVPs.
*   `competition`: Challenge logic, match reporting, scoring, and ranking updates.

### 3.2. Key API Endpoints (Draft)
*   **Auth:** `/api/auth/login/`, `/api/auth/register/`, `/api/auth/refresh/`
*   **Users:** `/api/users/profile/`, `/api/users/pending/` (Admin only)
*   **Feed:** `/api/community/feed/` (GET/POST), `/api/community/posts/{id}/like/`
*   **Polls:** `/api/scheduling/polls/`, `/api/scheduling/rsvp/`
*   **Challenges:** `/api/competition/challenges/`, `/api/competition/match-result/`

## 4. Database Schema (High-Level)

### 4.1. Users & Profiles
*   **User:** Extends `AbstractUser`.
*   **Profile:**
    *   `user` (FK)
    *   `skill_level` (Enum: Emerging, Intermediate, Advanced)
    *   `status` (Enum: Pending, Active, Banned)
    *   `avatar` (ImageField)
    *   `stats` (JSONField: wins, losses, streak)

### 4.2. Community
*   **Post:** `author` (FK), `content` (Text), `image` (Image), `created_at`, `type` (UserPost, SystemAnnouncement).
*   **Comment:** `post` (FK), `author` (FK), `text`.
*   **Like:** `post` (FK), `user` (FK).

### 4.3. Scheduling
*   **Poll:** `date`, `time_start`, `time_end`, `location`.
*   **RSVP:** `poll` (FK), `user` (FK), `status` (In, Out, Late), `partner` (FK, optional).

### 4.4. Competition
*   **Challenge:**
    *   `challenger_1` (FK), `challenger_2` (FK)
    *   `defender_1` (FK), `defender_2` (FK)
    *   `status` (Open, Accepted, Played, Cancelled)
    *   `result` (Pass/Fail)
    *   `score` (Text or JSON)

## 5. Deployment Strategy (Synology NAS)

### 5.1. Docker Compose Configuration
We will use a single `docker-compose.yml` to orchestrate all services.

**Services:**
1.  **`db`**: PostgreSQL container. Data persisted to `./data/postgres`.
2.  **`redis`**: Redis container for Celery broker.
3.  **`backend`**: Django Gunicorn server. Depends on `db` and `redis`.
4.  **`worker`**: Celery worker process. Depends on `backend`.
5.  **`frontend`**: Node.js container for building React (multi-stage build) -> Nginx serving static files.
6.  **`nginx`**: Main reverse proxy. Routes `/api/` to `backend` and `/` to frontend static files.
7.  **`tunnel`**: Cloudflare `cloudflared` container. Connects the local Nginx to the public web.

### 5.2. Environment Variables
A `.env` file will manage secrets (not committed to repo):
*   `DJANGO_SECRET_KEY`
*   `POSTGRES_PASSWORD`
*   `CLOUDFLARE_TOKEN`

## 6. Security & Performance
*   **HTTPS:** Handled automatically by Cloudflare Tunnel.
*   **Static Files:** Served efficiently by Nginx.
*   **Media Files:** User uploads (avatars, post images) will be stored in a mapped volume on the NAS and served by Nginx.
*   **Rate Limiting:** DRF throttling to prevent abuse.

## 7. Development Workflow
1.  **Local Dev:** Run `docker-compose up --build` on your machine.
2.  **Migration:** `docker-compose exec backend python manage.py migrate`.
3.  **Deployment:** Pull code on NAS, run `docker-compose up -d`.
