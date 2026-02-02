import { useState } from "react";
import { useSignup } from "@/features/auth/hooks/useSignup";
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
import { Link } from "react-router-dom";

export default function SignupForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { mutate, isPending } = useSignup();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate({ email, password });
    };

    return (
        <Card className="w-full max-w-sm mx-auto border-none shadow-none">
            <CardHeader>
                <CardTitle className="text-2xl">Create an Account</CardTitle>
                <CardDescription>
                    Enter your email below to create your account
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col items-center justify-between space-y-2">
                    <Button
                        type="submit"
                        className="w-full mt-4"
                        disabled={isPending}
                    >
                        {isPending ? "Creating Account..." : "Sign Up"}
                    </Button>
                    <p>
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-blue-500 hover:underline"
                        >
                            Log in
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
