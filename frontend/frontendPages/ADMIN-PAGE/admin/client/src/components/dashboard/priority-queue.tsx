import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Complaint } from "@shared/schema";

interface PriorityQueueProps {
  complaints: Complaint[];
}

export default function PriorityQueue({ complaints }: PriorityQueueProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'priority-critical bg-red-500 text-white';
      case 'MEDIUM':
        return 'priority-medium bg-amber-500 text-white';
      case 'LOW':
        return 'priority-low bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const then = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - then.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const visibleComplaints = complaints.slice(0, 3);
  const remainingCount = Math.max(0, complaints.length - 3);

  return (
    <Card className="shadow-sm border-border" data-testid="card-priority-queue">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground" data-testid="text-queue-title">
            AI Priority Queue
          </h2>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800" data-testid="badge-realtime">
            Real-time Updates
          </Badge>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            className="bg-primary text-primary-foreground"
            data-testid="button-filter-all"
          >
            All Types
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            className="bg-muted text-muted-foreground hover:bg-accent"
            data-testid="button-filter-critical"
          >
            Critical
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            className="bg-muted text-muted-foreground hover:bg-accent"
            data-testid="button-filter-unassigned"
          >
            Unassigned
          </Button>
        </div>
      </div>
      
      <div className="p-0">
        {visibleComplaints.length > 0 ? (
          visibleComplaints.map((complaint) => (
            <div 
              key={complaint.id} 
              className="border-b border-border p-4 hover:bg-accent/50 transition-colors"
              data-testid={`complaint-${complaint.id}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span 
                    className="text-sm font-mono text-muted-foreground"
                    data-testid={`text-complaint-number-${complaint.id}`}
                  >
                    {complaint.complaintNumber}
                  </span>
                  <Badge 
                    className={`px-2 py-1 text-xs font-medium ${getPriorityColor(complaint.priority)}`}
                    data-testid={`badge-priority-${complaint.id}`}
                  >
                    {complaint.priority}
                  </Badge>
                </div>
                <Badge 
                  className={`px-2 py-1 text-xs font-medium ${getStatusColor(complaint.status)}`}
                  data-testid={`badge-status-${complaint.id}`}
                >
                  {complaint.status}
                </Badge>
              </div>
              <h4 
                className="font-medium text-foreground mb-1"
                data-testid={`text-complaint-title-${complaint.id}`}
              >
                {complaint.title}
              </h4>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span data-testid={`text-assigned-to-${complaint.id}`}>
                  {complaint.assignedTo}
                </span>
                <span data-testid={`text-location-${complaint.id}`}>
                  {complaint.location}
                </span>
                <span data-testid={`text-time-ago-${complaint.id}`}>
                  {formatTimeAgo(complaint.createdAt || new Date())}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground" data-testid="text-no-complaints">
              No complaints in queue
            </p>
          </div>
        )}
      </div>
      
      {remainingCount > 0 && (
        <div className="p-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full text-primary hover:text-primary/80 text-sm font-medium"
            data-testid="button-view-all"
          >
            + {remainingCount} more complaints in queue - View All Complaints
          </Button>
        </div>
      )}
    </Card>
  );
}
