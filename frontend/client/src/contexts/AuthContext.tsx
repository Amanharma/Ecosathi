import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In-memory storage for users and sessions
interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  password: string; // In production, this would be hashed
  createdAt: string;
}

class AuthStorage {
  private users: Map<string, StoredUser> = new Map();
  private sessions: Map<string, string> = new Map(); // sessionId -> userId
  private complaints: Map<string, Complaint> = new Map(); // complaintId -> complaint
  private userComplaints: Map<string, string[]> = new Map(); // userId -> complaintIds[]
  
  // Initialize with some demo users and complaints
  constructor() {
    this.addUser({
      fullName: 'Demo User',
      email: 'demo@ecosathi.com',
      password: 'demo123',
      id: '1',
      createdAt: new Date().toISOString()
    });

    // Add some demo complaints for the demo user
    this.addComplaint({
      id: '1',
      title: 'Product Quality Issue',
      description: 'The product I received was damaged and not working properly.',
      status: 'in_progress',
      priority: 'high',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-16T14:20:00Z',
      userId: '1'
    });

    this.addComplaint({
      id: '2', 
      title: 'Service Delay',
      description: 'My service request has been pending for over a week without any response.',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-17T16:45:00Z',
      userId: '1'
    });

    this.addComplaint({
      id: '3',
      title: 'Billing Error', 
      description: 'I was charged twice for the same transaction.',
      status: 'pending',
      priority: 'high',
      createdAt: '2024-01-18T11:20:00Z',
      updatedAt: '2024-01-18T11:20:00Z',
      userId: '1'
    });
  }

  private addUser(user: StoredUser) {
    this.users.set(user.email.toLowerCase(), user);
  }

  findUserByEmail(email: string): StoredUser | undefined {
    return this.users.get(email.toLowerCase());
  }

  createUser(data: SignupData): StoredUser | null {
    const email = data.email.toLowerCase();
    if (this.users.has(email)) {
      return null; // User already exists
    }

    const newUser: StoredUser = {
      id: Math.random().toString(36).substring(2, 15),
      fullName: data.fullName,
      email,
      password: data.password, // In production, hash this
      createdAt: new Date().toISOString()
    };

    this.addUser(newUser);
    return newUser;
  }

  validateCredentials(email: string, password: string): StoredUser | null {
    const user = this.findUserByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  createSession(userId: string): string {
    const sessionId = Math.random().toString(36).substring(2, 15);
    this.sessions.set(sessionId, userId);
    return sessionId;
  }

  getUserFromSession(sessionId: string): StoredUser | null {
    const userId = this.sessions.get(sessionId);
    if (!userId) return null;

    const users = Array.from(this.users.values());
    return users.find(user => user.id === userId) || null;
  }

  destroySession(sessionId: string) {
    this.sessions.delete(sessionId);
  }

  private addComplaint(complaint: Complaint) {
    this.complaints.set(complaint.id, complaint);
    if (complaint.userId) {
      const userComplaints = this.userComplaints.get(complaint.userId) || [];
      userComplaints.push(complaint.id);
      this.userComplaints.set(complaint.userId, userComplaints);
    }
  }

  createComplaint(data: ComplaintSubmission, userId?: string): Complaint {
    // Process image uploads (simulate storing them)
    const imageNames = data.images?.map(file => 
      `${Date.now()}_${Math.random().toString(36).substring(2, 15)}_${file.name}`
    ) || [];

    // Generate title if not provided
    const title = data.title || this.generateTitle(data.description);
    
    // Handle user info for non-authenticated users
    const userInfo = userId ? undefined : (data.userInfo || {
      fullName: data.name || '',
      email: data.email || ''
    });

    const complaint: Complaint = {
      id: Math.random().toString(36).substring(2, 15),
      title,
      description: data.description,
      status: 'pending',
      priority: this.determinePriority(data.description),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: userId,
      images: imageNames.length > 0 ? imageNames : undefined,
      userInfo
    };

    this.addComplaint(complaint);
    return complaint;
  }

  private generateTitle(description: string): string {
    const words = description.split(' ').slice(0, 5);
    let title = words.join(' ');
    if (description.split(' ').length > 5) {
      title += '...';
    }
    return title || 'General Complaint';
  }

  getUserComplaints(userId: string): Complaint[] {
    const complaintIds = this.userComplaints.get(userId) || [];
    return complaintIds
      .map(id => this.complaints.get(id))
      .filter((complaint): complaint is Complaint => complaint !== undefined)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  private determinePriority(description: string): 'low' | 'medium' | 'high' {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('urgent') || lowerDesc.includes('emergency') || lowerDesc.includes('critical')) {
      return 'high';
    }
    if (lowerDesc.includes('important') || lowerDesc.includes('asap') || lowerDesc.includes('soon')) {
      return 'medium';
    }
    return 'low';
  }
}

const authStorage = new AuthStorage();

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const sessionId = localStorage.getItem('ecosathi_session');
    if (sessionId) {
      const storedUser = authStorage.getUserFromSession(sessionId);
      if (storedUser) {
        setUser({
          id: storedUser.id,
          fullName: storedUser.fullName,
          email: storedUser.email,
          createdAt: storedUser.createdAt
        });
      } else {
        localStorage.removeItem('ecosathi_session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Attempting login for:', email);
    
    const storedUser = authStorage.validateCredentials(email, password);
    if (storedUser) {
      const sessionId = authStorage.createSession(storedUser.id);
      localStorage.setItem('ecosathi_session', sessionId);
      
      setUser({
        id: storedUser.id,
        fullName: storedUser.fullName,
        email: storedUser.email,
        createdAt: storedUser.createdAt
      });
      
      console.log('Login successful for:', email);
      return true;
    }
    
    console.log('Login failed for:', email);
    return false;
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    console.log('Attempting signup for:', data.email);
    
    const newUser = authStorage.createUser(data);
    if (newUser) {
      const sessionId = authStorage.createSession(newUser.id);
      localStorage.setItem('ecosathi_session', sessionId);
      
      setUser({
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        createdAt: newUser.createdAt
      });
      
      console.log('Signup successful for:', data.email);
      return true;
    }
    
    console.log('Signup failed for:', data.email);
    return false;
  };

  const logout = () => {
    console.log('Logging out user:', user?.email);
    const sessionId = localStorage.getItem('ecosathi_session');
    if (sessionId) {
      authStorage.destroySession(sessionId);
      localStorage.removeItem('ecosathi_session');
    }
    setUser(null);
  };

  const submitComplaint = async (data: ComplaintSubmission): Promise<Complaint> => {
    console.log('Submitting complaint:', data);
    
    const complaint = authStorage.createComplaint(data, user?.id);
    console.log('Complaint submitted:', complaint);
    
    return complaint;
  };

  const getUserComplaints = (): Complaint[] => {
    if (!user) return [];
    return authStorage.getUserComplaints(user.id);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    submitComplaint,
    getUserComplaints
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