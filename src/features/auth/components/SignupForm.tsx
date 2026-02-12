import { useState, useRef, useEffect } from "react";
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
import { ROUTES } from "@/config/routes";
import { Eye, EyeOff } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Monkey Avatar (inline SVG, compact)                                */
/* ------------------------------------------------------------------ */
function MonkeyAvatar({
    eyeX,
    eyeY,
    mouthOpen,
    covering,
}: {
    eyeX: number;
    eyeY: number;
    mouthOpen: "small" | "medium" | "large";
    covering: boolean;
}) {
    const eyeSquint =
        mouthOpen === "large"
            ? "scale(.65)"
            : mouthOpen === "medium"
                ? "scale(.85)"
                : "scale(1)";

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 200 200"
            style={{ width: "100%", height: "100%", display: "block" }}
        >
            <defs>
                <circle id="armMaskPath" cx="100" cy="100" r="100" />
            </defs>
            <clipPath id="armMask">
                <use xlinkHref="#armMaskPath" overflow="visible" />
            </clipPath>

            {/* background */}
            <circle cx="100" cy="100" r="100" fill="#a9ddf3" />

            {/* body */}
            <g>
                <path fill="#FFF" d="M193.3,135.9c-5.8-8.4-15.5-13.9-26.5-13.9H151V72c0-27.6-22.4-50-50-50S51,44.4,51,72v50H32.1c-10.6,0-20,5.1-25.8,13l0,78h187L193.3,135.9z" />
                <path fill="none" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" d="M193.3,135.9c-5.8-8.4-15.5-13.9-26.5-13.9H151V72c0-27.6-22.4-50-50-50S51,44.4,51,72v50H32.1c-10.6,0-20,5.1-25.8,13" />
                <path fill="#DDF1FA" d="M100,156.4c-22.9,0-43,11.1-54.1,27.7c15.6,10,34.2,15.9,54.1,15.9s38.5-5.8,54.1-15.9C143,167.5,122.9,156.4,100,156.4z" />
            </g>

            {/* ears */}
            <g>
                <circle cx="47" cy="83" r="11.5" fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5" />
                <circle cx="155" cy="83" r="11.5" fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5" />
            </g>

            {/* face */}
            <path fill="#DDF1FA" d="M134.5,46v35.5c0,21.815-15.446,39.5-34.5,39.5s-34.5-17.685-34.5-39.5V46"
                style={{ transform: `translate(${-eyeX * 0.3}px, ${-eyeY * 0.4}px)`, transition: "transform .6s cubic-bezier(.19,1,.22,1)" }} />

            {/* hair */}
            <path fill="#FFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M81.457,27.929c1.755-4.084,5.51-8.262,11.253-11.77c0.979,2.565,1.883,5.14,2.712,7.723c3.162-4.265,8.626-8.27,16.272-11.235c-0.737,3.293-1.588,6.573-2.554,9.837c4.857-2.116,11.049-3.64,18.428-4.156c-2.403,3.23-5.021,6.391-7.852,9.474" />

            {/* eyebrows */}
            <g style={{ transform: `translate(${-eyeX * 0.3}px, ${-eyeY * 0.4}px)`, transition: "transform .6s cubic-bezier(.19,1,.22,1)" }}>
                <path fill="#FFF" d="M138.142,55.064c-4.93,1.259-9.874,2.118-14.787,2.599c-0.336,3.341-0.776,6.689-1.322,10.037c-4.569-1.465-8.909-3.222-12.996-5.226c-0.98,3.075-2.07,6.137-3.267,9.179c-5.514-3.067-10.559-6.545-15.097-10.329c-1.806,2.889-3.745,5.73-5.816,8.515c-7.916-4.124-15.053-9.114-21.296-14.738l1.107-11.768h73.475V55.064z" />
                <path fill="#FFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M63.56,55.102c6.243,5.624,13.38,10.614,21.296,14.738c2.071-2.785,4.01-5.626,5.816-8.515c4.537,3.785,9.583,7.263,15.097,10.329c1.197-3.043,2.287-6.104,3.267-9.179c4.087,2.004,8.427,3.761,12.996,5.226c0.545-3.348,0.986-6.696,1.322-10.037c4.913-0.481,9.857-1.34,14.787-2.599" />
            </g>

            {/* left eye */}
            <g style={{ transformOrigin: "85.5px 78.5px", transform: `translate(${-eyeX}px, ${-eyeY}px) ${eyeSquint}`, transition: "transform .5s cubic-bezier(.19,1,.22,1)" }}>
                <circle cx="85.5" cy="78.5" r="3.5" fill="#3a5e77" />
                <circle cx="84" cy="76" r="1" fill="#fff" />
            </g>

            {/* right eye */}
            <g style={{ transformOrigin: "114.5px 78.5px", transform: `translate(${-eyeX}px, ${-eyeY}px) ${eyeSquint}`, transition: "transform .5s cubic-bezier(.19,1,.22,1)" }}>
                <circle cx="114.5" cy="78.5" r="3.5" fill="#3a5e77" />
                <circle cx="113" cy="76" r="1" fill="#fff" />
            </g>

            {/* mouth */}
            <g style={{ transform: `translate(${-eyeX * 0.5}px, ${-eyeY * 0.5}px)`, transition: "transform .6s cubic-bezier(.19,1,.22,1)" }}>
                <path fill="#617E92" d={
                    mouthOpen === "large"
                        ? "M100 110.2c-9 0-16.2-7.3-16.2-16.2 0-2.3 1.9-4.2 4.2-4.2h24c2.3 0 4.2 1.9 4.2 4.2 0 9-7.2 16.2-16.2 16.2z"
                        : mouthOpen === "medium"
                            ? "M95,104.2c-4.5,0-8.2-3.7-8.2-8.2v-2c0-1.2,1-2.2,2.2-2.2h22c1.2,0,2.2,1,2.2,2.2v2c0,4.5-3.7,8.2-8.2,8.2H95z"
                            : "M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"
                } style={{ transition: "d .5s" }} />
                {mouthOpen !== "small" && (
                    <circle cx="100" cy={mouthOpen === "large" ? "107" : "103"} r={mouthOpen === "large" ? "8" : "5"} fill="#cc4a6c" style={{ transition: "all .5s" }} />
                )}
                {mouthOpen !== "small" && (
                    <path fill="#FFF" d="M106,97h-4c-1.1,0-2-0.9-2-2v-2h8v2C108,96.1,107.1,97,106,97z" />
                )}
            </g>

            {/* nose */}
            <path d="M97.7 79.9h4.7c1.9 0 3 2.2 1.9 3.7l-2.3 3.3c-.9 1.3-2.9 1.3-3.8 0l-2.3-3.3c-1.3-1.6-.2-3.7 1.8-3.7z" fill="#3a5e77"
                style={{ transform: `translate(${-eyeX * 0.6}px, ${-eyeY * 0.5}px)`, transition: "transform .6s cubic-bezier(.19,1,.22,1)" }} />

            {/* arms */}
            <g clipPath="url(#armMask)">
                {/* left arm */}
                <g style={{
                    transform: covering
                        ? "translate(-93px, 2px)"
                        : "translate(-93px, 300px)",
                    transition: "transform .45s cubic-bezier(.42,0,.58,1)",
                }}>
                    <path fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M121.3 97.4L111 58.7l38.8-10.4 20 36.1z" />
                    <path fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M134.4 52.5l19.3-5.2c2.7-.7 5.4.9 6.1 3.5.7 2.7-.9 5.4-3.5 6.1L146 59.7M160.8 76.5l19.4-5.2c2.7-.7 5.4.9 6.1 3.5.7 2.7-.9 5.4-3.5 6.1l-18.3 4.9M158.3 66.8l23.1-6.2c2.7-.7 5.4.9 6.1 3.5.7 2.7-.9 5.4-3.5 6.1l-23.1 6.2M150.9 58.4l26-7c2.7-.7 5.4.9 6.1 3.5.7 2.7-.9 5.4-3.5 6.1l-21.3 5.7" />
                    <path fill="#fff" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M123.5 96.8c-41.4 14.9-84.1 30.7-108.2 35.5L1.2 80c33.5-9.9 71.9-16.5 111.9-21.8" />
                </g>

                {/* right arm */}
                <g style={{
                    transform: covering
                        ? "translate(-93px, 2px)"
                        : "translate(-93px, 300px)",
                    transition: "transform .45s cubic-bezier(.42,0,.58,1)",
                    transitionDelay: covering ? ".1s" : "0s",
                }}>
                    <path fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M265.4 97.3l10.4-38.6-38.9-10.5-20 36.1z" />
                    <path fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M252.4 52.4L233 47.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l10.3 2.8M226 76.4l-19.4-5.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l18.3 4.9M228.4 66.7l-23.1-6.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l23.1 6.2M235.8 58.3l-26-7c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l21.3 5.7" />
                    <path fill="#fff" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M263.3 96.7c41.4 14.9 84.1 30.7 108.2 35.5l14-52.3C352 70 313.6 63.5 273.6 58.1" />
                </g>
            </g>
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/*  Signup Form with Monkey Avatar                                     */
/* ------------------------------------------------------------------ */
export default function SignupForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [eyeX, setEyeX] = useState(0);
    const [eyeY, setEyeY] = useState(0);
    const [mouthOpen, setMouthOpen] = useState<"small" | "medium" | "large">("small");
    const emailRef = useRef<HTMLInputElement>(null);
    const avatarRef = useRef<HTMLDivElement>(null);
    const { mutate, isPending } = useSignup();

    // Track eyes based on email length — moves left to right as user types
    useEffect(() => {
        if (!emailFocused) {
            setEyeX(0);
            setEyeY(0);
            return;
        }
        // Map email length 0→30+ to eye position -18→18
        const maxChars = 30;
        const len = Math.min(email.length, maxChars);
        const normalized = (len / maxChars) * 2 - 1; // -1 to 1
        setEyeX(normalized * -18);
        setEyeY(5); // look slightly down toward the input
    }, [email, emailFocused]);

    // Mouth reacts to email content
    useEffect(() => {
        if (email.length === 0) setMouthOpen("small");
        else if (email.includes("@")) setMouthOpen("large");
        else setMouthOpen("medium");
    }, [email]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate({ email, password });
    };

    const covering = passwordFocused && !showPassword;

    return (
        <Card className="w-full max-w-sm mx-auto border-none shadow-none" style={{ background: "transparent" }}>
            <CardHeader>
                <CardTitle className="text-2xl">Create an Account</CardTitle>
                <CardDescription>
                    Enter your email below to create your account
                </CardDescription>
            </CardHeader>

            {/* Monkey avatar */}
            <div className="flex justify-center px-6">
                <div
                    ref={avatarRef}
                    style={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        border: "2.5px solid #3A5E77",
                        overflow: "hidden",
                        pointerEvents: "none",
                    }}
                >
                    <MonkeyAvatar
                        eyeX={eyeX}
                        eyeY={eyeY}
                        mouthOpen={mouthOpen}
                        covering={covering}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            ref={emailRef}
                            id="email"
                            type="email"
                            placeholder="example@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => { setPasswordFocused(false); setEmailFocused(true); }}
                            onBlur={() => setEmailFocused(false)}
                            required
                            style={{ background: "rgba(180, 180, 180, 0.5)" }}
                        />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                                required
                                className="pr-10"
                                style={{ background: "rgba(180, 180, 180, 0.5)" }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
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
                            to={ROUTES.LOGIN}
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
