# Development Plan

This document outlines the step-by-step plan to build the Community Pickleball App. We will implement the Backend first, followed by the Frontend, verifying each step along the way.

## Part 1: Backend Implementation (Django + Docker)

### 1. Architecture & Infrastructure
- **Objective:** Set up the containerized environment and core Django project.
- **Tasks:**
    - [ ] Create `docker-compose.yml` (Postgres, Redis, Backend, Nginx, Tunnel).
    - [ ] Create `backend/Dockerfile` and `docker-entrypoint.sh`.
    - [ ] Initialize Django project `config` and `core` app.
    - [ ] Configure `settings.py` for Docker environment (DB, Redis, Allowed Hosts).
- **Verification:**
    - [ ] Run `docker-compose up -d`.
    - [ ] Check logs: `docker-compose logs backend` (should show server running).
    - [ ] Curl test: `curl http://localhost/api/health/` (or similar).

### 2. User Management & Authentication
- **Objective:** Implement secure user registration, login, and profiles.
- **Tasks:**
    - [ ] Create `users` app.
    - [ ] Implement `User` model and `Profile` model (Skill Level).
    - [ ] Setup JWT Authentication (`simplejwt`).
    - [ ] Create APIs: Register, Login, Me, Profile Update.
- **Verification:**
    - [ ] **Automated Test:** `pytest` for User model creation and Auth APIs.
    - [ ] **Manual:** Register a user via Postman/Curl, get Token.

### 3. Community Module (Feed)
- **Objective:** Allow users to post updates and interact.
- **Tasks:**
    - [ ] Create `community` app.
    - [ ] Implement `Post` and `Comment` models.
    - [ ] Create APIs: List Feed, Create Post, Like Post.
- **Verification:**
    - [ ] **Automated Test:** `pytest` for creating posts and listing feed.

### 4. Scheduling Module (Polls)
- **Objective:** Implement "Who's In" polling system.
- **Tasks:**
    - [ ] Create `scheduling` app.
    - [ ] Implement `Poll` and `RSVP` models.
    - [ ] Create APIs: List Polls, RSVP (In/Out/Late).
    - [ ] Implement "Smart Count" logic (aggregating skill levels).
- **Verification:**
    - [ ] **Automated Test:** `pytest` for RSVP logic and counts.

### 5. Competition Module (Challenges)
- **Objective:** Implement the challenge protocol.
- **Tasks:**
    - [ ] Create `competition` app.
    - [ ] Implement `Challenge` model.
    - [ ] Create APIs: Create Challenge, Accept, Report Result.
- **Verification:**
    - [ ] **Automated Test:** `pytest` for challenge flow.

---

## Part 2: Frontend Implementation (React + Vite)

### 1. Architecture & Setup
- **Objective:** Initialize the PWA and basic routing.
- **Tasks:**
    - [ ] Initialize Vite project (TypeScript).
    - [ ] Setup Docker for frontend (Multi-stage build).
    - [ ] Install MUI, Redux Toolkit, React Router.
    - [ ] Configure `nginx.conf` for serving frontend and proxying API.
- **Verification:**
    - [ ] **Browser Test:** Open `http://localhost`. Verify "Welcome" page loads.

### 2. Authentication UI
- **Objective:** Login and Registration screens.
- **Tasks:**
    - [ ] Create `auth` slice in Redux.
    - [ ] Build `LoginPage` and `RegisterPage`.
    - [ ] Implement Protected Routes (redirect to login if unauthenticated).
- **Verification:**
    - [ ] **Browser Subagent:** Navigate to Login, enter credentials, verify redirect to Home.

### 3. Community Feed UI
- **Objective:** Display the activity feed.
- **Tasks:**
    - [ ] Create `feed` slice in Redux.
    - [ ] Build `FeedPage` and `PostCard` components.
    - [ ] Implement "Create Post" FAB (Floating Action Button).
- **Verification:**
    - [ ] **Browser Subagent:** Create a new post, verify it appears in the list.

### 4. Scheduling UI
- **Objective:** The "Who's In" dashboard.
- **Tasks:**
    - [ ] Create `schedule` slice.
    - [ ] Build `SchedulePage` and `PollCard`.
    - [ ] Implement RSVP buttons and "Smart Count" display.
- **Verification:**
    - [ ] **Browser Subagent:** Click "I'm In", verify count updates.

### 5. Competition UI
- **Objective:** Challenge management.
- **Tasks:**
    - [ ] Create `challenge` slice.
    - [ ] Build `ChallengePage` and `ChallengeCard`.
    - [ ] Implement "Create Challenge" modal.
- **Verification:**
    - [ ] **Browser Subagent:** Create a challenge, verify it appears in the list.

---

## Part 3: Final Polish & Deployment
- **Tasks:**
    - [ ] Optimize Docker images.
    - [ ] Finalize `docker-entrypoint.sh`.
    - [ ] Verify PWA "Add to Home Screen" manifest.
