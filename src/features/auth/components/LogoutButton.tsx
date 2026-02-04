import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/useLogout";

interface LogoutButtonProps {
    className?: string;
}

export default function LogoutButton({
    className,
}: LogoutButtonProps) {
    const { mutate, isPending } = useLogout();

    const handleLogout = () => {
        mutate();
    };

    return (
        <Button
            variant="destructive"
            size="sm"
            className={`w-full ${className}`}
            onClick={handleLogout}
            disabled={isPending}
        >
            {isPending ? "Logging out..." : "Logout"}
        </Button>
    );
}