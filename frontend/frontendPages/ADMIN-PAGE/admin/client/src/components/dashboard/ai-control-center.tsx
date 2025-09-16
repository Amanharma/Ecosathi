import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Circle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { AiControlSettings } from "@shared/schema";

export default function AiControlCenter() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useQuery<AiControlSettings>({
    queryKey: ["/api/dashboard/ai-control"],
  });

  const updateMutation = useMutation({
    mutationFn: async (newSettings: Partial<AiControlSettings>) => {
      const response = await apiRequest("POST", "/api/dashboard/ai-control", newSettings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/ai-control"] });
      toast({
        title: "Settings Updated",
        description: "AI control settings have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update AI control settings.",
      });
    },
  });

  const handleToggleChange = (field: keyof AiControlSettings, value: boolean) => {
    if (!settings) return;
    updateMutation.mutate({ [field]: value });
  };

  if (isLoading || !settings) {
    return (
      <Card className="mb-8 animate-pulse" data-testid="card-ai-control-loading">
        <CardContent className="p-6">
          <div className="h-32 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-border mb-8" data-testid="card-ai-control-center">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-foreground" data-testid="text-ai-control-title">
              AI Control Center
            </h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Circle className="w-2 h-2 bg-green-500 rounded-full mr-2 fill-current" />
              System Optimal
            </span>
          </div>
          <Button 
            variant="ghost" 
            className="text-primary hover:text-primary/80 text-sm font-medium"
            data-testid="button-auto-assignment"
          >
            <Plus className="w-4 h-4 mr-2" />
            Auto Assignment
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Switch
                id="manual-override"
                checked={settings.manualOverride ?? false}
                onCheckedChange={(checked) => handleToggleChange('manualOverride', checked)}
                data-testid="switch-manual-override"
              />
              <label 
                htmlFor="manual-override" 
                className="text-sm text-muted-foreground cursor-pointer"
                data-testid="label-manual-override"
              >
                Manual Override
              </label>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Switch
                id="auto-assignment"
                checked={settings.autoAssignment ?? true}
                onCheckedChange={(checked) => handleToggleChange('autoAssignment', checked)}
                data-testid="switch-auto-assignment"
              />
              <label 
                htmlFor="auto-assignment" 
                className={`text-sm cursor-pointer ${(settings.autoAssignment ?? true) ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
                data-testid="label-auto-assignment"
              >
                Auto Assignment
              </label>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Switch
                id="ai-training"
                checked={settings.aiTraining ?? false}
                onCheckedChange={(checked) => handleToggleChange('aiTraining', checked)}
                data-testid="switch-ai-training"
              />
              <label 
                htmlFor="ai-training" 
                className="text-sm text-muted-foreground cursor-pointer"
                data-testid="label-ai-training"
              >
                AI Training
              </label>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground" data-testid="text-model-status">
          Last AI Model Update: {settings.lastModelUpdate ? new Date(settings.lastModelUpdate).toLocaleDateString() : 'N/A'} {settings.lastModelUpdate ? new Date(settings.lastModelUpdate).toLocaleTimeString() : ''} | 
          Accuracy: {settings.accuracy ?? 0}% | 
          Processed: {(settings.processedComplaints ?? 0).toLocaleString()} complaints
        </div>
      </CardContent>
    </Card>
  );
}
