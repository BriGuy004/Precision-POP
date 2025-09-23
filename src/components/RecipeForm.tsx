
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

interface RecipeFormProps {
  onAddRecipe: (name: string, notes: string, ingredients: string[]) => void;
}

const RecipeForm = ({ onAddRecipe }: RecipeFormProps) => {
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newRecipeNotes, setNewRecipeNotes] = useState("");
  const [newRecipeIngredients, setNewRecipeIngredients] = useState("");

  const handleSubmit = () => {
    if (!newRecipeName.trim()) return;
    
    const ingredients = newRecipeIngredients
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    onAddRecipe(newRecipeName, newRecipeNotes, ingredients);
    setNewRecipeName("");
    setNewRecipeNotes("");
    setNewRecipeIngredients("");
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add Recipe to Shopping List</DialogTitle>
        <DialogDescription>
          Save a recipe and its ingredients to your shopping list
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="recipe-name">Recipe Name</Label>
          <Input
            id="recipe-name"
            placeholder="e.g., Spaghetti Bolognese"
            value={newRecipeName}
            onChange={(e) => setNewRecipeName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="recipe-notes">Recipe URL or Notes (optional)</Label>
          <Input
            id="recipe-notes"
            placeholder="https://example.com/recipe"
            value={newRecipeNotes}
            onChange={(e) => setNewRecipeNotes(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="recipe-ingredients">Ingredients (one per line)</Label>
          <Textarea
            id="recipe-ingredients"
            placeholder="1 lb ground beef
1 onion, diced
2 cloves garlic, minced"
            value={newRecipeIngredients}
            onChange={(e) => setNewRecipeIngredients(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Add Recipe</Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default RecipeForm;
