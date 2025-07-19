import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            {/* Placeholder routes for now */}
            <Route 
              path="/recipes" 
              element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Recipes Page</h1>
                    <p className="mt-4">Coming in Day 2!</p>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/generate-recipe" 
              element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Generate Recipe</h1>
                    <p className="mt-4">Coming in Day 3!</p>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/meal-planner" 
              element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Meal Planner</h1>
                    <p className="mt-4">Coming in Day 3!</p>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/shopping-list" 
              element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Shopping List</h1>
                    <p className="mt-4">Coming in Day 3!</p>
                  </div>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;