import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ChefHat, Link as LinkIcon, ArrowLeft } from "lucide-react";
import { useRecipes } from "@/hooks/useRecipes";

const RecipeImport = () => {
  const navigate = useNavigate();
  const { importFromUrl } = useRecipes();
  const [url, setUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    if (!url.trim()) return;

    try {
      setIsImporting(true);
      await importFromUrl(url);
      navigate("/recipes");
    } catch (error) {
      console.error("Import error:", error);
    } finally {
      setIsImporting(false);
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

      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Import from Spoonacular</CardTitle>
            <CardDescription>
              Paste a Spoonacular recipe URL to import it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="url"
                    placeholder="https://spoonacular.com/recipes/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleImport()}
                    className="pl-9"
                  />
                </div>
                <Button 
                  onClick={handleImport}
                  disabled={isImporting || !url.trim()}
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    "Import"
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Example: https://spoonacular.com/recipes/chicken-parmesan-654321
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecipeImport;
