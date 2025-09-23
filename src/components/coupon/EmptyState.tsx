
import React from "react";

interface EmptyStateProps {
  isLoading?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ isLoading = false }) => {
  return (
    <div className="text-center glass-card p-4 rounded-xl shadow-xl shadow-black/30 dark:shadow-black/50 backdrop-blur-sm">
      {isLoading ? (
        <>
          <h3 className="text-base font-medium mb-1">Loading Personalized Coupons</h3>
          <p className="text-muted-foreground text-sm">Finding deals based on your shopping history...</p>
        </>
      ) : (
        <>
          <h3 className="text-base font-medium mb-1">No More Coupons</h3>
          <p className="text-muted-foreground text-sm">Check back later for new deals!</p>
        </>
      )}
    </div>
  );
};

export default EmptyState;
