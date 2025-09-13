// Replace:
// import clientLogos from '@assets/generated_images/downloadT.png';

// With:
const clientLogos = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iIzMzNzNkYyIgb3BhY2l0eT0iMC4xIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNsaWVudCBMb2dvczwvdGV4dD4KPC9zdmc+';

export default function TrustSection() {
  // Mock client data for display
  const clients = [
    { name: 'TechCorp Global', code: 'TC' },
    { name: 'GovAgency Pro', code: 'GP' },
    { name: 'Healthcare Plus', code: 'H+' },
    { name: 'EduSystem 360', code: 'E360' },
    { name: 'RetailChain Max', code: 'RM' }
  ];

  const stats = [
    { number: '150+', label: 'Enterprise Clients' },
    { number: '99.9%', label: 'Uptime Guarantee' },
    { number: '24/7', label: 'Expert Support' }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-cyan-200 max-w-3xl mx-auto">
            Join thousands of organizations revolutionizing complaint management
          </p>
        </div>

        {/* Client logos */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-lg mb-12">
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
            {clients.map((client, index) => (
              <div 
                key={index}
                className="group cursor-pointer transition-all duration-300 hover:scale-110"
                data-testid={`client-logo-${client.code.toLowerCase()}`}
              >
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg group-hover:bg-white/20 transition-all duration-300">
                  {client.code}
                </div>
                <div className="text-center mt-2 text-xs text-cyan-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {client.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              data-testid={`trust-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="text-3xl font-bold text-cyan-300 mb-2">{stat.number}</div>
              <div className="text-white/80 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Client logo image (as backup visual) */}
        <div className="mt-12 flex justify-center opacity-50">
          <img 
            src={clientLogos} 
            alt="Client logos" 
            className="max-w-full h-auto rounded-lg"
            style={{ maxHeight: '120px' }}
          />
        </div>
      </div>
    </section>
  );
}