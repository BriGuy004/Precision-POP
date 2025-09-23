
import { useState } from "react";
import { Plus, ShoppingBag, ChefHat, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import RecipeSearch from "@/components/RecipeSearch";
import ItemForm from "@/components/ItemForm";
import RecipeForm from "@/components/RecipeForm";
import ShoppingListItem from "@/components/ShoppingListItem";
import EmptyShoppingList from "@/components/EmptyShoppingList";
import VoiceShoppingAssistant from "@/components/VoiceShoppingAssistant";
import AIRecipeRecommendations from "@/components/AIRecipeRecommendations";
import ShoppingInsights from "@/components/ShoppingInsights";

interface ListItem {
  id: string;
  type: 'item' | 'recipe';
  name: string;
  notes?: string;
  ingredients?: string[];
  addedAt: Date;
}

const ShoppingList = () => {
  const [items, setItems] = useState<ListItem[]>([]);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [recipeDialogOpen, setRecipeDialogOpen] = useState(false);
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState(false);

  const addItem = (name: string, notes: string = "") => {
    const newItem: ListItem = {
      id: Date.now().toString(),
      type: 'item',
      name,
      notes,
      addedAt: new Date(),
    };
    
    setItems([...items, newItem]);
    setItemDialogOpen(false);
  };

  const addRecipe = (name: string, notes: string, ingredients: string[]) => {
    const newRecipe: ListItem = {
      id: Date.now().toString(),
      type: 'recipe',
      name,
      notes,
      ingredients,
      addedAt: new Date(),
    };
    
    setItems([...items, newRecipe]);
    setRecipeDialogOpen(false);
  };

  const addRecipeFromSearch = (recipe: { name: string; notes?: string; ingredients: string[] }) => {
    const newRecipe: ListItem = {
      id: Date.now().toString(),
      type: 'recipe',
      name: recipe.name,
      notes: recipe.notes,
      ingredients: recipe.ingredients,
      addedAt: new Date(),
    };
    
    setItems([...items, newRecipe]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  // Get all item names for AI recipe recommendations
  const getItemNames = () => {
    return items
      .filter(item => item.type === 'item')
      .map(item => item.name);
  };

  return (
    <div className="container mx-auto px-1 py-0 mt-0">
      {/* Logo positioned at the absolute top of the screen with h-32 height */}
      <div className="flex justify-center mt-0 mb-[2px]">
        <img 
          src="/lovable-uploads/90ab9748-bbf9-4c76-bea3-2294d748f78e.png" 
          alt="H-E-B" 
          className="h-32" 
        />
      </div>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="list" className="flex-1">Shopping List</TabsTrigger>
          <TabsTrigger value="recipes" className="flex-1">Recipe Ideas</TabsTrigger>
          <TabsTrigger value="insights" className="flex-1">AI Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <header className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => setVoiceAssistantOpen(!voiceAssistantOpen)}
            >
              <Send className="w-4 h-4" />
              <span>Voice Assistant</span>
            </Button>
            
            <div className="flex space-x-2">
              <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Item</span>
                  </Button>
                </DialogTrigger>
                <ItemForm onAddItem={addItem} />
              </Dialog>

              <Dialog open={recipeDialogOpen} onOpenChange={setRecipeDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <ChefHat className="w-4 h-4" />
                    <span>Add Recipe</span>
                  </Button>
                </DialogTrigger>
                <RecipeForm onAddRecipe={addRecipe} />
              </Dialog>

              <RecipeSearch onRecipeSelect={addRecipeFromSearch} />
            </div>
          </header>

          {voiceAssistantOpen && (
            <div className="mb-6 p-3 border rounded-lg bg-accent/10">
              <VoiceShoppingAssistant onAddItem={addItem} />
            </div>
          )}

          {items.length === 0 ? (
            <EmptyShoppingList />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Item / Recipe</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <ShoppingListItem 
                    key={item.id} 
                    item={item} 
                    onRemove={removeItem} 
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
        
        <TabsContent value="recipes">
          <div className="mb-4">
            <h2 className="text-lg font-medium flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              Personalized Recipe Ideas
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Based on your shopping list and purchase history
            </p>
            
            <AIRecipeRecommendations 
              onRecipeSelect={addRecipeFromSearch} 
              currentItems={getItemNames()}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="insights">
          <ShoppingInsights userId="user123" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShoppingList;
