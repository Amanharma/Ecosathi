import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AiMetrics } from "@shared/schema";

interface AiAnalyticsProps {
  metrics?: AiMetrics;
}

export default function AiAnalytics({ metrics }: AiAnalyticsProps) {
  if (!metrics) {
    return (
      <Card className="shadow-sm border-border animate-pulse" data-testid="card-ai-analytics-loading">
        <CardContent className="p-6">
          <div className="h-64 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const analyticsCards = [
    {
      title: "Prediction Accuracy",
      value: `${metrics.predictionAccuracy}%`,
      subtitle: "+2.1% improvement",
      color: "text-green-600",
      testId: "prediction-accuracy"
    },
    {
      title: "Auto-Assignment",
      value: `${metrics.autoAssignmentRate}%`,
      subtitle: "Target: 95%",
      color: "text-blue-600",
      testId: "auto-assignment"
    },
    {
      title: "Processing Speed",
      value: `${metrics.processingSpeedSeconds}sec`,
      subtitle: "Avg processing",
      color: "text-primary",
      testId: "processing-speed"
    },
    {
      title: "Critical Detected",
      value: (metrics.criticalDetected ?? 0).toLocaleString(),
      subtitle: "Immediate action",
      color: "text-red-600",
      testId: "critical-detected"
    }
  ];

  return (
    <Card className="shadow-sm border-border" data-testid="card-ai-analytics">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground" data-testid="text-analytics-title">
            AI Analytics and Insights
          </h2>
          <Badge variant="secondary" className="bg-green-100 text-green-800" data-testid="badge-realtime-processing">
            Real-time Processing
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {analyticsCards.map((card, index) => (
            <div 
              key={index} 
              className="text-center p-4 border border-border rounded-lg"
              data-testid={`analytics-${card.testId}`}
            >
              <div 
                className={`text-2xl font-bold mb-1 ${card.color}`}
                data-testid={`text-${card.testId}-value`}
              >
                {card.value}
              </div>
              <div 
                className="text-sm text-muted-foreground mb-2"
                data-testid={`text-${card.testId}-title`}
              >
                {card.title}
              </div>
              <div 
                className={`text-xs ${card.color === 'text-green-600' || card.color === 'text-red-600' ? card.color : 'text-muted-foreground'}`}
                data-testid={`text-${card.testId}-subtitle`}
              >
                {card.subtitle}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
