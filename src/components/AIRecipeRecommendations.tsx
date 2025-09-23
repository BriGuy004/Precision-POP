
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Clock, Plus, CircleAlert, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { aiRecommendationService } from '@/services/AIRecommendationService';
import { toast } from 'sonner';

interface AIRecipeRecommendationsProps {
  userId?: string;
  onRecipeSelect?: (recipe: { name: string; ingredients: string[] }) => void;
  currentItems?: string[];
}

const AIRecipeRecommendations = ({ 
  userId = 'user123', 
  onRecipeSelect,
  currentItems = []
}: AIRecipeRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  
  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      try {
        const recipeRecommendations = await aiRecommendationService.getRecipeRecommendations(
          userId, 
          currentItems
        );
        setRecommendations(recipeRecommendations);
      } catch (error) {
        console.error('Error loading recipe recommendations:', error);
        toast.error('Failed to load recipe recommendations');
      } finally {
        setLoading(false);
      }
    };
    
    loadRecommendations();
  }, [userId, currentItems.join(',')]);
  
  const handleSelectRecipe = (recipeId: string) => {
    setSelectedRecipe(recipeId === selectedRecipe ? null : recipeId);
  };
  
  const handleAddRecipe = (recipe: any) => {
    if (onRecipeSelect) {
      onRecipeSelect({
        name: recipe.name,
        ingredients: recipe.ingredients
      });
      toast.success(`Added ${recipe.name} ingredients to your shopping list`);
    }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-50 text-green-700';
      case 'medium': return 'bg-yellow-50 text-yellow-700';
      case 'hard': return 'bg-red-50 text-red-700';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-primary" />
          AI Recipe Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-20 w-20 rounded-md" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((recipe) => (
              <motion.div 
                key={recipe.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div 
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-colors ${
                    selectedRecipe === recipe.id ? 'border-primary bg-primary/5' : 'hover:bg-accent/50'
                  }`}
                  onClick={() => handleSelectRecipe(recipe.id)}
                >
                  <div className="flex">
                    <div className="relative w-24 h-24">
                      <img 
                        src={recipe.imageUrl} 
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1 flex items-center gap-1 bg-black/70 rounded-full py-0.5 px-1.5">
                        <Sparkles className="h-3 w-3 text-yellow-400" />
                        <span className="text-white text-xs font-medium">
                          {Math.round(recipe.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="p-3 flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-sm">{recipe.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{recipe.preparationTime} min</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-1">{recipe.reason}</p>
                      
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline" className={getDifficultyColor(recipe.difficulty)}>
                          {recipe.difficulty}
                        </Badge>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddRecipe(recipe);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {selectedRecipe === recipe.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 border-t">
                          <h4 className="text-xs font-medium mb-1">Ingredients:</h4>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {recipe.ingredients.map((ing: string, i: number) => (
                              <li key={i} className="flex items-center gap-1">
                                <div className="w-1 h-1 rounded-full bg-primary/70" />
                                {ing}
                              </li>
                            ))}
                          </ul>
                          
                          <Button 
                            className="w-full mt-3"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddRecipe(recipe);
                            }}
                          >
                            Add Ingredients to List
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CircleAlert className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No recipe recommendations available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIRecipeRecommendations;
