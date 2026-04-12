import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Marketplace from './pages/Marketplace';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import Ratings from './pages/Ratings';
import Rewards from './pages/Rewards';

// Layout with Navbar
const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen text-slate-800 flex flex-col">
      <nav className="glass-card m-4 px-6 py-4 flex justify-between items-center rounded-2xl sticky top-4 z-50">
        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500 tracking-tight">
          SkillSwap
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600 mr-4">
                <Link to="/dashboard" className="hover:text-primary-600 transition-colors">Dashboard</Link>
                <Link to="/marketplace" className="hover:text-primary-600 transition-colors">Marketplace</Link>
                <Link to="/matches" className="hover:text-primary-600 transition-colors">Matches</Link>
                <Link to="/chat" className="hover:text-primary-600 transition-colors">Chat</Link>
                <Link to="/rewards" className="hover:text-primary-600 transition-colors">Rewards</Link>
                <Link to="/profile" className="hover:text-primary-600 transition-colors">Profile</Link>
              </div>
              <span className="font-bold text-slate-800 border-l border-slate-300 pl-4">Hey, {user.name.split(' ')[0]}</span>
              <button onClick={logout} className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Logout</button>
            </>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="px-4 py-2 font-medium text-primary-600 hover:bg-white/50 rounded-xl transition-colors">Log In</Link>
              <Link to="/register" className="px-4 py-2 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-500 transition-colors shadow-md">Sign Up</Link>
            </div>
          )}
        </div>
      </nav>
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
            <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
            <Route path="/rate" element={<ProtectedRoute><Ratings /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
