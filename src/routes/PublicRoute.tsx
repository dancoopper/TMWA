import { useAuthStore } from "@/stores/authStore";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
    const { loading, session } = useAuthStore();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (session) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
