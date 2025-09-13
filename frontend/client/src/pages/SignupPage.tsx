import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const success = await signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      
      if (success) {
        setLocation('/dashboard');
      } else {
        setError('Email already exists or invalid data');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
    if (error) setError('');
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-400';
    if (passwordStrength <= 3) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-ecosathi-gradient flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-400/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Back to home link */}
        <Link href="/">
          <div className="flex items-center justify-center mb-8 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xl">Ecosathi</span>
              <span className="text-cyan-200 text-xs font-medium">NEXT GENERATION BLOCKCHAIN</span>
            </div>
          </div>
        </Link>

        {/* Signup form container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl relative">
          {/* Decorative elements */}
          <div className="absolute -top-3 -left-3 w-6 h-6 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-3 -right-3 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-cyan-200">Join the complaint revolution</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
              <span className="text-red-200 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-cyan-400"
                placeholder="Enter your full name"
                required
                data-testid="input-signup-fullname"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-cyan-400"
                placeholder="Enter your email"
                required
                data-testid="input-signup-email"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-cyan-400 pr-12"
                  placeholder="Create a strong password"
                  required
                  data-testid="input-signup-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/80">Password strength:</span>
                    <span className={`${getStrengthColor().replace('bg-', 'text-')} font-medium`}>
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-cyan-400 pr-12"
                  placeholder="Confirm your password"
                  required
                  data-testid="input-signup-confirm-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  data-testid="button-toggle-confirm-password"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Password match indicator */}
              {formData.confirmPassword && (
                <div className="mt-2 flex items-center">
                  {formData.password === formData.confirmPassword ? (
                    <div className="flex items-center text-green-400 text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Passwords match
                    </div>
                  ) : (
                    <div className="flex items-center text-red-400 text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Passwords don't match
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-3 text-lg font-semibold"
              data-testid="button-signup-submit"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Login link */}
          <div className="mt-8 text-center">
            <span className="text-white/80">Already have an account? </span>
            <Link href="/login">
              <span className="text-cyan-300 hover:text-cyan-200 font-medium transition-colors cursor-pointer" data-testid="link-login">
                Sign in
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}