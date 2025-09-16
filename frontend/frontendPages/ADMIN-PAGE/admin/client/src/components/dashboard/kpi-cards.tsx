import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Bot, Clock, CheckCircle, TrendingUp } from "lucide-react";
import type { AiMetrics } from "@shared/schema";

interface KpiCardsProps {
  metrics?: AiMetrics;
}

export default function KpiCards({ metrics }: KpiCardsProps) {
  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Complaints",
      value: (metrics.totalComplaints ?? 0).toLocaleString(),
      icon: AlertTriangle,
      trend: "+12%",
      trendText: "this week",
      positive: true,
      testId: "card-total-complaints"
    },
    {
      title: "AI Assignments",
      value: `${metrics.aiAssignmentRate}%`,
      icon: Bot,
      subtitle: "Auto-routed today",
      testId: "card-ai-assignments"
    },
    {
      title: "Avg Response",
      value: `${metrics.avgResponseHours}h`,
      icon: Clock,
      trend: "30%",
      trendText: "improved",
      positive: true,
      testId: "card-avg-response"
    },
    {
      title: "Resolution Rate",
      value: `${metrics.resolutionRate}%`,
      icon: CheckCircle,
      subtitle: "Within 48 hours",
      testId: "card-resolution-rate"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="border-border shadow-sm" data-testid={card.testId}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground" data-testid={`text-${card.testId}-title`}>
                  {card.title}
                </h3>
                <Icon className="h-4 w-4 text-primary" data-testid={`icon-${card.testId}`} />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1" data-testid={`text-${card.testId}-value`}>
                {card.value}
              </div>
              {card.trend && (
                <div className="flex items-center text-sm">
                  <TrendingUp className={`h-3 w-3 mr-1 ${card.positive ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`font-medium ${card.positive ? 'text-green-500' : 'text-red-500'}`}>
                    {card.trend}
                  </span>
                  <span className="text-muted-foreground ml-1">{card.trendText}</span>
                </div>
              )}
              {card.subtitle && (
                <div className="text-sm text-muted-foreground" data-testid={`text-${card.testId}-subtitle`}>
                  {card.subtitle}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
