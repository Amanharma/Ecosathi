import { useQuery } from "@tanstack/react-query";
import Header from "@/components/dashboard/header";
import KpiCards from "@/components/dashboard/kpi-cards";
import AiControlCenter from "@/components/dashboard/ai-control-center";
import PriorityQueue from "@/components/dashboard/priority-queue";
import DepartmentAssignments from "@/components/dashboard/department-assignments";
import AiAnalytics from "@/components/dashboard/ai-analytics";
import BlockchainNetwork from "@/components/dashboard/blockchain-network";
import type { AiMetrics, BlockchainMetrics, Complaint, Department } from "@shared/schema";

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useQuery<AiMetrics>({
    queryKey: ["/api/dashboard/metrics"],
  });

  const { data: blockchain, isLoading: blockchainLoading } = useQuery<BlockchainMetrics>({
    queryKey: ["/api/dashboard/blockchain"],
  });

  const { data: complaints, isLoading: complaintsLoading } = useQuery<Complaint[]>({
    queryKey: ["/api/complaints"],
  });

  const { data: departments, isLoading: departmentsLoading } = useQuery<Department[]>({
    queryKey: ["/api/departments"],
  });

  if (metricsLoading || blockchainLoading || complaintsLoading || departmentsLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <KpiCards metrics={metrics} />
        <AiControlCenter />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PriorityQueue complaints={complaints || []} />
          <DepartmentAssignments departments={departments || []} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AiAnalytics metrics={metrics} />
          <BlockchainNetwork blockchain={blockchain} />
        </div>
      </main>
    </div>
  );
}
