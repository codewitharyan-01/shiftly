# ⚡ Shiftly

**Shiftly** is a modern, full-featured **gig-work marketplace** built for Ahmedabad, Gujarat. It connects businesses that need flexible, on-demand workers with people looking for short-term shifts — all in under 2 minutes.

> 🚀 Built with React 19 + Vite + Framer Motion. Designed to be fast, beautiful, and mobile-first.

---

## ✨ Features

### For Workers 👷
- **Browse & Apply** — Find nearby shifts filtered by category, location, pay, and date
- **Real-time Dashboard** — Track applications, earnings, and work history
- **Earnings Analytics** — Weekly bar charts, total earnings, and per-shift breakdowns
- **Profile & Verification** — Upload Aadhaar/ID for a verified badge that boosts acceptance rates
- **Availability Scheduler** — Set preferred days and time slots
- **In-App Messaging** — Chat directly with shift posters

### For Businesses (Posters) 🏢
- **Post a Shift** — Create detailed shift listings in seconds using quick templates
- **Urgent Mode** 🔥 — Boost visibility for time-sensitive shifts
- **Applicant Management** — Review, accept, or reject applicants with a single click
- **Payments & Wallet** — Add funds via UPI; auto-deducted after shifts fill
- **Analytics Dashboard** — Track spending, fill rates, and worker performance
- **Talent Pool** — Browse verified workers and invite them directly
- **Referral Program** — Share codes and earn credits
- **Dispute Resolution** — Built-in process to handle shift disputes

### Platform-Wide 🌐
- **Dark Mode** 🌙 — Toggle between light and dark themes; preference saved automatically
- **Framer Motion Animations** — Smooth, fluid page transitions and micro-interactions
- **Glassmorphism UI** — Premium frosted-glass card and modal designs
- **Fully Responsive** — Mobile-first layout with a bottom navigation bar on small screens
- **SEO Optimised** — Dynamic `<title>` and `<meta>` tags on every page

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI Framework |
| **Vite 8** | Build tool & dev server |
| **React Router v7** | Client-side routing |
| **Framer Motion 13** | Animations & page transitions |
| **Lucide React** | Icon library |
| **Vanilla CSS** | Styling — CSS variables, glassmorphism, responsive grid |

---

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── DashboardLayout.jsx   # Main layout with sidebar & mobile nav
│   ├── Button.jsx
│   ├── Modal.jsx
│   ├── ShiftCard.jsx
│   ├── Messages.jsx
│   └── ...
├── context/            # Global state via React Context
│   ├── AuthContext.jsx       # User auth, login, signup, profile
│   ├── ShiftContext.jsx      # Shifts, applications, earnings
│   └── NotificationContext.jsx
├── pages/              # Route-level page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── DashboardWorker.jsx   # Full worker dashboard (tabs: Home, Browse, Applications, Earnings, Profile)
│   ├── DashboardPoster.jsx   # Full poster dashboard (tabs: Home, Post, Manage, Analytics, Payments, ...)
│   ├── Profile.jsx
│   ├── BrowseShifts.jsx
│   ├── ShiftDetails.jsx
│   ├── Analytics.jsx
│   ├── Payments.jsx
│   ├── TalentPool.jsx
│   ├── Referrals.jsx
│   ├── Disputes.jsx
│   └── ...
├── utils/              # Helper hooks and mock data
│   ├── mockData.js
│   └── useSEO.js
├── index.css           # Global design system (CSS variables, dark mode, utilities)
└── App.jsx             # Root router
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 18`
- npm `>= 9`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/codewitharyan-01/shiftly.git
cd shiftly

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app will be running at **http://localhost:5173**

### Demo Accounts

Use the quick-fill buttons on the login page, or enter manually:

| Role | Email | Password |
|------|-------|----------|
| **Worker** | `worker@shiftly.in` | `demo` |
| **Poster (Business)** | `test@gmail.com` | `test@123` |

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint with OxLint |

---

## 🎨 Design System

Shiftly uses a custom CSS design system built entirely with CSS variables, allowing seamless light/dark mode switching:

- **Colors** — Primary blue (`#007AFF`), Success green (`#34C759`), Danger red (`#FF3B30`)
- **Typography** — [Inter](https://fonts.google.com/specimen/Inter) (via Google Fonts)
- **Spacing & Radius** — Consistent scale via `--radius-sm/md/lg/xl`
- **Glassmorphism** — `.glass-card` with `backdrop-filter: blur()`
- **Animations** — `.hover-lift`, `.hover-scale`, `.stagger-fade-in`, Framer Motion `motion.div`
- **Dark Mode** — Applied via `[data-theme="dark"]` on `<html>`, toggled from the dashboard header

---

## 📸 Screenshots

| Home Page | Worker Dashboard | Poster Dashboard |
|-----------|-----------------|-----------------|
| Landing with hero, stats, featured shifts, and testimonials | Tab-based dashboard with earnings charts, applications, and profile | Post shifts, manage applicants, view analytics, and handle payments |

---

## 🗺 Roadmap

- [ ] Real backend (Node.js / Firebase)
- [ ] OTP-based phone authentication
- [ ] Live in-app chat with Socket.io
- [ ] Push notifications (PWA)
- [ ] Full Hindi & Gujarati translations
- [ ] Worker GPS check-in/check-out
- [ ] Razorpay / UPI payment integration

---

## 👤 Author

**Aryan** — [GitHub @codewitharyan-01](https://github.com/codewitharyan-01)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
