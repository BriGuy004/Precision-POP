
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Sparkles, Clock, DollarSign, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { personalizationService } from '@/services/PersonalizationService';
import { aiRecommendationService } from '@/services/AIRecommendationService';

interface ShoppingInsightsProps {
  userId?: string;
}

const ShoppingInsights = ({ userId = 'user123' }: ShoppingInsightsProps) => {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      setLoading(true);
      try {
        // Load insights from both services
        const [patternInsights, aiInsights] = await Promise.all([
          personalizationService.getShoppingPatternInsights(userId),
          aiRecommendationService.getShoppingInsights(userId)
        ]);
        
        // Combine and deduplicate insights
        const combined = [...patternInsights, ...aiInsights];
        setInsights(combined);
      } catch (error) {
        console.error('Error loading shopping insights:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadInsights();
  }, [userId]);

  const getInsightIcon = (type: string) => {
    switch(type) {
      case 'timing':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'savings':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'pattern':
        return <TrendingUp className="h-5 w-5 text-purple-500" />;
      case 'nutrition':
        return <Star className="h-5 w-5 text-yellow-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-pink-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch(impact) {
      case 'positive': return 'bg-green-50 text-green-700 border-green-200';
      case 'negative': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Shopping Insights
        </CardTitle>
        <CardDescription>
          Personalized insights based on your shopping patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-pulse space-y-3 w-full">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-muted rounded-md" />
              ))}
            </div>
          </div>
        ) : insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.title + index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-3 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {insight.description}
                    </p>
                    {insight.recommendation && (
                      <div className={`mt-2 p-1.5 text-xs rounded border ${getImpactColor(insight.impact)}`}>
                        <strong>Recommendation:</strong> {insight.recommendation}
                      </div>
                    )}
                    {insight.value && (
                      <div className="mt-1.5 text-sm font-medium">
                        Potential impact: ${insight.value.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            No insights available yet. The more you shop, the more personalized insights we can provide!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShoppingInsights;
