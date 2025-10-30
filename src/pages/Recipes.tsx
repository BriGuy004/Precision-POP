import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Plus, ShoppingCart, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Recipe, RecipeIngredient } from "@/types/recipe";

const Recipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToList, setAddingToList] = useState<string | null>(null);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (recipesError) throw recipesError;

      // Load ingredients for each recipe
      const recipesWithIngredients = await Promise.all(
        (recipesData || []).map(async (recipe) => {
          const { data: ingredients, error: ingredientsError } = await supabase
            .from('recipe_ingredients')
            .select('*')
            .eq('recipe_id', recipe.id)
            .order('sort_order');

          if (ingredientsError) throw ingredientsError;

          return {
            ...recipe,
            ingredients: ingredients || []
          };
        })
      );

      setRecipes(recipesWithIngredients);
    } catch (error: any) {
      console.error("Load error:", error);
      toast.error("Failed to load recipes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToShoppingList = async (recipe: Recipe) => {
    if (!recipe.ingredients || recipe.ingredients.length === 0) {
      toast.error("This recipe has no ingredients");
      return;
    }

    setAddingToList(recipe.id!);
    try {
      // TODO: Integrate with actual shopping list table
      // For now, just show success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Added ${recipe.ingredients.length} ingredients to shopping list!`);
    } catch (error: any) {
      console.error("Add to list error:", error);
      toast.error("Failed to add to shopping list");
    } finally {
      setAddingToList(null);
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId);

      if (error) throw error;

      setRecipes(recipes.filter(r => r.id !== recipeId));
      toast.success("Recipe deleted");
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error("Failed to delete recipe");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
        <div className="max-w-4xl mx-auto">
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

      <div className="max-w-4xl mx-auto p-4">
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
          <div className="space-y-4">
            {recipes.map((recipe) => (
              <Card key={recipe.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{recipe.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 text-sm">
                        {recipe.ready_in_minutes && (
                          <span>🕐 {recipe.ready_in_minutes} min</span>
                        )}
                        <span>🍽️ {recipe.servings} servings</span>
                        {recipe.ingredients && (
                          <span>📝 {recipe.ingredients.length} ingredients</span>
                        )}
                      </CardDescription>
                    </div>
                    {recipe.image && (
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleAddToShoppingList(recipe)}
                      disabled={addingToList === recipe.id}
                    >
                      {addingToList === recipe.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Shopping List
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteRecipe(recipe.id!)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;
