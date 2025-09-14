import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, CheckCircle, Upload, X, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

const issueTypes = [
  'Road Maintenance',
  'Street Lighting', 
  'Water Supply',
  'Waste Management',
  'Public Transport',
  'Noise Complaint',
  'Environmental Issues',
  'Public Safety',
  'Other'
];

export default function ComplaintPage() {
  const { user, isAuthenticated, submitComplaint } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: ''
  });
  const [selectedIssueType, setSelectedIssueType] = useState('');
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
        name: user.fullName || '',
        email: user.email || ''
      }));
    }
  }, [isAuthenticated, user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', '/complaint');
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setError('');

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!isAuthenticated) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Please describe your complaint';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const submittedComplaint = await submitComplaint({
        name: formData.name,
        email: formData.email,
        description: formData.description,
        issueType: selectedIssueType || undefined,
        address: '', // You can add address field to your form if needed
        priority: 'medium', // Default priority
        images: uploadedImages,
        userInfo: !isAuthenticated ? {
          fullName: formData.name,
          email: formData.email
        } : undefined
      });
      
      setComplaintId(submittedComplaint.id || submittedComplaint._id);
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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
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
              <Button
                onClick={() => {
                  setShowNotification(false);
                  setLocation('/dashboard');
                }}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                data-testid="button-view-dashboard"
              >
                View Dashboard
              </Button>
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

  if (isSubmitted && !showNotification) {
    return (
      <div className="min-h-screen bg-ecosathi-gradient flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Thank You!</h1>
          <p className="text-xl text-cyan-200 mb-6">Your complaint has been submitted successfully.</p>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 mb-6">
            <p className="text-white font-medium mb-2">Tracking ID:</p>
            <p className="text-cyan-300 text-2xl font-mono" data-testid="text-tracking-id">{complaintId}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white" data-testid="button-view-dashboard">
                View Dashboard
              </Button>
            </Link>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ name: user?.fullName || '', email: user?.email || '', description: '' });
                setUploadedImages([]);
                setSelectedIssueType('');
              }}
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10"
              data-testid="button-submit-another"
            >
              Submit Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ecosathi-gradient py-8 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-400/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
      </div>

      <div className="max-w-2xl mx-auto relative">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 mr-4"
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Submit Complaint</h1>
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
            {isAuthenticated && (
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-cyan-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-cyan-300 mr-2" />
                  <span className="text-white font-medium">Signed in as {user?.fullName}</span>
                </div>
                <p className="text-cyan-200 text-sm mt-1">Your information has been pre-filled for faster processing.</p>
              </div>
            )}

            {/* Name field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Full Name {!isAuthenticated && <span className="text-red-400">*</span>}
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-cyan-400"
                placeholder="Enter your full name"
                required={!isAuthenticated}
                readOnly={isAuthenticated}
                data-testid="input-complaint-name"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address {!isAuthenticated && <span className="text-red-400">*</span>}
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-cyan-400"
                placeholder="Enter your email address"
                required={!isAuthenticated}
                readOnly={isAuthenticated}
                data-testid="input-complaint-email"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Issue Type field */}
            <div>
              <label htmlFor="issueType" className="block text-sm font-medium text-white mb-2">
                Issue Type (Optional)
              </label>
              <select
                id="issueType"
                value={selectedIssueType}
                onChange={(e) => setSelectedIssueType(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                data-testid="select-complaint-issue-type"
              >
                <option value="" className="bg-gray-800">Auto-detect from description</option>
                {issueTypes.map(type => (
                  <option key={type} value={type} className="bg-gray-800">{type}</option>
                ))}
              </select>
              <p className="text-cyan-200/80 text-sm mt-1">
                If not selected, we'll automatically detect the issue type from your description
              </p>
            </div>

            {/* Description field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                Complaint Description <span className="text-red-400">*</span>
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-cyan-400 min-h-[120px] resize-none"
                placeholder="Please describe your complaint in detail. Include keywords like 'urgent' or 'important' to help us prioritize your request..."
                required
                data-testid="input-complaint-description"
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
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                    data-testid="input-image-upload"
                  />
                  <label
                    htmlFor="image-upload"
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
                          data-testid={`button-remove-image-${index}`}
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
              data-testid="button-complaint-submit"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Submit Complaint
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Notification Popup */}
      <NotificationPopup />
    </div>
  );
}