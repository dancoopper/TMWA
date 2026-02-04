import { useAuthStore } from "@/stores/authStore";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/config/routes";

export default function PublicRoute() {
    const { loading, session } = useAuthStore();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (session) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return <Outlet />;
}
