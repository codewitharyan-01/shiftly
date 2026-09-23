# Shiftly

Shiftly is a minimalist, Apple-inspired web application designed to connect blue-collar workers with local shifts instantly. It solves core problems like fake posters, no-shows, and payment delays through verification badges, rating systems, and instant UPI payouts.

## Tech Stack
- **Frontend**: React (Vite)
- **Styling**: Vanilla CSS (CSS Variables for tokens, dark mode ready)
- **Icons**: `lucide-react`
- **Routing**: `react-router-dom`
- **State Management**: React Context API (`AuthContext`, `ShiftContext`)

## Setup Instructions

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser (usually `http://localhost:5173`).

## Investor Demo Flow

Follow this script to demonstrate the core value proposition of Shiftly:

### 1. Landing & Analytics (The Hook)
- **Action**: Open the app homepage.
- **Talking Point**: "Shiftly is designed for speed and trust. Notice the premium, Apple-inspired UI."
- **Background**: Open the browser console to show the mock Analytics hook firing (`[Analytics] 📊 Page View: Home`).

### 2. Worker Experience & Onboarding
- **Action**: Click "Find Work" or "Signup" to create a Worker account.
- **Talking Point**: "First-time users get a quick, visual 3-step walkthrough to understand the platform."
- **Action**: Complete the Onboarding Modal.
- **Action**: Navigate to the `Browse` tab.
- **Talking Point**: "We've pre-populated the app with 20 mock shifts across Ahmedabad. Notice the skeleton loading states ensuring a smooth perceived performance."

### 3. Application & Trust
- **Action**: Click on a shift (e.g., "Warehouse Packer").
- **Talking Point**: "Workers see exact requirements. They also see the Poster's rating, Verification Badge, and can even blacklist bad actors. This builds immense trust."
- **Action**: Click "Apply Now".

### 4. Poster Experience & Fulfillment
- **Action**: Log out, and log back in as a Poster (or create a new Poster account).
- **Action**: Go to `Manage Shifts`.
- **Talking Point**: "Posters see all applicants along with their Reliability Scores."
- **Action**: Accept the worker.

### 5. Payments (Solving the Delay)
- **Action**: Go to the `Payments` tab in the Poster Dashboard.
- **Talking Point**: "Posters pre-fund their wallet. When a shift completes, workers are paid instantly via UPI. No more 30-day waits."

## Mock Architecture Notes
- **Data**: All data is mocked in memory via Context APIs and seeded dynamically by `generateDemoData.js`.
- **PWA**: The app is PWA-ready with a `manifest.json` and boilerplate Service Worker (commented out in `main.jsx`).
- **SEO/Analytics**: Pages use custom `useSEO` and `useAnalytics` hooks for demo tracking.
