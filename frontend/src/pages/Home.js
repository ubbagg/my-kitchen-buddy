import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { FaCamera, FaRobot, FaCalendarAlt, FaUtensils } from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        {/* Enhanced Hero Section */}
        <div className="text-center animate-fade-in">
          {/* Logo/Brand Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                <FaUtensils className="text-3xl sm:text-4xl text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
            </div>
          </div>

          {/* Main Headlines */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Your Personal{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Chef
              </span>
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl sm:text-2xl text-gray-700 font-medium mb-4">
                Transform any ingredient into delicious recipes
              </p>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Upload photos of your ingredients and get personalized recipes instantly. 
                Plan meals, generate shopping lists, and discover new flavors with the power of AI.
              </p>
            </div>
          </div>

          {/* Enhanced Call-to-Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {isAuthenticated ? (
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                  <FaUtensils className="mr-2" />
                  Go to Kitchen Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                    <FaUtensils className="mr-2" />
                    Start Cooking with AI
                  </Button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-2 border-gray-300 text-gray-700 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Trust Indicators / Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">10K+</div>
              <div className="text-sm text-gray-600">Recipes Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">500+</div>
              <div className="text-sm text-gray-600">Happy Cooks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">50+</div>
              <div className="text-sm text-gray-600">Cuisines Supported</div>
            </div>
          </div>
        </div>

        {/* Enhanced Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <FaCamera className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Ingredient Detection</h3>
            <p className="text-gray-600 leading-relaxed">
              Just snap a photo! Our AI instantly recognizes ingredients and suggests the perfect recipes to match.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100 hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <FaRobot className="text-2xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalized Recipes</h3>
            <p className="text-gray-600 leading-relaxed">
              Get custom recipes that fit your dietary preferences, skill level, and available cooking time.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100 hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <FaCalendarAlt className="text-2xl text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Complete Meal Planning</h3>
            <p className="text-gray-600 leading-relaxed">
              Plan your entire week with automatic shopping lists, nutrition tracking, and meal prep guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Add required CSS animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Home;
