import { useEffect, useState } from 'react';

interface StatCardProps {
  number: string;
  label: string;
  description: string;
  color: string;
}

function StatCard({ number, label, description, color }: StatCardProps) {
  const [count, setCount] = useState(0);
  const targetNumber = parseInt(number.replace(/\D/g, ''));

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCount(prev => {
          if (prev >= targetNumber) {
            clearInterval(interval);
            return targetNumber;
          }
          return prev + Math.ceil(targetNumber / 50);
        });
      }, 20);
      
      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(timer);
  }, [targetNumber]);

  const displayCount = number.includes('+') ? `${count}+` : 
                      number.includes('%') ? `${count}%` : 
                      number.includes('/') ? `${count}/7` : `${count}`;

  return (
    <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-lg hover-elevate">
      <div className={`text-4xl sm:text-5xl font-bold mb-2 ${color}`} data-testid={`stat-number-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        {displayCount}
      </div>
      <div className="text-lg font-semibold text-white mb-1">{label}</div>
      <div className="text-sm text-cyan-200">{description}</div>
    </div>
  );
}

export default function StatsSection() {
  const stats = [
    {
      number: '1000+',
      label: 'Complaints Resolved',
      description: 'This Month',
      color: 'text-blue-300'
    },
    {
      number: '95%',
      label: 'AI Accuracy Rate',
      description: 'Machine Learning',
      color: 'text-green-300'
    },
    {
      number: '100%',
      label: 'Blockchain Security',
      description: 'Immutable Records',
      color: 'text-purple-300'
    },
    {
      number: '24/7',
      label: 'System Availability',
      description: 'Always Online',
      color: 'text-cyan-300'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}