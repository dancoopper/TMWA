import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import LogoutButton from "@/features/auth/components/LogoutButton";

export default function SettingsPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => navigate(ROUTES.DASHBOARD)}
                    className="mb-6 gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Button>

                <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

                <div className="space-y-6">
                    <div className="p-6 bg-card border border-border rounded-lg">
                        <h2 className="text-lg font-semibold text-foreground mb-2">
                            Account Settings
                        </h2>
                        <LogoutButton />
                    </div>

                    <div className="p-6 bg-card border border-border rounded-lg">
                        <h2 className="text-lg font-semibold text-foreground mb-2">
                            Preferences
                        </h2>
                        <p className="text-muted-foreground">
                            Coming soon...
                        </p>
                    </div>

                    <div className="p-6 bg-card border border-border rounded-lg">
                        <h2 className="text-lg font-semibold text-foreground mb-2">
                            Notifications
                        </h2>
                        <p className="text-muted-foreground">
                            Coming soon...
                        </p>
                    </div>


                </div>
            </div>
        </div>
    );
}
