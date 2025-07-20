import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRecipe } from '../../../contexts/RecipeContext';
import RecipeCard from './RecipeCard';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import LoadingSpinner from '../../ui/LoadingSpinner';

const RecipeList = () => {
  const { recipes, fetchRecipes, loading } = useRecipe();
  const [filters, setFilters] = useState({
    search: '',
    cuisine: '',
    difficulty: '',
    maxPrepTime: '',
    dietaryTags: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);

  const cuisineOptions = [
    'Italian', 'Mexican', 'Chinese', 'Indian', 'Mediterranean', 
    'Thai', 'Japanese', 'American', 'French', 'Korean'
  ];

  const dietaryOptions = [
    'vegetarian', 'vegan', 'gluten-free', 'keto', 'paleo', 'dairy-free'
  ];

  const loadRecipes = useCallback(async () => {
    const searchParams = {
      ...filters,
      page: currentPage,
      limit: 12
    };
    const result = await fetchRecipes(searchParams);
    if (initialLoading) {
      setInitialLoading(false);
    }
    return result;
  }, [fetchRecipes, filters, currentPage, initialLoading]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      cuisine: '',
      difficulty: '',
      maxPrepTime: '',
      dietaryTags: ''
    });
    setCurrentPage(1);
  }, []);

  const handleFavorite = useCallback(async (recipeId) => {
    console.log('Toggle favorite for recipe:', recipeId);
  }, []);

  // Memoize filtered content to prevent unnecessary re-renders
  const filteredContent = useMemo(() => {
    if (initialLoading || (loading && recipes.length === 0)) {
      return <LoadingSpinner message="Loading recipes..." />;
    }

    if (recipes.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria or clear all filters.</p>
          <Button onClick={clearFilters}>
            Clear All Filters
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes.map(recipe => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            onFavorite={handleFavorite}
          />
        ))}
      </div>
    );
  }, [initialLoading, loading, recipes, clearFilters, handleFavorite]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Recipes</h1>
          
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <Input
                  placeholder="Search recipes..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              <div>
                <select
                  value={filters.cuisine}
                  onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Cuisines</option>
                  {cuisineOptions.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <select
                  value={filters.maxPrepTime}
                  onChange={(e) => handleFilterChange('maxPrepTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Time</option>
                  <option value="15">Under 15min</option>
                  <option value="30">Under 30min</option>
                  <option value="60">Under 1 hour</option>
                  <option value="120">Under 2 hours</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Preferences
              </label>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      const currentTags = filters.dietaryTags.split(',').filter(t => t);
                      const newTags = currentTags.includes(option)
                        ? currentTags.filter(t => t !== option)
                        : [...currentTags, option];
                      handleFilterChange('dietaryTags', newTags.join(','));
                    }}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      filters.dietaryTags.split(',').includes(option)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {recipes.length} recipes found
              </div>
              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="transition-opacity duration-300">
          {filteredContent}
        </div>

        {/* Pagination */}
        {recipes.length > 0 && !loading && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {currentPage}
              </span>
              <Button
                onClick={() => setCurrentPage(prev => prev + 1)}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
