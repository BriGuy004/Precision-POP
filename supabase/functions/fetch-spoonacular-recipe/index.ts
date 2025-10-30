import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipeUrl } = await req.json();
    
    if (!recipeUrl) {
      throw new Error('Recipe URL is required');
    }

    const SPOONACULAR_API_KEY = Deno.env.get('SPOONACULAR_API_KEY');
    if (!SPOONACULAR_API_KEY) {
      throw new Error('SPOONACULAR_API_KEY not configured');
    }

    // Extract recipe ID from URL
    const recipeIdMatch = recipeUrl.match(/recipes\/(\d+)/);
    if (!recipeIdMatch) {
      throw new Error('Invalid Spoonacular recipe URL');
    }
    const recipeId = recipeIdMatch[1];

    // Fetch recipe details from Spoonacular
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Spoonacular API error:', response.status, errorText);
      throw new Error(`Spoonacular API error: ${response.status}`);
    }

    const recipeData = await response.json();

    // Transform to our format
    const recipe = {
      title: recipeData.title,
      description: recipeData.summary?.replace(/<[^>]*>/g, ''), // Strip HTML tags
      image_url: recipeData.image,
      servings: recipeData.servings,
      prep_time: recipeData.preparationMinutes || 0,
      cook_time: recipeData.cookingMinutes || 0,
      source_url: recipeData.sourceUrl || recipeUrl,
      ingredients: recipeData.extendedIngredients?.map((ing: any, index: number) => ({
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        original_string: ing.original,
        sort_order: index,
      })) || [],
      instructions: recipeData.analyzedInstructions?.[0]?.steps?.map((step: any) => ({
        step_number: step.number,
        instruction: step.step,
      })) || [],
    };

    return new Response(JSON.stringify(recipe), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-spoonacular-recipe:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
