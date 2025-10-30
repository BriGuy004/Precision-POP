-- Create recipes table to store user recipes
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  image TEXT,
  servings INTEGER DEFAULT 4,
  ready_in_minutes INTEGER,
  source_url TEXT,
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recipe_ingredients table to store ingredients for each recipe
CREATE TABLE public.recipe_ingredients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC,
  unit TEXT,
  original_string TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recipes
CREATE POLICY "Users can view their own recipes"
ON public.recipes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recipes"
ON public.recipes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes"
ON public.recipes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes"
ON public.recipes FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for recipe_ingredients (inherit from recipe ownership)
CREATE POLICY "Users can view ingredients of their recipes"
ON public.recipe_ingredients FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.recipes
  WHERE recipes.id = recipe_ingredients.recipe_id
  AND recipes.user_id = auth.uid()
));

CREATE POLICY "Users can insert ingredients to their recipes"
ON public.recipe_ingredients FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.recipes
  WHERE recipes.id = recipe_ingredients.recipe_id
  AND recipes.user_id = auth.uid()
));

CREATE POLICY "Users can update ingredients of their recipes"
ON public.recipe_ingredients FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.recipes
  WHERE recipes.id = recipe_ingredients.recipe_id
  AND recipes.user_id = auth.uid()
));

CREATE POLICY "Users can delete ingredients of their recipes"
ON public.recipe_ingredients FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.recipes
  WHERE recipes.id = recipe_ingredients.recipe_id
  AND recipes.user_id = auth.uid()
));

-- Trigger for updated_at on recipes
CREATE TRIGGER update_recipes_updated_at
BEFORE UPDATE ON public.recipes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Index for faster queries
CREATE INDEX idx_recipes_user_id ON public.recipes(user_id);
CREATE INDEX idx_recipe_ingredients_recipe_id ON public.recipe_ingredients(recipe_id);