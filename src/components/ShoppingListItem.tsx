
import { ShoppingBag, ChefHat, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface ListItem {
  id: string;
  type: 'item' | 'recipe';
  name: string;
  notes?: string;
  ingredients?: string[];
  addedAt: Date;
}

interface ShoppingListItemProps {
  item: ListItem;
  onRemove: (id: string) => void;
}

const ShoppingListItem = ({ item, onRemove }: ShoppingListItemProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {item.type === 'recipe' ? (
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          )}
          {item.name}
        </div>
        {item.type === 'recipe' && item.ingredients && (
          <ul className="mt-2 text-sm text-muted-foreground list-disc pl-8">
            {item.ingredients.map((ingredient, i) => (
              <li key={i}>{ingredient}</li>
            ))}
          </ul>
        )}
      </TableCell>
      <TableCell>
        {item.notes && (
          <div className="text-sm text-muted-foreground">
            {item.notes.startsWith('http') ? (
              <a 
                href={item.notes} 
                target="_blank" 
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                {item.notes}
              </a>
            ) : (
              item.notes
            )}
          </div>
        )}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ShoppingListItem;
