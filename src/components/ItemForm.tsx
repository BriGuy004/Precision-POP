
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface ItemFormProps {
  onAddItem: (name: string, notes: string) => void;
}

const ItemForm = ({ onAddItem }: ItemFormProps) => {
  const [newItemName, setNewItemName] = useState("");
  const [newItemNotes, setNewItemNotes] = useState("");

  const handleSubmit = () => {
    if (!newItemName.trim()) return;
    onAddItem(newItemName, newItemNotes);
    setNewItemName("");
    setNewItemNotes("");
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Item to Shopping List</DialogTitle>
        <DialogDescription>
          Add a specific item to your shopping list
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="item-name">Item Name</Label>
          <Input
            id="item-name"
            placeholder="e.g., Milk, Bread, Eggs"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="item-notes">Notes (optional)</Label>
          <Textarea
            id="item-notes"
            placeholder="Any specifics about the item"
            value={newItemNotes}
            onChange={(e) => setNewItemNotes(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Add to List</Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default ItemForm;
