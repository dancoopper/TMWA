import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SignupPage from "./pages/auth/SignupPage";
import OnboardingPage from "./pages/auth/OnboardingPage";
import PublicRoute from "./routes/PublicRoute";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuthStore } from "./stores/authStore";
import { useEffect } from "react";
import { Toaster } from "sonner";
import EmailVerifyPage from "./pages/auth/EmailVerifyPage";
import { ROUTES } from "@/config/routes";

const queryClient = new QueryClient();

export default function App() {
    const initialize = useAuthStore((state) => state.initialize);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        // Enable caching and allow useMutation
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    {/* Only unauthenticated users can enter */}
                    <Route element={<PublicRoute />}>
                        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
                        <Route path={ROUTES.VERIFY_EMAIL} element={<EmailVerifyPage />} />
                    </Route>

                    {/* Only authenticated users can enter */}
                    <Route element={<ProtectedRoute />}>
                        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                        <Route path={ROUTES.ONBOARDING} element={<OnboardingPage />} />
                    </Route>

                    {/* Accessible by anyone */}
                    <Route path={ROUTES.HOME} element={<LandingPage />} />
                </Routes>
            </BrowserRouter>
            <Toaster position="top-center" richColors />
        </QueryClientProvider>
    );
}
