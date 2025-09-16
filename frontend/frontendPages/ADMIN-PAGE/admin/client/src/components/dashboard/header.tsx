import { Leaf, Circle } from "lucide-react";

export default function Header() {
  return (
    <header className="gradient-header shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Logo and title */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Leaf className="text-primary w-4 h-4" data-testid="logo-leaf" />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl" data-testid="text-title">ECOSATHI</h1>
                <p className="text-white/80 text-sm" data-testid="text-subtitle">Admin Dashboard</p>
              </div>
            </div>
          </div>
          
          {/* Right side: User profile */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Circle className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow fill-current" data-testid="status-indicator" />
              <span className="text-white/90 text-sm font-medium" data-testid="text-ai-status">AI Engine Active</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-white/90 text-sm" data-testid="text-portal">Admin Portal</p>
                <p className="text-white font-medium text-sm" data-testid="text-username">Dr. Surabhi Purwar</p>
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-sm" data-testid="text-user-initials">SP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
