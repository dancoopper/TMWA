import { useState } from "react";
import { useOnboarding } from "@/features/auth/hooks/useOnboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function OnboardingPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    
    const { mutate, isPending } = useOnboarding();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate({ firstName, lastName, timezone });
    };

    return (
        <div className="w-full h-screen flex flex-row justify-center items-center">
            <Card className="w-full max-w-sm mx-auto border-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-2xl">Complete your profile</CardTitle>
                    <CardDescription>
                        Tell us a bit more about yourself to get started
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                placeholder="John"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                placeholder="Doe"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="timezone">Timezone</Label>
                            <Input
                                id="timezone"
                                value={timezone}
                                onChange={(e) => setTimezone(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full mt-4"
                            disabled={isPending}
                        >
                            {isPending ? "Saving..." : "Complete Onboarding"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
