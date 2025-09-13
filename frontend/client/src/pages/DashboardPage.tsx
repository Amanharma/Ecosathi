import { useAuth, Complaint } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, FileText, Clock, CheckCircle, AlertTriangle, User, LogOut, Plus } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export default function DashboardPage() {
  const { user, logout, getUserComplaints } = useAuth();
  const [, setLocation] = useLocation();
  
  // Get user's complaints from the auth context
  const complaints = getUserComplaints();

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <AlertTriangle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-ecosathi-gradient">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-lg">Ecosathi</span>
                  <span className="text-cyan-200 text-xs font-medium">NEXT GENERATION BLOCKCHAIN</span>
                </div>
              </div>
            </Link>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-white font-medium">{user?.fullName}</div>
                  <div className="text-cyan-200 text-sm">{user?.email}</div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-white border-white/30 hover:bg-white/10"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome back, {user?.fullName?.split(' ')[0]}!
          </h1>
          <p className="text-xl text-cyan-200 mb-6">
            Manage your complaints and track their progress with AI-powered insights.
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-200 text-sm font-medium">Total Complaints</p>
                  <p className="text-3xl font-bold text-white">{complaints.length}</p>
                </div>
                <FileText className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-200 text-sm font-medium">In Progress</p>
                  <p className="text-3xl font-bold text-white">
                    {complaints.filter(c => c.status === 'in_progress').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-200 text-sm font-medium">Resolved</p>
                  <p className="text-3xl font-bold text-white">
                    {complaints.filter(c => c.status === 'resolved').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Complaints section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Your Complaints</h2>
          <Link href="/#complaint-form">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
              <Plus className="w-4 h-4 mr-2" />
              New Complaint
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {complaints.map((complaint) => (
            <Card key={complaint.id} className="bg-white/10 backdrop-blur-lg border-white/20 shadow-lg hover-elevate">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-white">{complaint.title}</CardTitle>
                  <CardDescription className="text-cyan-200">
                    ID: {complaint.id} • Created {formatDate(complaint.createdAt)}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getPriorityColor(complaint.priority)} border`}>
                    {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                  </Badge>
                  <Badge className={`${getStatusColor(complaint.status)} border flex items-center space-x-1`}>
                    {getStatusIcon(complaint.status)}
                    <span>{complaint.status.replace('_', ' ').toUpperCase()}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4">{complaint.description}</p>
                <div className="flex justify-between items-center text-sm text-cyan-200">
                  <span>Last updated: {formatDate(complaint.updatedAt)}</span>
                  <Button variant="outline" size="sm" className="text-cyan-300 border-cyan-300/30 hover:bg-cyan-300/10">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {complaints.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No complaints yet</h3>
            <p className="text-cyan-200 mb-6">Submit your first complaint to get started with AI-powered resolution.</p>
            <Link href="/#complaint-form">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
                <Plus className="w-4 h-4 mr-2" />
                Submit Your First Complaint
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}