import { FolderOpen } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="bg-primary-light h-16 w-16 rounded-full flex items-center justify-center mb-4">
        <FolderOpen size={28} />
      </div>

      <h2 className="text-xl font-semibold mb-2">
        No Workspace Selected
      </h2>

      <p className="text-text-secondary text-sm max-w-sm">
        Please select a workspace from the dropdown above or create a new one to begin.
      </p>
    </div>
  );
};

export default EmptyState