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

    if (!userProfile?.isOnboarded) {
        return <Navigate to={ROUTES.ONBOARDING} replace />;
    }

    return <Outlet />;
}
