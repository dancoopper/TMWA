import { useAuthStore } from "@/stores/authStore";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ROUTES } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LandingPage() {
    const { session, loading } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            const error = params.get("error");
            const errorDescription = params.get("error_description");

            if (error && errorDescription) {
                toast.error(errorDescription.replace(/\+/g, " "))
                window.history.replaceState(null, "", window.location.pathname);
            }
        }
    }, []);

    useEffect(() => {
        if (!loading && session) {
            navigate(ROUTES.DASHBOARD);
        }
    }, [session, loading, navigate]);

    if (loading) return null;

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <h1 className="text-4xl font-bold">Time Management Web App</h1>
            <p>Master your time, master your life.</p>
            <div className="flex gap-4">
                <Button asChild>
                    <Link to={ROUTES.LOGIN}>Login</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link to={ROUTES.SIGNUP}>Sign Up</Link>
                </Button>
            </div>
        </div>
    );
}
