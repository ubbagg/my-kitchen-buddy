import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Button from '../components/Common/Button';

const Dashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Generate Recipe',
      description: 'Upload ingredients or describe what you have',
      icon: '🍳',
      link: '/generate-recipe',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Browse Recipes',
      description: 'Explore all available recipes',
      icon: '📚',
      link: '/recipes',
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Meal Planner',
      description: 'Plan your weekly meals',
      icon: '📅',
      link: '/meal-planner',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      title: 'Shopping List',
      description: 'View and manage your shopping list',
      icon: '🛒',
      link: '/shopping-list',
      color: 'bg-yellow-50 border-yellow-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            What would you like to cook today?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link}>
              <div className={`${action.color} border-2 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer`}>
                <div className="text-3xl mb-3">{action.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Recipes</h2>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl mr-3">🍝</div>
                  <div>
                    <h3 className="font-medium">Creamy Pasta Primavera</h3>
                    <p className="text-sm text-gray-600">Generated 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl mr-3">🥗</div>
                  <div>
                    <h3 className="font-medium">Mediterranean Salad</h3>
                    <p className="text-sm text-gray-600">Generated yesterday</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/recipes">
                  <Button variant="outline" size="sm">
                    View All Recipes
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Preferences</h2>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">Dietary:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.dietaryPreferences?.length > 0 ? (
                      user.dietaryPreferences.map(pref => (
                        <span key={pref} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {pref}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">None set</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Allergies:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.allergies?.length > 0 ? (
                      user.allergies.map(allergy => (
                        <span key={allergy} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          {allergy}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">None set</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">This Week's Plan</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Monday</span>
                  <span className="text-sm text-gray-600">Pasta Primavera</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tuesday</span>
                  <span className="text-sm text-gray-600">Mediterranean Salad</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Wednesday</span>
                  <span className="text-sm text-gray-500">Not planned</span>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/meal-planner">
                  <Button variant="outline" size="sm">
                    Plan Meals
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;