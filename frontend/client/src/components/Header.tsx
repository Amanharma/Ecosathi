import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Brain, User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  const toggleMenu = () => {
    console.log('Menu toggle triggered');
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (item: string) => {
    console.log(`Navigation clicked: ${item}`);
    setIsMenuOpen(false); // Close mobile menu when navigating
    
    switch (item) {
      case 'Home':
        // Refresh landing page
        if (window.location.pathname === '/') {
          window.location.reload();
        } else {
          setLocation('/');
        }
        break;
      case 'Submit Complaint':
        // Go to login first if not authenticated, then to complaint page
        if (!isAuthenticated) {
          localStorage.setItem('redirectAfterLogin', '/complaint');
          setLocation('/login');
        } else {
          setLocation('/complaint');
        }
        break;
      case 'Track Status':
        // Go to login first if not authenticated, then to dashboard
        if (!isAuthenticated) {
          localStorage.setItem('redirectAfterLogin', '/dashboard');
          setLocation('/login');
        } else {
          setLocation('/dashboard');
        }
        break;
      case 'About':
        // Scroll to about section on homepage
        if (window.location.pathname !== '/') {
          setLocation('/');
        }
        setTimeout(() => {
          const aboutSection = document.getElementById('about');
          if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
        break;
      case 'Help':
        // Scroll to help/contact section on homepage
        if (window.location.pathname !== '/') {
          setLocation('/');
        }
        setTimeout(() => {
          const helpSection = document.getElementById('contact');
          if (helpSection) {
            helpSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    logout();
    console.log('User logged out');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg">Ecosathi</span>
              <span className="text-cyan-200 text-xs font-medium">NEXT GENERATION BLOCKCHAIN</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Home', 'Submit Complaint', 'Track Status', 'About', 'Help'].map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className="text-white hover:text-cyan-200 font-medium transition-colors duration-200"
                data-testid={`nav-${item.toLowerCase().replace(' ', '-')}`}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{user?.fullName}</div>
                    <div className="text-cyan-200 text-xs">{user?.email}</div>
                  </div>
                </div>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/10"
                    data-testid="button-dashboard"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="text-white border-white/30 hover:bg-white/10"
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/10"
                    data-testid="button-login"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    data-testid="button-get-started"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white hover:text-cyan-200 transition-colors"
            data-testid="button-mobile-menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <nav className="flex flex-col space-y-3">
              {['Home', 'Submit Complaint', 'Track Status', 'About', 'Help'].map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className="text-white hover:text-cyan-200 font-medium text-left transition-colors duration-200"
                  data-testid={`nav-mobile-${item.toLowerCase().replace(' ', '-')}`}
                >
                  {item}
                </button>
              ))}
              <div className="flex flex-col space-y-3 pt-3 border-t border-white/20">
                {isAuthenticated ? (
                  <>
                    <div className="text-center py-3">
                      <div className="text-white font-medium">{user?.fullName}</div>
                      <div className="text-cyan-200 text-sm">{user?.email}</div>
                    </div>
                    <Link href="/dashboard">
                      <Button
                        variant="outline"
                        className="text-white border-white/30 hover:bg-white/10 justify-center w-full"
                        data-testid="button-mobile-dashboard"
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="text-white border-white/30 hover:bg-white/10 justify-center"
                      data-testid="button-mobile-logout"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="text-white border-white/30 hover:bg-white/10 justify-center w-full"
                        data-testid="button-mobile-login"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 w-full"
                        data-testid="button-mobile-get-started"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}