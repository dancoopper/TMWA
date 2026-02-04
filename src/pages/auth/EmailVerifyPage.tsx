import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function EmailVerifyPage() {
    const { session, loading } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && session) {
            navigate(ROUTES.DASHBOARD);
        }
    }, [session, loading, navigate]);

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md text-center border-none shadow-none">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900/20">
                            <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Check your inbox</CardTitle>
                    <CardDescription className="text-base mt-2">
                        We've sent you a verification link to your email address.
                        Please click the link to activate your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Once verified, you will be automatically redirected to your dashboard.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}