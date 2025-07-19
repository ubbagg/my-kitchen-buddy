import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipe } from '../../contexts/RecipeContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../Common/Button';
import LoadingSpinner from '../Common/LoadingSpinner';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentRecipe, fetchRecipeById, addToFavorites, removeFromFavorites, loading } = useRecipe();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchRecipe = useCallback(async () => {
    const result = await fetchRecipeById(id);
    if (initialLoading) {
      setInitialLoading(false);
    }
    return result;
  }, [fetchRecipeById, id, initialLoading]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  useEffect(() => {
    if (currentRecipe && user) {
      setIsFavorite(user.favoriteRecipes?.includes(currentRecipe._id) || false);
    }
  }, [currentRecipe, user]);

  const handleFavoriteToggle = async () => {
    if (!currentRecipe) return;

    if (isFavorite) {
      const result = await removeFromFavorites(currentRecipe._id);
      if (result.success) setIsFavorite(false);
    } else {
      const result = await addToFavorites(currentRecipe._id);
      if (result.success) setIsFavorite(true);
    }
  };

  // Show loading only on initial load or when there's no recipe data
  if (initialLoading || (loading && !currentRecipe)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner message="Loading recipe..." />
      </div>
    );
  }

  if (!currentRecipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recipe not found</h2>
          <Button onClick={() => navigate('/recipes')}>
            Back to Recipes
          </Button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const adjustQuantity = (originalQuantity, unit) => {
    const numericQuantity = parseFloat(originalQuantity);
    if (isNaN(numericQuantity)) return originalQuantity;
    
    const adjustedQuantity = numericQuantity * servingMultiplier;
    
    if (adjustedQuantity % 1 === 0) {
      return adjustedQuantity.toString();
    } else {
      return adjustedQuantity.toFixed(2);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-opacity duration-300">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 mr-3">
                    {currentRecipe.title}
                  </h1>
                  {currentRecipe.isAIGenerated && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                      AI Generated
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{currentRecipe.description}</p>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 mr-1">Prep:</span>
                    <span className="text-gray-600">{formatTime(currentRecipe.prepTime || 0)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 mr-1">Cook:</span>
                    <span className="text-gray-600">{formatTime(currentRecipe.cookTime || 0)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 mr-1">Total:</span>
                    <span className="text-gray-600">
                      {formatTime((currentRecipe.prepTime || 0) + (currentRecipe.cookTime || 0))}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 mr-1">Serves:</span>
                    <span className="text-gray-600">{currentRecipe.servings}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(currentRecipe.difficulty)}`}>
                    {currentRecipe.difficulty}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  onClick={handleFavoriteToggle}
                  variant={isFavorite ? "primary" : "outline"}
                  size="sm"
                >
                  {isFavorite ? '❤️ Favorited' : '🤍 Add to Favorites'}
                </Button>
                <Button
                  onClick={() => navigate('/recipes')}
                  variant="secondary"
                  size="sm"
                >
                  Back to Recipes
                </Button>
              </div>
            </div>

            {/* Tags */}
            {currentRecipe.dietaryTags && currentRecipe.dietaryTags.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {currentRecipe.dietaryTags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      {tag}
                    </span>
                  ))}
                  {currentRecipe.cuisine && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      {currentRecipe.cuisine}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Left Column - Ingredients & Nutrition */}
            <div className="space-y-6">
              {/* Serving Adjuster */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Adjust Servings</h3>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => setServingMultiplier(Math.max(0.5, servingMultiplier - 0.5))}
                    variant="outline"
                    size="sm"
                  >
                    -
                  </Button>
                  <span className="font-medium">
                    {Math.round(currentRecipe.servings * servingMultiplier)} servings
                  </span>
                  <Button
                    onClick={() => setServingMultiplier(servingMultiplier + 0.5)}
                    variant="outline"
                    size="sm"
                  >
                    +
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Original recipe serves {currentRecipe.servings}
                </p>
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
                <div className="space-y-2">
                  {currentRecipe.ingredients && currentRecipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-start py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <span className="font-medium text-blue-600">
                          {adjustQuantity(ingredient.quantity, ingredient.unit)} {ingredient.unit}
                        </span>
                        <span className="ml-2 text-gray-900">{ingredient.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nutrition */}
              {currentRecipe.nutrition && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Nutrition (per serving)</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Calories:</span>
                      <span className="ml-1 text-gray-900">{Math.round(currentRecipe.nutrition.calories * servingMultiplier / (currentRecipe.servings || 1))}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Protein:</span>
                      <span className="ml-1 text-gray-900">{Math.round(currentRecipe.nutrition.protein * servingMultiplier / (currentRecipe.servings || 1))}g</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Carbs:</span>
                      <span className="ml-1 text-gray-900">{Math.round(currentRecipe.nutrition.carbs * servingMultiplier / (currentRecipe.servings || 1))}g</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Fat:</span>
                      <span className="ml-1 text-gray-900">{Math.round(currentRecipe.nutrition.fat * servingMultiplier / (currentRecipe.servings || 1))}g</span>
                    </div>
                    {currentRecipe.nutrition.fiber && (
                      <div>
                        <span className="font-medium text-gray-700">Fiber:</span>
                        <span className="ml-1 text-gray-900">{Math.round(currentRecipe.nutrition.fiber * servingMultiplier / (currentRecipe.servings || 1))}g</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Instructions */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Instructions</h3>
              <div className="space-y-4">
                {currentRecipe.instructions && currentRecipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4 mt-1">
                      {index + 1}
                    </div>
                    <p className="text-gray-900 leading-relaxed pt-1">{instruction}</p>
                  </div>
                ))}
              </div>

              {/* Recipe Meta */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    Created by: <strong>{currentRecipe.createdBy?.name || 'Unknown'}</strong>
                  </span>
                  <span>
                    Added: {new Date(currentRecipe.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
