import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Common/Button';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-6xl mb-6">🍳</div>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            AI-Powered Recipe Generator
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Discover personalized recipes based on your ingredients, dietary preferences, and nutritional goals. 
            Upload photos of your ingredients and let AI create amazing meals for you.
          </p>
          
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl mb-4">📸</div>
              <h3 className="text-lg font-medium text-gray-900">Upload Ingredients</h3>
              <p className="mt-2 text-gray-600">
                Take photos of your ingredients and let AI identify them automatically
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-lg font-medium text-gray-900">AI Recipe Generation</h3>
              <p className="mt-2 text-gray-600">
                Get personalized recipes based on your preferences and dietary restrictions
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900">Meal Planning</h3>
              <p className="mt-2 text-gray-600">
                Plan your week with automatic shopping lists and nutrition tracking
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;