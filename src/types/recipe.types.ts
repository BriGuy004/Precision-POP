export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  name: string;
  amount: number;
  unit: string;
  original_string?: string;
  sort_order?: number;
}

export interface RecipeInstruction {
  id: string;
  recipe_id: string;
  step_number: number;
  instruction: string;
}

export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  image_url?: string;
  description?: string;
  servings?: number;
  prep_time?: number;
  cook_time?: number;
  source_url?: string;
  created_at: string;
  updated_at: string;
}

export interface RecipeWithDetails extends Recipe {
  ingredients?: RecipeIngredient[];
  instructions?: RecipeInstruction[];
}
