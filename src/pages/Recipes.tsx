import { RecipeCard } from "@/components/RecipeCard";
import { useRecipes } from "@/hooks/useRecipes";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, ChefHat } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Recipes = () => {
  const navigate = useNavigate();
  const { recipes, loading, deleteRecipe, addIngredientsToShoppingList } = useRecipes();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <ChefHat className="w-8 h-8" />
              <h1 className="text-3xl font-bold">My Recipes</h1>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate("/recipes/import")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
          <p className="text-primary-foreground/90">
            Your saved recipes, ready to cook
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No recipes yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by importing your first recipe
            </p>
            <Button onClick={() => navigate("/recipes/import")}>
              <Plus className="w-4 h-4 mr-2" />
              Import Recipe
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onAddToShoppingList={addIngredientsToShoppingList}
                onDelete={deleteRecipe}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;
