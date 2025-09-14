import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, createComplaint, getMyComplaints } from '@/utils/api.js';

export interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  name?: string; // Backend uses 'name' field
  role?: string; // Backend includes role information
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  userId?: string;
  images?: string[]; // Store image names/paths
  userInfo?: {
    fullName: string;
    email: string;
  };
  // Backend fields
  _id?: string;
  issueType?: string;
  address?: string;
  location?: {
    type: string;
    coordinates: number[];
  };
  image?: string; // Backend single image field
  user?: string; // Backend user reference
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
}

export interface ComplaintSubmission {
  name?: string;
  email?: string;
  title?: string;
  description: string;
  images?: File[];
  userInfo?: {
    fullName: string;
    email: string;
  };
  // Additional backend fields
  issueType?: string;
  address?: string;
  longitude?: string;
  latitude?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  submitComplaint: (data: ComplaintSubmission) => Promise<Complaint>;
  getUserComplaints: () => Complaint[];
  refreshComplaints: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    // Check for existing session on app load
    const token = localStorage.getItem('ecosathi_token');
    const savedUser = localStorage.getItem('ecosathi_user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Ensure fullName exists for compatibility
        if (!parsedUser.fullName && parsedUser.name) {
          parsedUser.fullName = parsedUser.name;
        }
        setUser(parsedUser);
        // Load user's complaints
        loadUserComplaints();
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('ecosathi_token');
        localStorage.removeItem('ecosathi_user');
      }
    }
    setIsLoading(false);
  }, []);

  const loadUserComplaints = async () => {
    try {
      const response = await getMyComplaints();
      if (response.complaints) {
        const transformedComplaints = transformBackendComplaints(response.complaints);
        setComplaints(transformedComplaints);
      }
    } catch (error) {
      console.error('Error loading user complaints:', error);
      setComplaints([]);
    }
  };

  const transformBackendComplaints = (backendComplaints: any[]): Complaint[] => {
    return backendComplaints.map((complaint: any) => ({
      id: complaint._id,
      _id: complaint._id,
      title: complaint.issueType || generateTitle(complaint.description),
      description: complaint.description,
      status: mapBackendStatus(complaint.status),
      priority: complaint.priority || 'medium',
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
      userId: complaint.user,
      user: complaint.user,
      issueType: complaint.issueType,
      address: complaint.address,
      location: complaint.location,
      image: complaint.image,
      images: complaint.image ? [complaint.image] : undefined
    }));
  };

  const mapBackendStatus = (backendStatus: string): 'pending' | 'in_progress' | 'resolved' | 'rejected' => {
    switch (backendStatus) {
      case 'in-progress':
        return 'in_progress';
      case 'pending':
        return 'pending';
      case 'resolved':
        return 'resolved';
      default:
        return 'pending';
    }
  };

  const generateTitle = (description: string): string => {
    const words = description.split(' ').slice(0, 5);
    let title = words.join(' ');
    if (description.split(' ').length > 5) {
      title += '...';
    }
    return title || 'General Complaint';
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Attempting login for:', email);
    
    try {
      const response = await loginUser({ email, password });
      
      if (response.token && response.user) {
        // Store token and user data
        localStorage.setItem('ecosathi_token', response.token);
        
        // Transform user data for compatibility
        const userData: User = {
          id: response.user.id,
          fullName: response.user.name || response.user.fullName,
          name: response.user.name,
          email: response.user.email,
          createdAt: response.user.createdAt || new Date().toISOString(),
          role: response.user.role
        };
        
        localStorage.setItem('ecosathi_user', JSON.stringify(userData));
        setUser(userData);
        
        // Load user's complaints
        await loadUserComplaints();
        
        console.log('Login successful for:', email);
        return true;
      }
      
      console.log('Login failed for:', email, response.msg);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    console.log('Attempting signup for:', data.email);
    
    try {
      // Map frontend data to backend format
      const signupData = {
        name: data.fullName,
        email: data.email,
        password: data.password
      };
      
      const response = await registerUser(signupData);
      
      if (response.user) {
        // After successful registration, log the user in
        const loginSuccess = await login(data.email, data.password);
        console.log('Signup successful for:', data.email);
        return loginSuccess;
      }
      
      console.log('Signup failed for:', data.email, response.msg);
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('Logging out user:', user?.email);
    localStorage.removeItem('ecosathi_token');
    localStorage.removeItem('ecosathi_user');
    setUser(null);
    setComplaints([]);
  };

  const submitComplaint = async (data: ComplaintSubmission): Promise<Complaint> => {
    console.log('Submitting complaint:', data);
    
    try {
      // Create FormData for file upload support
      const formData = new FormData();
      
      // Add required fields
      formData.append('description', data.description);
      
      // Add optional fields
      if (data.issueType) {
        formData.append('issueType', data.issueType);
      } else {
        // Auto-detect issue type from description
        const detectedIssueType = determineIssueType(data.description);
        formData.append('issueType', detectedIssueType);
      }
      
      if (data.address) formData.append('address', data.address);
      if (data.longitude) formData.append('longitude', data.longitude);
      if (data.latitude) formData.append('latitude', data.latitude);
      if (data.priority) formData.append('priority', data.priority);
      
      // Add image if provided (backend expects single image)
      if (data.images && data.images.length > 0) {
        formData.append('image', data.images[0]);
      }
      
      const response = await createComplaint(formData);
      
      if (response.complaint) {
        // Transform backend response to frontend format
        const transformedComplaint: Complaint = {
          id: response.complaint._id,
          _id: response.complaint._id,
          title: response.complaint.issueType || generateTitle(response.complaint.description),
          description: response.complaint.description,
          status: mapBackendStatus(response.complaint.status),
          priority: response.complaint.priority || 'medium',
          createdAt: response.complaint.createdAt,
          updatedAt: response.complaint.updatedAt,
          userId: response.complaint.user,
          user: response.complaint.user,
          issueType: response.complaint.issueType,
          address: response.complaint.address,
          location: response.complaint.location,
          image: response.complaint.image,
          images: response.complaint.image ? [response.complaint.image] : undefined,
          userInfo: user ? undefined : data.userInfo
        };
        
        // Add to local complaints list
        setComplaints(prev => [transformedComplaint, ...prev]);
        
        console.log('Complaint submitted:', transformedComplaint);
        return transformedComplaint;
      }
      
      throw new Error('Failed to submit complaint');
    } catch (error) {
      console.error('Submit complaint error:', error);
      throw error;
    }
  };

  const determineIssueType = (description: string): string => {
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('road') || lowerDesc.includes('street') || lowerDesc.includes('pothole')) {
      return 'Road Maintenance';
    } else if (lowerDesc.includes('light') || lowerDesc.includes('lamp') || lowerDesc.includes('dark')) {
      return 'Street Lighting';
    } else if (lowerDesc.includes('water') || lowerDesc.includes('pipe') || lowerDesc.includes('leak')) {
      return 'Water Supply';
    } else if (lowerDesc.includes('garbage') || lowerDesc.includes('waste') || lowerDesc.includes('trash')) {
      return 'Waste Management';
    } else if (lowerDesc.includes('bus') || lowerDesc.includes('transport') || lowerDesc.includes('traffic')) {
      return 'Public Transport';
    } else if (lowerDesc.includes('noise') || lowerDesc.includes('loud') || lowerDesc.includes('sound')) {
      return 'Noise Complaint';
    } else if (lowerDesc.includes('environment') || lowerDesc.includes('pollution') || lowerDesc.includes('air')) {
      return 'Environmental Issues';
    } else if (lowerDesc.includes('safety') || lowerDesc.includes('security') || lowerDesc.includes('danger')) {
      return 'Public Safety';
    }
    
    return 'Other';
  };

  const getUserComplaints = (): Complaint[] => {
    return complaints;
  };

  const refreshComplaints = async () => {
    if (user) {
      await loadUserComplaints();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    submitComplaint,
    getUserComplaints,
    refreshComplaints
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}