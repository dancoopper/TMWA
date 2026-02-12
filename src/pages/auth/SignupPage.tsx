import SignupForm from "@/features/auth/components/SignupForm";

export default function SignupPage() {
    return (
        <div
            className="w-full h-screen flex flex-row justify-center items-center"
            style={{ background: "#f0ead6" }}
        >
            <SignupForm />
        </div>
    );
}
