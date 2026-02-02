import { useAuthStore } from "@/stores/authStore";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const { loading, session } = useAuthStore();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
