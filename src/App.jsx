import React, { Suspense, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ShiftProvider } from './context/ShiftContext';
import { NotificationProvider, NotificationContext } from './context/NotificationContext';
import { LanguageProvider } from './context/LanguageContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OnboardingModal from './components/OnboardingModal';
import SkeletonCard from './components/SkeletonCard';

/* ── Toast Notifications ───────────────────────────────────── */
const ToastContainer = () => {
  const { notifications } = useContext(NotificationContext);
  const colorMap = {
    error: 'var(--color-danger)',
    success: 'var(--color-success)',
    info: 'var(--color-primary)',
  };
  return (
    <div style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '360px' }}>
      {notifications.map(n => {
        const accent = colorMap[n.type] || colorMap.success;
        return (
          <div key={n.id} className="toast-enter" style={{
            backgroundColor: 'var(--color-bg-card)',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            borderLeft: `4px solid ${accent}`,
            display: 'flex', alignItems: 'flex-start', gap: '10px',
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '2px' }}>
                {n.type === 'error' ? 'Error' : n.type === 'info' ? 'Info' : 'Success'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{n.message}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ── Lazy-Loaded Pages ─────────────────────────────────────── */
const Home            = React.lazy(() => import('./pages/Home'));
const Login           = React.lazy(() => import('./pages/Login'));
const Signup          = React.lazy(() => import('./pages/Signup'));
const DashboardWorker = React.lazy(() => import('./pages/DashboardWorker'));
const DashboardPoster = React.lazy(() => import('./pages/DashboardPoster'));
const PostShift       = React.lazy(() => import('./pages/PostShift'));
const BrowseShifts    = React.lazy(() => import('./pages/BrowseShifts'));
const ShiftDetails    = React.lazy(() => import('./pages/ShiftDetails'));
const Profile         = React.lazy(() => import('./pages/Profile'));
const Payments        = React.lazy(() => import('./pages/Payments'));
const Help            = React.lazy(() => import('./pages/Help'));
const Analytics       = React.lazy(() => import('./pages/Analytics'));
const TalentPool      = React.lazy(() => import('./pages/TalentPool'));
const Referrals       = React.lazy(() => import('./pages/Referrals'));
const Pricing         = React.lazy(() => import('./pages/Pricing'));
const About           = React.lazy(() => import('./pages/About'));
const Disputes        = React.lazy(() => import('./pages/Disputes'));
const NotFound        = React.lazy(() => import('./pages/NotFound'));

/* ── Loading Skeleton ──────────────────────────────────────── */
const LoadingFallback = () => (
  <div className="container section-padding">
    <h1 style={{ marginBottom: '24px', opacity: 0.3 }}>Loading...</h1>
    <div className="grid-3">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
);

/* ── Layout Wrapper ────────────────────────────────────────── */
const AppLayout = () => {
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const hideFooter = isDashboard || isAuthPage;

  return (
    <>
      {/* Dashboard pages have their own navbar inside DashboardLayout */}
      {!isDashboard && <Navbar />}
      <ToastContainer />
      <OnboardingModal />

      <main style={{ minHeight: isDashboard ? 'auto' : 'calc(100vh - 160px)' }}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/"                    element={<Home />}            />
            <Route path="/login"               element={<Login />}           />
            <Route path="/signup"              element={<Signup />}          />
            <Route path="/worker/dashboard"    element={<DashboardWorker />} />
            <Route path="/poster/dashboard"    element={<DashboardPoster />} />
            <Route path="/post-shift"          element={<PostShift />}       />
            <Route path="/browse"              element={<BrowseShifts />}    />
            <Route path="/shift/:id"           element={<ShiftDetails />}    />
            <Route path="/profile"             element={<Profile />}         />
            <Route path="/payments"            element={<Payments />}        />
            <Route path="/help"                element={<Help />}            />
            <Route path="/analytics"           element={<Analytics />}       />
            <Route path="/talent-pool"         element={<TalentPool />}      />
            <Route path="/referrals"           element={<Referrals />}       />
            <Route path="/pricing"             element={<Pricing />}         />
            <Route path="/about"               element={<About />}           />
            <Route path="/disputes"            element={<Disputes />}        />
            <Route path="*"                   element={<NotFound />}         />
          </Routes>
        </Suspense>
      </main>

      {/* Footer hidden on dashboard (has its own) and auth pages */}
      {!hideFooter && <Footer />}
    </>
  );
};

/* ── App Root ──────────────────────────────────────────────── */
function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ShiftProvider>
          <NotificationProvider>
            <Router>
              <AppLayout />
            </Router>
          </NotificationProvider>
        </ShiftProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
