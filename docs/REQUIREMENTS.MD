# Product Requirements Document (PRD)

**Project:** Community Pickleball App  
**Version:** 1.1  
**Target Audience:** 250+ Community Members (Emerging to Advanced)

## 1. Executive Summary
The goal is to build a mobile-first application to replace WhatsApp as the primary tool for a pickleball community. The app prioritizes **Social Interaction (90%)**—making it fun to check in, share photos, and see who is playing—while offering a structured **Competitive Path (10%)** for players who wish to upgrade their skill rating through validated challenges.

## 2. User Roles & Permissions

### A. Players
*   **Emerging:** Beginners/Learners.
*   **Intermediate:** Standard recreational players.
*   **Advanced:** Competitive players (Gatekeepers of the top tier).

### B. Administrators
*   **Community Admin:** Moderators who can approve new members, manage reports, and oversee the feed.
*   **Super Admin:** Full system access (including penalties and system configuration).

## 3. Functional Requirements

### Module 1: Onboarding & Authentication
**Goal:** A secure community with verified skill levels.

*   **Sign Up / Login:** Users sign in via Google or Email/Password.
*   **Initial Profile Setup:** User enters Name and Contact Info.
*   **Self-Selection:** User selects their requested skill level (Emerging, Intermediate, Advanced).
*   **The "Holding Pattern" (Approval State):**
    *   New accounts are set to "Pending" status.
    *   User sees a "Waiting for Admin Approval" screen.
*   **Admin Approval Queue:**
    *   Admins view a list of pending sign-ups.
    *   **Actions available to Admin:**
        *   **Approve:** Grants the requested level.
        *   **Adjust & Approve:** Changes level (e.g., requested Advanced $\rightarrow$ set to Intermediate) and approves.
        *   **Flag for Test:** Approves as lower level but adds a note that user needs a skill assessment.

### Module 2: The Community Hub (Home Feed)
**Goal:** High engagement. The "Instagram" for the court.

*   **Activity Feed:** Vertical scroll of content.
*   **User Content:** Players can post photos/videos (e.g., Court Selfies).
*   **System Content:** Automated posts when major events happen (e.g., "Team A & B just got promoted to Advanced!").
*   **Interactions:** Users can "Like" (Pickle Icon) and Comment on posts.
*   **"Who's In?" Polling:**
    *   Any member can create a poll for a future date (e.g., "Sunday Morning 8 AM?").
    *   **Visuals:** Users vote "In", "Out", or "Maybe". The "In" list displays user avatars for quick identification.

### Module 3: The "Super Poll" (Scheduling)

**Goal:** Create "FOMO" (Fear Of Missing Out) so people show up.

#### 1. The "Who's In" Dashboard
Instead of a simple "Yes/No" question, the Poll needs to give Data so players can decide if the mix is right for them.

*   **The Logic:**
    *   **Admin/System:** Creates recurring slots (e.g., "Every Sat/Sun 7 AM - 11 AM").
    *   **The User View:** A calendar strip or list of upcoming sessions.
*   **The "Smart" Count:**
    *   Instead of saying "18 People Going", it breaks it down:
    *   `18 Players` $\rightarrow$ `(4 Advanced)` | `(10 Intermediate)` | `(4 Emerging)`.
    *   **Why:** If I am Advanced, and I see "0 Advanced" signed up, I might stay home. If I see "3 Advanced," I am definitely going.

#### 2. Detailed RSVP Options
Simple "Yes/No" isn't enough for a morning session.

*   **Options:**
    *   ✅ I'm In (General)
    *   ⏰ Late (e.g., "Arriving 9:00 AM")
    *   ❌ Out
*   **The "Partner" Link:**
    *   Users can tag a partner when RSVPing: "I'm in + playing with Mike."

#### 3. The "Tipping Point" Notification
This is the killer feature to drive attendance.

*   **Feature:** Users can subscribe to specific days.
*   **Logic:** If the number of RSVPs hits a certain number (e.g., 12 players), send a notification to everyone on the fence ("Maybe"):
    *   *"Game On! 12 players are confirmed for tomorrow. Come join!"*

#### Updated Screen List (No Queue)
We are swapping Screen 3 (Queue) for Screen 3 (Calendar/Events).

*   **Screen 3: The Calendar (New)**
    *   **Top:** Horizontal Date Strip (Sat 21 | Sun 22 | Mon 23).
    *   **Body:** List of Sessions for that day.
    *   **Card:** "Saturday Open Play" (7 AM - 11 AM).
    *   **Visual:** Progress bar showing attendance (e.g., 16 confirmed).
    *   **Details:** List of Avatars showing who is going, sorted by Skill Level.
    *   **Action:** Big `[ I'M IN ]` button.

#### How this changes the "Challenge" Workflow
Since there is no Queue to manage courts:

*   **Challenge Request:** Works exactly the same (Broadcasts to finding defenders).
*   **Match Time:** Instead of "Waiting for a court," the app just says:
    *   *"Match Confirmed for Saturday @ 9 AM. Grab any open court."*

### Module 4: The Challenge Protocol (Progression)
**Goal:** A transparent, crowd-sourced way to move up levels.

*   **Structure:** Strictly 2v2.
*   **Challengers:** A pair from a lower tier (e.g., Intermediate).
*   **Defenders:** A pair from the higher tier (e.g., Advanced).
*   **Initiation Flow:**
    1.  Player A (Challenger) taps "Start Challenge."
    2.  Player A selects Player B (same level) as a partner.
    3.  Player B receives a prompt to "Accept Teammate Request."
*   **The Broadcast (Finding Opponents):**
    *   Once the Challenger Team is formed, the system sends a Push Notification to ALL players in the target (higher) tier.
    *   **Message:** "New Challenge! [Name A] & [Name B] want a shot at Advanced."
*   **Acceptance:** First-come, first-served. An Advanced player accepts the challenge and invites their own partner.
*   **Result & Voting:**
    *   Match is played.
    *   **Score Input:** Only the Defenders can input the final score (Trust Mechanism).
    *   **The Vote:** Defenders vote Pass or Fail based on Challenger performance.
*   **Outcome:**
    *   **Pass:** Challengers are automatically upgraded to the new tier. A celebration post is auto-generated in the Feed.
    *   **Fail:** Challengers remain at current tier.

## 4. Governance & Rules

### A. The "Flake" Policy (Cancellations)
*   **Trigger:** A scheduled Challenge match is missed or cancelled last-minute.
*   **Reporting:** Defenders utilize a "Report No-Show" button on the match screen.
*   **Penalty:** The offending Challenger receives a temporary ban from creating new challenges (Default: 2 weeks). Configurable by Super Admin.

### B. Notification Strategy
*   **High Priority (Push Notification + Sound):**
    *   Events that require immediate physical action:
        *   "You are up next on court."
        *   "New Challenge Request" (for higher tier players).
        *   "Match Confirmed."
*   **Low Priority (In-App Badge/Red Dot):**
    *   Passive social events:
        *   New Comment / Like.
        *   New Poll posted.
        *   General Announcements.

## 5. Data & Profile Requirements

*   **User Profile Identity:** Name, Profile Photo (Avatar).
*   **Visual Badge:** Distinct border or icon indicating current Tier (Green/Blue/Gold).
*   **Fun Stats (Gamification):**
    *   "Court Rat" (Total Check-ins).
    *   "Streak" (Consecutive weeks played).
    *   "Challenge Record" (Wins/Losses in challenge mode only).

## 6. Required Screens (Wireframe List)

1.  **Login / Onboarding:** Sign-in options and Level Selection.
2.  **Admin Dashboard:** The "New Member Approval" cards.
3.  **Home Feed:** The vertical scroll with embedded Polls.
4.  **The Queue:** Simple list view of names waiting.
5.  **Challenge Dashboard:**
    *   State A: "Create Challenge" / "Accept Partner Invite".
    *   State B: "Waiting for Defenders" (Broadcast view).
    *   State C: Match Result & Voting Input.
6.  **User Profile:** Stats, badges, and history.

## 7. PWA & Technical Experience Requirements
Since this is not a Native App Store app, these requirements are critical for adoption.

### A. Installability (The "App" Feel)
*   **Add to Home Screen:** The app must trigger the native browser prompt (or provide a clear custom instruction overlay) encouraging users to "Add to Home Screen" on the first visit.
*   **Standalone Mode:** When launched from the Home Screen, the app must launch in full-screen mode (hiding the URL bar and browser navigation buttons) to mimic a native app.
*   **App Icon:** Must have a high-resolution icon that looks good on iOS and Android home screens.

### B. Push Notifications (iOS 16.4+ & Android)
*   **Permission Request:** The app must explicitly ask for Notification Permissions after the user has logged in (not immediately upon load), explaining the value (e.g., "Enable notifications to know when it's your turn to play").
*   **Delivery:** Notifications must work even when the phone is locked (essential for the "Broadcast" feature).

### C. Offline Resilience
*   **Network Flakiness:** Pickleball courts often have poor signal. The app must not crash if the internet drops.
*   **Caching strategy:**
    *   The "Home Feed" and "Schedule" should load the last known version if offline.
    *   Actions taken while offline (e.g., "Check In") should queue and sync automatically when the connection returns.

### D. Deployment Constraints
*   **Self-Hosted:** The system must run via Docker containers on a Synology NAS.
*   **Access:** Must be accessible via public internet (Cloudflare Tunnel) to ensure users can access it without being on the local Wi-Fi.