import { useState } from "react";
import { useLogin } from "@/features/auth/hooks/useLogin";
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
import { ROUTES } from "@/config/routes";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { mutate, isPending } = useLogin();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await mutate({
                email,
                password,
            });
        } catch (error) {
            console.error(error);
        }
    };
    return <Card className="w-full max-w-sm mx-auto border-none shadow-none">
        <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
                Enter your email and password below to login
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
                        placeholder="example@example.com"
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
                    {isPending ? "Logging In..." : "Log In"}
                </Button>
                <p>
                    Don't have an account?{" "}
                    <Link
                        to={ROUTES.SIGNUP}
                        className="text-blue-500 hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </CardFooter>
        </form>
    </Card>
}
