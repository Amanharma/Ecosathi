import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Droplets, Zap, Car, Recycle, Circle } from "lucide-react";
import type { Department } from "@shared/schema";

interface DepartmentAssignmentsProps {
  departments: Department[];
}

export default function DepartmentAssignments({ departments }: DepartmentAssignmentsProps) {
  const getDepartmentIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'water department':
        return Droplets;
      case 'traffic control':
        return Car;
      case 'electrical department':
        return Zap;
      case 'sanitation department':
        return Recycle;
      default:
        return Circle;
    }
  };

  const getDepartmentColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'water department':
        return 'bg-blue-100 text-blue-600';
      case 'traffic control':
        return 'bg-amber-100 text-amber-600';
      case 'electrical department':
        return 'bg-purple-100 text-purple-600';
      case 'sanitation department':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-amber-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getCapacityPercentage = (activeCases: number | null, capacity: number | null) => {
    if (!activeCases || !capacity) return 0;
    return Math.round((activeCases / capacity) * 100);
  };

  if (!departments || departments.length === 0) {
    return (
      <Card className="shadow-sm border-border animate-pulse" data-testid="card-departments-loading">
        <CardContent className="p-6">
          <div className="h-64 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-border" data-testid="card-department-assignments">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground" data-testid="text-departments-title">
            Department Assignments
          </h2>
          <span className="inline-flex items-center text-sm text-green-600">
            <Circle className="w-2 h-2 bg-green-500 rounded-full mr-2 fill-current" />
            Live Status
          </span>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {departments.map((department) => {
            const Icon = getDepartmentIcon(department.name);
            const capacityPercentage = getCapacityPercentage(department.activeCases, department.capacity);
            const capacityColor = getCapacityColor(capacityPercentage);
            const iconColor = getDepartmentColor(department.name);
            
            return (
              <div 
                key={department.id} 
                className="border border-border rounded-lg p-4"
                data-testid={`department-${department.id}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 
                      className="font-medium text-foreground text-sm"
                      data-testid={`text-department-name-${department.id}`}
                    >
                      {department.name}
                    </h3>
                  </div>
                  <span 
                    className="text-lg font-bold text-foreground"
                    data-testid={`text-active-cases-${department.id}`}
                  >
                    {department.activeCases}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active Cases:</span>
                    <span 
                      className="font-medium"
                      data-testid={`text-active-teams-${department.id}`}
                    >
                      Active Teams: {department.activeTeams}
                    </span>
                  </div>
                  <div className="w-full">
                    <Progress 
                      value={capacityPercentage} 
                      className="h-2"
                      data-testid={`progress-capacity-${department.id}`}
                    />
                    <div className={`h-2 rounded-full ${capacityColor} absolute inset-0`} style={{ width: `${capacityPercentage}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span 
                      className="text-muted-foreground"
                      data-testid={`text-capacity-${department.id}`}
                    >
                      {capacityPercentage}% Capacity
                    </span>
                    <span className="text-muted-foreground">
                      {capacityPercentage >= 80 ? 'High load' : 
                       capacityPercentage >= 60 ? 'Medium priority' : 
                       'Available for urgent'}
                    </span>
                  </div>
                  <div 
                    className="text-xs text-muted-foreground"
                    data-testid={`text-avg-response-${department.id}`}
                  >
                    Avg Response: {department.avgResponseHours} hours
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
