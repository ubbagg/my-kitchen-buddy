import React, { useState, useEffect } from 'react';
import { useRecipe } from '../../../contexts/RecipeContext';
import { Button, Input, LoadingSpinner } from '../../ui';
import EnhancedRecipeCard from './EnhancedRecipeCard';

const BrowseRecipes = () => {
  const { recipes, fetchRecipes, loading } = useRecipe();
  const [filters, setFilters] = useState({
    search: '',
    cuisine: '',
    difficulty: '',
    maxTime: '',
    sortBy: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRecipes(filters);
  }, [filters, fetchRecipes]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      cuisine: '',
      difficulty: '',
      maxTime: '',
      sortBy: 'newest'
    });
  };

  const cuisineOptions = [
    'Italian', 'Chinese', 'Mexican', 'Indian', 'Japanese', 'French', 
    'Thai', 'Mediterranean', 'American', 'Korean'
  ];

  const filteredRecipes = recipes.filter(recipe => {
    if (filters.search && !recipe.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.cuisine && recipe.cuisine !== filters.cuisine) {
      return false;
    }
    if (filters.difficulty && recipe.difficulty !== filters.difficulty) {
      return false;
    }
    if (filters.maxTime) {
      const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
      if (totalTime > parseInt(filters.maxTime)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Recipes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of delicious recipes from around the world
          </p>
        </div>

        {/* Enhanced Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search recipes... (e.g., pasta, chicken curry, chocolate cake)"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="text-lg"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="whitespace-nowrap"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                </svg>
                Filters {Object.values(filters).filter(v => v && v !== 'newest').length > 0 && `(${Object.values(filters).filter(v => v && v !== 'newest').length})`}
              </Button>
              {Object.values(filters).some(v => v && v !== 'newest') && (
                <Button onClick={clearFilters} variant="ghost" size="sm">
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              {/* Cuisine Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
                <select
                  value={filters.cuisine}
                  onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">All Cuisines</option>
                  {cuisineOptions.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Max Time Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Time</label>
                <select
                  value={filters.maxTime}
                  onChange={(e) => handleFilterChange('maxTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Any Time</option>
                  <option value="30">Under 30 min</option>
                  <option value="60">Under 1 hour</option>
                  <option value="120">Under 2 hours</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="difficulty">Difficulty</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold text-gray-900">{filteredRecipes.length}</span> recipes
          </p>
          {filters.search && (
            <p className="text-sm text-gray-500">
              Searching for "<span className="font-medium">{filters.search}</span>"
            </p>
          )}
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <LoadingSpinner fullScreen message="Loading delicious recipes..." />
        ) : filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <EnhancedRecipeCard
                key={recipe._id}
                recipe={recipe}
                onFavorite={(id) => console.log('Favorited recipe:', id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find more recipes.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseRecipes;
