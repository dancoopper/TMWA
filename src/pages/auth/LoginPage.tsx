import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
    return <div
        className="
            w-full h-screen
            flex flex-row justify-center items-center"
        style={{ background: "#f0ead6" }}
    >
        <LoginForm />
    </div>
}
