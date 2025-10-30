import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RecipeWithDetails } from '@/types/recipe.types';
import { toast } from 'sonner';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<RecipeWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (recipesError) throw recipesError;

      const recipesWithDetails: RecipeWithDetails[] = await Promise.all(
        (recipesData || []).map(async (recipe) => {
          const { data: ingredients } = await supabase
            .from('recipe_ingredients')
            .select('*')
            .eq('recipe_id', recipe.id)
            .order('sort_order');

          return {
            id: recipe.id,
            user_id: recipe.user_id,
            title: recipe.title,
            image_url: recipe.image_url,
            description: recipe.description,
            servings: recipe.servings,
            prep_time: recipe.prep_time,
            cook_time: recipe.cook_time,
            source_url: recipe.source_url,
            created_at: recipe.created_at,
            updated_at: recipe.updated_at,
            ingredients: ingredients || [],
          } as RecipeWithDetails;
        })
      );

      setRecipes(recipesWithDetails);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load recipes';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const importFromUrl = async (url: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('fetch-spoonacular-recipe', {
        body: { recipeUrl: url },
      });

      if (error) throw error;
      if (!data) throw new Error('No recipe data received');

      const { data: newRecipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description,
          image_url: data.image_url,
          servings: data.servings,
          prep_time: data.prep_time,
          cook_time: data.cook_time,
          source_url: data.source_url,
        })
        .select()
        .single();

      if (recipeError) throw recipeError;

      if (data.ingredients?.length) {
        const { error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .insert(
            data.ingredients.map((ing: any) => ({
              recipe_id: newRecipe.id,
              ...ing,
            }))
          );

        if (ingredientsError) throw ingredientsError;
      }

      toast.success('Recipe imported successfully!');
      await loadRecipes();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to import recipe';
      toast.error(message);
      throw err;
    }
  };

  const deleteRecipe = async (recipeId: string) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId);

      if (error) throw error;

      toast.success('Recipe deleted successfully');
      await loadRecipes();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete recipe';
      toast.error(message);
      throw err;
    }
  };

  const addIngredientsToShoppingList = async (recipeId: string) => {
    try {
      const recipe = recipes.find(r => r.id === recipeId);
      if (!recipe?.ingredients) {
        throw new Error('Recipe not found or has no ingredients');
      }

      // For now, just show success message
      // TODO: Implement shopping list integration when table is created
      toast.success(`${recipe.ingredients.length} ingredients ready to add to shopping list`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add to shopping list';
      toast.error(message);
      throw err;
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  return {
    recipes,
    loading,
    error,
    loadRecipes,
    importFromUrl,
    deleteRecipe,
    addIngredientsToShoppingList,
  };
};
