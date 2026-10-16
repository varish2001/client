import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Shell from "./components/Shell";
const LandingPage = lazy(() => import("./pages/LandingPage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const WorkoutPage = lazy(() => import("./pages/WorkoutPage"));
const DietPage = lazy(() => import("./pages/DietPage"));
const PosturePage = lazy(() => import("./pages/PosturePage"));
const HydrationPage = lazy(() => import("./pages/HydrationPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const ChatbotPage = lazy(() => import("./pages/ChatbotPage"));

function HomeRedirect() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return <LandingPage />;
}

function AppRoutes() {
  return (
    <Shell>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/get-started" element={<OnboardingPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout"
            element={
              <ProtectedRoute>
                <WorkoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diet"
            element={
              <ProtectedRoute>
                <DietPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posture"
            element={
              <ProtectedRoute>
                <PosturePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hydration"
            element={
              <ProtectedRoute>
                <HydrationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <ChatbotPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Shell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

function PageLoader() {
  return <div className="rounded-2xl border border-slate/10 bg-white/70 p-6 text-slate">Loading page...</div>;
}
