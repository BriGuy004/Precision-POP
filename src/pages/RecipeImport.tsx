import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ChefHat, Link as LinkIcon, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Recipe } from "@/types/recipe";

const RecipeImport = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const handleUrlImport = async () => {
    if (!url.trim()) {
      toast.error("Please enter a recipe URL");
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Replace with Spoonacular API call when key is provided
      // For now, simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock recipe data - will be replaced with actual API
      const mockRecipe: Recipe = {
        title: "Spaghetti Carbonara",
        image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800",
        servings: 4,
        ready_in_minutes: 30,
        source_url: url,
        instructions: "1. Cook spaghetti according to package directions.\n2. Fry bacon until crispy.\n3. Mix eggs with parmesan.\n4. Combine all ingredients.\n5. Serve hot.",
        ingredients: [
          { name: "Spaghetti", amount: 1, unit: "lb" },
          { name: "Bacon", amount: 8, unit: "oz" },
          { name: "Eggs", amount: 4, unit: "large" },
          { name: "Parmesan Cheese", amount: 1, unit: "cup" },
          { name: "Black Pepper", amount: 1, unit: "tsp" },
        ]
      };
      
      setRecipe(mockRecipe);
      toast.success("Recipe imported successfully!");
      
    } catch (error: any) {
      console.error("Import error:", error);
      toast.error("Failed to import recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!recipe) return;
    
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to save recipes");
        return;
      }

      // Insert recipe
      const { data: savedRecipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
          title: recipe.title,
          image: recipe.image,
          servings: recipe.servings,
          ready_in_minutes: recipe.ready_in_minutes,
          source_url: recipe.source_url,
          instructions: recipe.instructions
        })
        .select()
        .single();

      if (recipeError) throw recipeError;

      // Insert ingredients
      if (recipe.ingredients && recipe.ingredients.length > 0) {
        const ingredientsToInsert = recipe.ingredients.map((ing, index) => ({
          recipe_id: savedRecipe.id,
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
          sort_order: index
        }));

        const { error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .insert(ingredientsToInsert);

        if (ingredientsError) throw ingredientsError;
      }

      toast.success("Recipe saved to your collection!");
      navigate("/recipes");
      
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error("Failed to save recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <ChefHat className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Recipe Import</h1>
          </div>
          <p className="text-primary-foreground/90">Import recipes from anywhere on the web</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Import Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Import Your Recipe</CardTitle>
            <CardDescription>
              Paste a recipe URL from any website, blog, or social media
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="image" disabled>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Image (Coming Soon)
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="url" className="space-y-4 pt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://www.example.com/recipe"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleUrlImport()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleUrlImport}
                    disabled={isLoading || !url.trim()}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      "Import"
                    )}
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-2">Supported sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {["AllRecipes", "Food Network", "Tasty", "NYT Cooking", "Instagram", "TikTok"].map(source => (
                      <span key={source} className="px-2 py-1 bg-muted rounded text-xs">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="image">
                <div className="text-center py-8 text-muted-foreground">
                  Image upload coming soon! Upload photos of recipes or handwritten cards.
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Recipe Display */}
        {recipe && (
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">{recipe.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4 text-sm">
                    <span>🕐 {recipe.ready_in_minutes} min</span>
                    <span>🍽️ {recipe.servings} servings</span>
                  </CardDescription>
                </div>
                <Button
                  onClick={handleSaveRecipe}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Recipe"
                  )}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Recipe Image */}
              {recipe.image && (
                <img 
                  src={recipe.image} 
                  alt={recipe.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              
              {/* Ingredients */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
                <div className="space-y-2">
                  {recipe.ingredients?.map((ingredient, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                          🥕
                        </div>
                        <span className="font-medium">{ingredient.name}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {ingredient.amount} {ingredient.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Instructions */}
              {recipe.instructions && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Instructions</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground whitespace-pre-line">
                      {recipe.instructions}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Source Link */}
              {recipe.source_url && (
                <div className="pt-4 border-t">
                  <a 
                    href={recipe.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-primary/80 flex items-center gap-2"
                  >
                    <LinkIcon className="w-4 h-4" />
                    View original recipe
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!recipe && !isLoading && (
          <div className="text-center py-12">
            <ChefHat className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No recipe imported yet
            </h3>
            <p className="text-muted-foreground">
              Paste a recipe URL above to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeImport;
