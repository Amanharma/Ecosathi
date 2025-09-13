import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import dashboardImage from '@assets/generated_images/AI_Dashboard_Mockup_96ba70a8.png';

export default function HeroSection() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  const handleSubmitComplaint = () => {
    console.log('Submit a Complaint clicked');
    // Go to login first if not authenticated, then to complaint page
    if (!isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', '/complaint');
      setLocation('/login');
    } else {
      setLocation('/complaint');
    }
  };

  const handleWatchDemo = () => {
    console.log('Watch Demo clicked');
  };

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              Complaint Revolution
            </h1>
            
            <p className="text-xl text-cyan-100 mb-4 font-medium">
              Blockchain Transparency Meets AI Intelligence
            </p>
            
            <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Transform complaint management with cutting-edge AI classification, 
              intelligent routing, and immutable blockchain tracking for unprecedented 
              transparency and efficiency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={handleSubmitComplaint}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-4 text-lg font-semibold"
                data-testid="button-submit-complaint"
              >
                Submit a Complaint
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleWatchDemo}
                className="text-white border-white/30 hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold"
                data-testid="button-watch-demo"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Right side - Dashboard mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glassmorphism container */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl max-w-md w-full">
                <img 
                  src={dashboardImage} 
                  alt="AI Dashboard Mockup" 
                  className="w-full h-auto rounded-lg"
                />
                
                {/* Stats overlay */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <div className="text-2xl font-bold text-white">95%</div>
                    <div className="text-xs text-cyan-200">AI Accuracy</div>
                  </div>
                  <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-xs text-cyan-200">Available</div>
                  </div>
                  <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <div className="text-2xl font-bold text-white">1K+</div>
                    <div className="text-xs text-cyan-200">Resolved</div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}