# ZeroWaste Dhaka - Project Setup

This project is a React frontend application built with Vite and Tailwind CSS. It is structured with a modular layout where pages are located in the `src/pages` folder, and custom client-side routing is handled through the main application entry point.

## Directory Structure

```
zerowaste/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── src/
    ├── main.jsx                 # Application entrypoint & custom client-side router
    ├── App.jsx                  # Main Landing Page
    ├── index.css                # Global CSS stylesheet
    └── pages/                   # Core application pages
        ├── auth.jsx             # User Authentication & role selection
        ├── map.jsx              # Volunteer Map Feed (Available surplus food)
        ├── active-claim.jsx     # Active Claim route & handover confirmation
        ├── dashboard.jsx        # Restaurant Manager dashboard overview
        ├── wastelog.jsx         # Analytics and tracking of restaurant food waste
        └── Leaderboard.jsx      # Leaderboard for volunteers and partner restaurants
```

---

## Client-Side Router (`src/main.jsx`)

The routing is managed dynamically inside `src/main.jsx` using a lightweight custom router that listens to `popstate` and a custom `pushstate` event. This avoids external dependencies while supporting browser navigation.

```javascript
// Navigates and triggers page rendering
const navigate = (path) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('pushstate'));
};
```

---

## Page Components Overview

### 1. User Authentication (`src/pages/auth.jsx`)
- **Path**: `/auth`
- **Purpose**: Authenticates volunteers and restaurant managers. Supports Sign In/Sign Up tabs and role selection cards.
- **Routing behavior**:
  - Volunteer roles route to the Map Feed (`/map`).
  - Manager roles route to the Dashboard (`/dashboard`).

### 2. Active Claim Navigation (`src/pages/active-claim.jsx`)
- **Path**: `/active-claim`
- **Purpose**: Helps active volunteers navigate to the target restaurant.
- **Key Features**: Live GPS mockup route map, ETA countdown tracker, and a one-click button to confirm food pickup & handover.

### 3. Volunteer Map Feed (`src/pages/map.jsx`)
- **Path**: `/map`
- **Purpose**: Live map feed displaying nearby surplus food listings posted by restaurants.
- **Key Features**: Location pins, filters (by food category), and distance/expiry notifications.

### 4. Manager Dashboard (`src/pages/dashboard.jsx`)
- **Path**: `/dashboard`
- **Purpose**: Portal for restaurant managers to track their impact.
- **Key Features**: KPI cards (Total Food Rescued, Active Listings, Waste Logged), forms to post new leftovers, and active listings statuses.

### 5. Waste Log Analytics (`src/pages/wastelog.jsx`)
- **Path**: `/wastelog`
- **Purpose**: Let managers record food waste that couldn't be donated to analyze patterns.
- **Key Features**: Metrics showing financial loss avoided, and history of logged entries.

### 6. Profile & Leaderboard (`src/pages/Leaderboard.jsx`)
- **Path**: `/leaderboard`
- **Purpose**: Gamified leaderboard that ranks top volunteers and top donor restaurants to encourage community engagement.

---

## How to Run locally

Install the packages and run the Vite server:
```bash
npm install
npm run dev
```
The application will run at https://zerowaste-psi-three.vercel.app
