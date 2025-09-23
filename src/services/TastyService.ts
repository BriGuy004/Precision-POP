
// This service handles interactions with the Tasty API

interface TastyRecipeIngredient {
  name: string;
  quantity?: string;
  unit?: string;
}

export interface TastyRecipe {
  id: number;
  name: string;
  description: string;
  url: string;
  thumbnail_url: string;
  ingredients: TastyRecipeIngredient[];
}

// Simplified response interface from Tasty API
interface TastySearchResponse {
  count: number;
  results: TastyRecipe[];
}

class TastyService {
  private readonly API_KEY = "YOUR_TASTY_API_KEY"; // In a real app, store this securely
  private readonly BASE_URL = "https://tasty.p.rapidapi.com";

  async searchRecipes(query: string): Promise<TastyRecipe[]> {
    try {
      // In a real implementation, this would be a direct API call
      // For demonstration purposes, we're simulating the API call
      console.log(`Searching for recipes with query: ${query}`);
      
      // Simulated response for demo purposes
      return this.getMockRecipes(query);
    } catch (error) {
      console.error("Error searching recipes:", error);
      throw new Error("Failed to search recipes");
    }
  }

  async getRecipeDetails(id: number): Promise<TastyRecipe> {
    try {
      // In a real implementation, this would fetch specific recipe details
      // For demonstration, return a mock recipe
      const allRecipes = this.getMockRecipes("");
      const recipe = allRecipes.find(r => r.id === id) || allRecipes[0];
      return recipe;
    } catch (error) {
      console.error("Error getting recipe details:", error);
      throw new Error("Failed to get recipe details");
    }
  }

  // Mock data for demonstration
  private getMockRecipes(query: string): TastyRecipe[] {
    const allRecipes: TastyRecipe[] = [
      {
        id: 1,
        name: "Classic Spaghetti Carbonara",
        description: "A simple Roman pasta dish with eggs, cheese, and pancetta",
        url: "https://tasty.co/recipe/carbonara",
        thumbnail_url: "/placeholder.svg",
        ingredients: [
          { name: "Spaghetti", quantity: "1", unit: "pound" },
          { name: "Eggs", quantity: "4", unit: "large" },
          { name: "Pancetta", quantity: "8", unit: "oz" },
          { name: "Parmesan cheese", quantity: "1", unit: "cup" },
          { name: "Black pepper", quantity: "1", unit: "tsp" }
        ]
      },
      {
        id: 2,
        name: "Chicken Tikka Masala",
        description: "Grilled chicken in a creamy tomato curry sauce",
        url: "https://tasty.co/recipe/chicken-tikka-masala",
        thumbnail_url: "/placeholder.svg",
        ingredients: [
          { name: "Chicken breasts", quantity: "2", unit: "lbs" },
          { name: "Yogurt", quantity: "1", unit: "cup" },
          { name: "Garam masala", quantity: "2", unit: "tbsp" },
          { name: "Tomato sauce", quantity: "15", unit: "oz" },
          { name: "Heavy cream", quantity: "1", unit: "cup" }
        ]
      },
      {
        id: 3,
        name: "Avocado Toast",
        description: "Simple and nutritious breakfast toast",
        url: "https://tasty.co/recipe/avocado-toast",
        thumbnail_url: "/placeholder.svg",
        ingredients: [
          { name: "Bread", quantity: "2", unit: "slices" },
          { name: "Avocado", quantity: "1", unit: "ripe" },
          { name: "Lemon juice", quantity: "1", unit: "tsp" },
          { name: "Salt", quantity: "1/4", unit: "tsp" },
          { name: "Red pepper flakes", quantity: "1/4", unit: "tsp" }
        ]
      }
    ];

    if (!query) return allRecipes;
    
    return allRecipes.filter(recipe => 
      recipe.name.toLowerCase().includes(query.toLowerCase()) ||
      recipe.description.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export const tastyService = new TastyService();
