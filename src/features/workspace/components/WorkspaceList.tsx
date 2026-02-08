const workspaces = [
    { id: "my-workspace", label: "My Workspace", isDefault: true },
    { id: "capstone", label: "Capstone" },
    { id: "family", label: "Family" },
    { id: "work", label: "Work" },
];

export default function WorkspaceList() {
    return (
        <></>
        // {workspaces.map((workspace) => (
        //     <button
        //         key={workspace.id}
        //         className={`
        //             w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md
        //             text-stone-600 hover:text-stone-800 hover:bg-stone-300/50
        //             transition-all duration-200 text-xs
        //             ${leftSidebarCollapsed ? "justify-center" : ""}
        //         `}
        //     >
        //         <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${workspace.isDefault ? "bg-sky-500" : "bg-stone-500"}`} />
        //         {!leftSidebarCollapsed && (
        //             <span>{workspace.label}</span>
        //         )}
        //     </button>
        // ))}
    );
}
