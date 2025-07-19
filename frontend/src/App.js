import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RecipeProvider } from './contexts/RecipeContext';
import { MealPlanProvider } from './contexts/MealPlanContext';
import { ShoppingListProvider } from './contexts/ShoppingListContext';
import Header from './components/Layout/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import RecipeGenerator from './components/Recipe/RecipeGenerator';
import RecipeDetail from './components/Recipe/RecipeDetail';
import RecipeList from './components/Recipe/RecipeList';
import MealPlanner from './components/MealPlan/MealPlanner';
import ShoppingList from './components/ShoppingList/ShoppingList';

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
      <RecipeProvider>
        <MealPlanProvider>
          <ShoppingListProvider>
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
                  <Route 
                    path="/generate-recipe" 
                    element={
                      <ProtectedRoute>
                        <RecipeGenerator />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/recipes" 
                    element={
                      <ProtectedRoute>
                        <RecipeList />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/recipe/:id" 
                    element={
                      <ProtectedRoute>
                        <RecipeDetail />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/meal-planner" 
                    element={
                      <ProtectedRoute>
                        <MealPlanner />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/shopping-list" 
                    element={
                      <ProtectedRoute>
                        <ShoppingList />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </div>
            </Router>
          </ShoppingListProvider>
        </MealPlanProvider>
      </RecipeProvider>
    </AuthProvider>
  );
}

export default App;
