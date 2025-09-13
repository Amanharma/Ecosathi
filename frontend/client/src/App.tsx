import { Router, Route } from 'wouter';
import { AuthProvider } from '@/contexts/AuthContext';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import DashboardPage from '@/pages/DashboardPage';
import ComplaintPage from '@/pages/ComplaintPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotFound from '@/pages/not-found';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Route path="/" component={HomePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/dashboard">
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        </Route>
        <Route path="/complaint">
          <ProtectedRoute>
            <ComplaintPage />
          </ProtectedRoute>
        </Route>
        {/* Catch-all route for 404 - this should be last */}
        <Route path="/:rest*" component={NotFound} />
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;