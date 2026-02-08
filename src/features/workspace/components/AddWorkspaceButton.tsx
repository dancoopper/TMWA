import { Plus } from "lucide-react";
import CreateWorkspaceModal from "./CreateWorkspaceModal";

export default function AddWorkspaceButton() {
    return (
        <CreateWorkspaceModal>
            <button className="p-1.5 rounded-md 
            text-stone-500 hover:bg-stone-500 hover:text-white 
            active:translate-y-0.5 transition-all duration-200 cursor-pointer">
                <Plus className="w-3.5 h-3.5 shrink-0" />
            </button>
        </CreateWorkspaceModal>
    );
}
