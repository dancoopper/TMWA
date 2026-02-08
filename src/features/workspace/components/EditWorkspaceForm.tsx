import { useEffect, useState } from "react";
import { useUpdateWorkspace } from "@/features/workspace/hooks/useUpdateWorkspace";
import { type Workspace } from "@/features/workspace/models/Workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EditWorkspaceFormProps {
    workspace: Workspace;
    onSuccess?: () => void;
    children?: React.ReactNode;
}

export default function EditWorkspaceForm({
    workspace,
    onSuccess,
    children,
}: EditWorkspaceFormProps) {
    const [name, setName] = useState(workspace.name);
    const [description, setDescription] = useState(workspace.description || "");

    const { mutate: updateWorkspace, isPending } = useUpdateWorkspace();

    useEffect(() => {
        setName(workspace.name);
        setDescription(workspace.description || "");
    }, [workspace]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateWorkspace(
            {
                id: workspace.id,
                updates: { name, description },
            },
            {
                onSuccess: () => {
                    onSuccess?.();
                },
            },
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. My Awesome Project"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this workspace for?"
                />
            </div>
            <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2">
                    {children}
                </div>
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}
