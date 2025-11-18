import { cn } from "@/lib/utils";

interface TabButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

export const TabButton = ({ children, active, onClick }: TabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-lg font-medium transition-colors",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
};
