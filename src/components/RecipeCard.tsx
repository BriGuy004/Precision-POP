import { RecipeWithDetails } from '@/types/recipe.types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ShoppingCart, ExternalLink, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface RecipeCardProps {
  recipe: RecipeWithDetails;
  onAddToShoppingList: (recipeId: string) => void;
  onDelete: (recipeId: string) => void;
  onViewDetails?: (recipe: RecipeWithDetails) => void;
}

export const RecipeCard = ({ 
  recipe, 
  onAddToShoppingList, 
  onDelete,
  onViewDetails 
}: RecipeCardProps) => {
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {recipe.image_url && (
        <div 
          className="h-48 bg-cover bg-center cursor-pointer"
          style={{ backgroundImage: `url(${recipe.image_url})` }}
          onClick={() => onViewDetails?.(recipe)}
        />
      )}
      
      <CardHeader className="space-y-2">
        <h3 
          className="font-semibold text-lg line-clamp-2 cursor-pointer hover:text-primary"
          onClick={() => onViewDetails?.(recipe)}
        >
          {recipe.title}
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {recipe.servings && (
            <Badge variant="secondary" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              {recipe.servings} servings
            </Badge>
          )}
          {totalTime > 0 && (
            <Badge variant="secondary" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {totalTime} min
            </Badge>
          )}
        </div>
      </CardHeader>

      {recipe.description && (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {recipe.description}
          </p>
        </CardContent>
      )}

      <CardFooter className="flex gap-2">
        <Button
          onClick={() => onAddToShoppingList(recipe.id)}
          className="flex-1"
          variant="default"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to List
        </Button>

        {recipe.source_url && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.open(recipe.source_url, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Recipe?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{recipe.title}" and all its ingredients and instructions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(recipe.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};
