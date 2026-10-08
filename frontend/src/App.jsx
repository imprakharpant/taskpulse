import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute';
import { Navbar } from './components/layout/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { NotFound } from './pages/NotFound';

const AppLayout = ({ children }) => (
  <div className="min-h-screen bg-slate-950">
    <Navbar />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes: redirect to dashboard if already logged in */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Routes: redirect to login if not authenticated */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={<AppLayout><Dashboard /></AppLayout>}
            />
            <Route
              path="/projects"
              element={<AppLayout><Projects /></AppLayout>}
            />
            <Route
              path="/projects/:id"
              element={<AppLayout><ProjectDetail /></AppLayout>}
            />
          </Route>

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
