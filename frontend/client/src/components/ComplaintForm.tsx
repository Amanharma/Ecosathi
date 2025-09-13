import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, CheckCircle, User, LogIn, AlertTriangle, Upload, X } from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

export default function ComplaintForm() {
  const { user, isAuthenticated, submitComplaint } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [complaintId, setComplaintId] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  // Auto-fill user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName,
        email: user.email
      }));
    }
  }, [isAuthenticated, user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setError('Some files were skipped. Please upload images only (max 5MB each).');
    } else if (error) {
      setError('');
    }

    setUploadedImages(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!isAuthenticated) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Complaint description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission triggered', formData);
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Submit complaint through auth context
      const submittedComplaint = await submitComplaint({
        name: formData.fullName,
        email: formData.email,
        description: formData.description,
        images: uploadedImages,
        userInfo: isAuthenticated ? undefined : {
          fullName: formData.fullName,
          email: formData.email
        }
      });
      
      setComplaintId(submittedComplaint.id);
      setIsSubmitted(true);
      setShowNotification(true);
      
      console.log('Complaint submitted successfully', submittedComplaint);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setError('Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (error) {
      setError('');
    }
  };

  // Notification Popup Component
  const NotificationPopup = () => {
    if (!showNotification) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4" data-testid="notification-popup">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl max-w-md w-full relative animate-in fade-in-50 scale-in-95 duration-300">
          {/* Close button */}
          <button
            onClick={() => setShowNotification(false)}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            data-testid="button-close-notification"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success content */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Complaint Submitted!</h2>
            <p className="text-cyan-200 mb-4">
              Your complaint has been successfully submitted and is now being processed by our AI system.
            </p>
            
            <div className="bg-white/10 border border-white/20 rounded-lg p-4 mb-6">
              <p className="text-white font-medium">Tracking ID:</p>
              <p className="text-cyan-300 text-lg font-mono" data-testid="text-tracking-id">{complaintId}</p>
            </div>

            <div className="flex flex-col gap-3">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button
                    onClick={() => setShowNotification(false)}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white w-full"
                    data-testid="button-view-dashboard"
                  >
                    View Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button
                    onClick={() => setShowNotification(false)}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white w-full"
                    data-testid="button-create-account"
                  >
                    Create Account to Track
                  </Button>
                </Link>
              )}
              <Button
                onClick={() => setShowNotification(false)}
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10"
                data-testid="button-submit-another"
              >
                Submit Another Complaint
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Complaint Submitted!</h2>
            <p className="text-cyan-200 text-lg mb-6">
              Your complaint has been received and will be processed by our AI system within minutes.
            </p>
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <p className="text-white font-medium mb-2">Tracking ID: <span className="text-cyan-300">{complaintId}</span></p>
              {isAuthenticated && (
                <p className="text-cyan-200 text-sm">
                  You can view this complaint anytime in your dashboard.
                </p>
              )}
            </div>
            {isAuthenticated ? (
              <div className="space-y-4">
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
                    <User className="w-4 h-4 mr-2" />
                    View Dashboard
                  </Button>
                </Link>
                <p className="text-white/80 text-sm">
                  You'll receive updates via email as your complaint is processed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-white/80 text-sm mb-4">
                  Create an account to track your complaint's progress and submit future complaints faster.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
                      Create Account
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Lightning-Fast Complaint Submission
          </h2>
          <p className="text-xl text-cyan-200">
            Submit complaints in under 60 seconds with AI assistance
          </p>
        </div>

        {/* Form container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl relative">
          {/* Decorative elements */}
          <div className="absolute -top-3 -left-3 w-6 h-6 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-3 -right-3 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
          
          {/* General error message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
              <span className="text-red-200 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Authentication Banner */}
            {isAuthenticated ? (
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-cyan-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-cyan-400 mr-3" />
                  <div>
                    <p className="text-white font-medium">Signed in as {user?.fullName}</p>
                    <p className="text-cyan-200 text-sm">{user?.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <LogIn className="w-5 h-5 text-cyan-400 mr-3" />
                    <div>
                      <p className="text-white font-medium">Submit faster with an account</p>
                      <p className="text-cyan-200 text-sm">Track your complaints and get updates</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link href="/login">
                      <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information - only show if not authenticated */}
            {!isAuthenticated && (
              <>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-white mb-2">
                    Full Name *
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-cyan-400"
                    placeholder="Enter your full name"
                    data-testid="input-full-name"
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-cyan-400"
                    placeholder="Enter your email address"
                    data-testid="input-email"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </>
            )}

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white mb-2 flex items-center">
                Complaint Description *
                <Sparkles className="w-4 h-4 text-cyan-400 ml-2" />
                <span className="text-xs text-cyan-300 ml-1">AI Assisted</span>
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-cyan-400 min-h-[120px]"
                placeholder="Describe your complaint in detail. Our AI will help categorize and prioritize it."
                data-testid="input-description"
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Upload Images (Optional)
              </label>
              <div className="space-y-4">
                {/* Upload button */}
                <div className="relative">
                  <input
                    type="file"
                    id="image-upload-home"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                    data-testid="input-home-image-upload"
                  />
                  <label
                    htmlFor="image-upload-home"
                    className="flex items-center justify-center w-full p-6 border-2 border-dashed border-white/30 rounded-lg cursor-pointer hover:border-cyan-400 hover:bg-white/5 transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-white/60 mx-auto mb-2" />
                      <p className="text-white/80 font-medium">Click to upload images</p>
                      <p className="text-white/60 text-sm">Max 5 images, 5MB each</p>
                    </div>
                  </label>
                </div>

                {/* Uploaded images preview */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {uploadedImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="bg-white/10 rounded-lg p-2 border border-white/20">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <p className="text-white/80 text-xs mt-1 truncate">{file.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-home-remove-image-${index}`}
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 text-lg font-semibold"
              data-testid="button-form-submit-complaint"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'SUBMIT'
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Notification Popup */}
      <NotificationPopup />
    </section>
  );
}