import { useAuthStore } from "@/stores/authStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/config/routes";

export default function ProtectedRoute() {
    const { loading, session, userProfile } = useAuthStore();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    const isUserOnboarded = userProfile?.isOnboarded;
    const isAccessingOnboardingPage = location.pathname === ROUTES.ONBOARDING;

    if (!isUserOnboarded && !isAccessingOnboardingPage) {
        return <Navigate to={ROUTES.ONBOARDING} replace />;
    }

    if (isUserOnboarded && isAccessingOnboardingPage) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return <Outlet />;
}
