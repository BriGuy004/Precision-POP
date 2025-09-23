
import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-4 animate-fade-in">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-lg font-medium text-muted-foreground">Loading...</p>
    </div>
  );
};

export default LoadingScreen;
