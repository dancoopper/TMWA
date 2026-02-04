import LogoutButton from "@/features/auth/components/LogoutButton";

export default function DashboardPage() {
    return (
        <div
            className="
            w-full h-screen
            flex flex-col justify-center items-center gap-4"
        >
            <h1>Dashboard Page</h1>
            <LogoutButton />
        </div>
    );
}
