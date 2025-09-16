import { Card, CardContent } from "@/components/ui/card";
import { Circle } from "lucide-react";
import type { BlockchainMetrics } from "@shared/schema";

interface BlockchainNetworkProps {
  blockchain?: BlockchainMetrics;
}

export default function BlockchainNetwork({ blockchain }: BlockchainNetworkProps) {
  if (!blockchain) {
    return (
      <Card className="shadow-sm border-border animate-pulse" data-testid="card-blockchain-loading">
        <CardContent className="p-6">
          <div className="h-64 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const networkData = [
    {
      title: "Block Height",
      value: (blockchain.blockHeight ?? 0).toLocaleString(),
      subtitle: "Current: 24 ago",
      testId: "block-height"
    },
    {
      title: "Verified Records",
      value: `${blockchain.verifiedRecords}%`,
      subtitle: "All complaints",
      color: "text-green-600",
      testId: "verified-records"
    },
    {
      title: "Smart Contracts",
      value: (blockchain.smartContracts ?? 0).toLocaleString(),
      subtitle: "Auto-executed",
      color: "text-primary",
      testId: "smart-contracts"
    },
    {
      title: "Gas Used",
      value: (blockchain.gasUsed ?? 0).toFixed(3),
      subtitle: "Ether",
      color: "text-amber-600",
      testId: "gas-used"
    }
  ];

  return (
    <Card className="shadow-sm border-border" data-testid="card-blockchain-network">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground" data-testid="text-blockchain-title">
            Blockchain Distribution Network
          </h2>
          <span className="inline-flex items-center text-sm text-green-600">
            <Circle className="w-2 h-2 bg-green-500 rounded-full mr-2 fill-current" />
            Network Active
          </span>
        </div>
      </div>
      
      <CardContent className="p-6">
        {/* Network Visualization */}
        <div className="relative h-24 mb-6 bg-muted/30 rounded-lg overflow-hidden" data-testid="network-visualization">
          {/* Network nodes */}
          <div className="network-node" style={{ top: '20px', left: '30px' }} data-testid="network-node-1"></div>
          <div className="network-node" style={{ top: '40px', left: '80px' }} data-testid="network-node-2"></div>
          <div className="network-node" style={{ top: '15px', left: '130px' }} data-testid="network-node-3"></div>
          <div className="network-node" style={{ top: '50px', left: '180px' }} data-testid="network-node-4"></div>
          <div className="network-node" style={{ top: '25px', left: '230px' }} data-testid="network-node-5"></div>
          
          {/* Network connections */}
          <div className="network-connection" style={{ top: '28px', left: '42px', width: '46px', transform: 'rotate(15deg)' }}></div>
          <div className="network-connection" style={{ top: '23px', left: '92px', width: '46px', transform: 'rotate(-10deg)' }}></div>
          <div className="network-connection" style={{ top: '48px', left: '142px', width: '46px', transform: 'rotate(25deg)' }}></div>
          <div className="network-connection" style={{ top: '33px', left: '192px', width: '46px', transform: 'rotate(-15deg)' }}></div>
        </div>
        
        {/* Network Status Cards */}
        <div className="grid grid-cols-1 gap-3">
          {networkData.map((item, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center p-3 border border-border rounded"
              data-testid={`blockchain-${item.testId}`}
            >
              <div>
                <div 
                  className={`font-medium ${item.color || 'text-foreground'}`}
                  data-testid={`text-${item.testId}-value`}
                >
                  {item.value}
                </div>
                <div 
                  className="text-sm text-muted-foreground"
                  data-testid={`text-${item.testId}-title`}
                >
                  {item.title}
                </div>
              </div>
              <div 
                className={`text-xs ${item.color || 'text-muted-foreground'}`}
                data-testid={`text-${item.testId}-subtitle`}
              >
                {item.subtitle}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
