import { 
  Brain, 
  Shield, 
  Activity, 
  Users, 
  BarChart3, 
  Lock, 
  Clock, 
  Puzzle 
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: string;
}

function FeatureCard({ icon, title, description, highlight }: FeatureCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg hover-elevate transition-all duration-300 group">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      
      <p className="text-white/80 text-sm leading-relaxed mb-3">
        {description}
      </p>
      
      {highlight && (
        <div className="text-cyan-300 text-xs font-medium">
          {highlight}
        </div>
      )}
    </div>
  );
}

export default function FeaturesSection() {
  const features = [
    {
      icon: <Brain className="w-6 h-6 text-white" />,
      title: 'AI Intelligence',
      description: 'Smart classification, priority detection, automated routing',
      highlight: '90% accuracy'
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: 'Blockchain Security',
      description: 'Immutable record keeping, complete transparency, cryptographic verification'
    },
    {
      icon: <Activity className="w-6 h-6 text-white" />,
      title: 'Live Tracking',
      description: 'Real-time status updates, instant notifications, progress visualization'
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: 'Smart Delegation',
      description: 'Intelligent task assignment, role-based access control, workload optimization'
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      title: 'Advanced Analytics',
      description: 'Deep insights, predictive analytics, performance optimization'
    },
    {
      icon: <Lock className="w-6 h-6 text-white" />,
      title: 'Enterprise Security',
      description: 'Bank-level encryption, compliance standards, audit trails'
    },
    {
      icon: <Clock className="w-6 h-6 text-white" />,
      title: 'Always Available',
      description: 'Round-the-clock support, instant assistance, priority handling'
    },
    {
      icon: <Puzzle className="w-6 h-6 text-white" />,
      title: 'Easy Integration',
      description: 'Seamless setup with existing systems and third-party tools'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Next-Generation Features
          </h2>
          <p className="text-xl text-cyan-200 max-w-3xl mx-auto">
            Advanced technology for revolutionary complaint management
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              {...feature} 
              data-testid={`feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}