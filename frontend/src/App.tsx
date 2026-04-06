import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import StoreList from './pages/StoreList';

const RootRedirect = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/login" />;
  
  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" />;
  if (user.role === 'STORE_OWNER') return <Navigate to="/owner/dashboard" />;
  return <Navigate to="/stores" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow p-4 md:p-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/owner/dashboard" element={
                <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                  <StoreOwnerDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/stores" element={
                <ProtectedRoute allowedRoles={['ADMIN', 'USER', 'STORE_OWNER']}>
                  <StoreList />
                </ProtectedRoute>
              } />

              <Route path="/" element={<RootRedirect />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
