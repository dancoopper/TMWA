import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SignupPage from "./pages/SignupPage";
import PublicRoute from "./routes/PublicRoute";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuthStore } from "./stores/authStore";
import { useEffect } from "react";
import { Toaster } from "sonner";

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
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                    </Route>

                    {/* Only authenticated users can enter */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                    </Route>

                    {/* Accessible by anyone */}
                    <Route path="/" element={<LandingPage />} />
                </Routes>
            </BrowserRouter>
            <Toaster position="top-center" richColors />
        </QueryClientProvider>
    );
}
