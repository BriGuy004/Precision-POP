
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { tastyService, TastyRecipe } from "@/services/TastyService";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface RecipeSearchProps {
  onRecipeSelect: (recipe: {
    name: string;
    notes?: string;
    ingredients: string[];
  }) => void;
}

const RecipeSearch = ({ onRecipeSelect }: RecipeSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<TastyRecipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<TastyRecipe | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await tastyService.searchRecipes(searchQuery);
      setSearchResults(results);
    } catch (error) {
      toast.error("Failed to search recipes");
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRecipeSelect = (recipe: TastyRecipe) => {
    setSelectedRecipe(recipe);
  };

  const handleAddRecipe = () => {
    if (!selectedRecipe) return;
    
    const ingredientsList = selectedRecipe.ingredients.map(
      ing => `${ing.quantity ? ing.quantity + ' ' : ''}${ing.unit ? ing.unit + ' ' : ''}${ing.name}`
    );
    
    onRecipeSelect({
      name: selectedRecipe.name,
      notes: selectedRecipe.url,
      ingredients: ingredientsList,
    });
    
    toast.success("Recipe added to shopping list");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-1">
          <Search className="w-4 h-4" />
          <span>Find Recipe</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search Recipes</DialogTitle>
          <DialogDescription>
            Search for recipes from Tasty and add them to your shopping list
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for recipes..."
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto">
              {searchResults.map((recipe) => (
                <Card
                  key={recipe.id}
                  className={`p-3 cursor-pointer transition-colors ${
                    selectedRecipe?.id === recipe.id
                      ? "border-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() => handleRecipeSelect(recipe)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{recipe.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {recipe.description}
                      </p>
                    </div>
                    {selectedRecipe?.id === recipe.id && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddRecipe();
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {searchResults.length === 0 && searchQuery && !isSearching && (
            <p className="text-center text-muted-foreground py-4">
              No recipes found. Try another search term.
            </p>
          )}

          {selectedRecipe && (
            <div className="mt-4 border-t pt-4">
              <h3 className="font-medium">{selectedRecipe.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {selectedRecipe.description}
              </p>
              <h4 className="text-sm font-medium mt-2">Ingredients:</h4>
              <ul className="text-sm space-y-1 mt-1">
                {selectedRecipe.ingredients.map((ing, i) => (
                  <li key={i}>
                    {ing.quantity && `${ing.quantity} `}
                    {ing.unit && `${ing.unit} `}
                    {ing.name}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-end">
                <DialogClose asChild>
                  <Button onClick={handleAddRecipe}>
                    Add to Shopping List
                  </Button>
                </DialogClose>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeSearch;
