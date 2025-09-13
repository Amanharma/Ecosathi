import { FileText, Brain, BarChart3 } from 'lucide-react';

interface StepProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
}

function Step({ number, title, description, icon, badge, badgeColor }: StepProps) {
  return (
    <div className="text-center relative">
      {/* Step number circle */}
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
        {number}
      </div>
      
      {/* Icon */}
      <div className="mb-4 flex justify-center">
        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
          {icon}
        </div>
      </div>
      
      {/* Title */}
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      
      {/* Badge */}
      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${badgeColor}`}>
        {badge}
      </div>
      
      {/* Description */}
      <p className="text-white/80 text-sm leading-relaxed max-w-xs mx-auto">
        {description}
      </p>
    </div>
  );
}

export default function HowItWorksSection() {
  const steps = [
    {
      number: '1',
      title: 'Submit Your Complaint',
      description: 'AI instantly categorizes and prioritizes your complaint using advanced machine learning algorithms for optimal routing',
      icon: <FileText className="w-6 h-6 text-cyan-300" />,
      badge: 'POWERFUL',
      badgeColor: 'bg-green-500/20 text-green-300 border border-green-500/30'
    },
    {
      number: '2',
      title: 'AI Processing and Assignment',
      description: 'Smart system assigns complaints to the most appropriate admin based on expertise and workload for lightning-fast resolution',
      icon: <Brain className="w-6 h-6 text-blue-300" />,
      badge: 'SMART ALGO',
      badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
    },
    {
      number: '3',
      title: 'Track Resolution',
      description: 'Real-time tracking with complete blockchain transparency. Every action is recorded and immutably verified',
      icon: <BarChart3 className="w-6 h-6 text-purple-300" />,
      badge: 'BLOCKCHAIN SECURED',
      badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            How The Magic Works
          </h2>
          <p className="text-xl text-cyan-200 max-w-3xl mx-auto">
            Revolutionary 3-step process powered by AI and secured by blockchain
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative" data-testid={`step-${index + 1}`}>
              <Step {...step} />
              
              {/* Connecting arrow (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-1 -ml-8 z-10">
                  <div className="w-full h-px bg-gradient-to-r from-cyan-400 to-blue-400 relative">
                    <div className="absolute right-0 top-0 w-2 h-2 bg-cyan-400 rounded-full -mt-0.5 -mr-1"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}