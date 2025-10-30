export interface RecipeIngredient {
  id?: string;
  recipe_id?: string;
  name: string;
  amount: number;
  unit: string;
  original_string?: string;
  sort_order?: number;
}

export interface Recipe {
  id?: string;
  user_id?: string;
  title: string;
  image?: string;
  servings: number;
  ready_in_minutes?: number;
  source_url?: string;
  instructions?: string;
  created_at?: string;
  updated_at?: string;
  ingredients?: RecipeIngredient[];
}
