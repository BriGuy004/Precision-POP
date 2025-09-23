
import React from "react";
import { Button } from "@/components/ui/button";
import { CornerUpLeft } from "lucide-react";

interface RecoverButtonProps {
  onRecover: () => void;
}

export const RecoverButton: React.FC<RecoverButtonProps> = ({ onRecover }) => {
  return (
    <div className="absolute left-4 bottom-28 z-10">
      <Button
        onClick={onRecover}
        size="icon"
        className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xl transition-all"
        title="Recover last discarded coupon"
      >
        <CornerUpLeft className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default RecoverButton;
