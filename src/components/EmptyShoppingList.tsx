
import { ShoppingBag } from "lucide-react";

const EmptyShoppingList = () => {
  return (
    <div className="text-center py-12">
      <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">Your shopping list is empty</h3>
      <p className="text-muted-foreground mt-2">
        Add items or recipes to your shopping list to see them here
      </p>
    </div>
  );
};

export default EmptyShoppingList;
