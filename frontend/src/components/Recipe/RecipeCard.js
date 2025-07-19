import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Common/Button';

const RecipeCard = ({ recipe, onFavorite }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {recipe.title}
          </h3>
          {recipe.isAIGenerated && (
            <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              AI
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              ⏱️ {formatTime((recipe.prepTime || 0) + (recipe.cookTime || 0))}
            </span>
            <span className="flex items-center">
              👥 {recipe.servings || 'N/A'} servings
            </span>
          </div>
          
          <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty || 'medium'}
          </span>
        </div>

        {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {recipe.dietaryTags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {tag}
              </span>
            ))}
            {recipe.dietaryTags.length > 3 && (
              <span className="text-xs text-gray-500">+{recipe.dietaryTags.length - 3} more</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            by {recipe.createdBy?.name || 'Unknown'}
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={() => onFavorite(recipe._id)}
              variant="outline"
              size="sm"
            >
              ❤️
            </Button>
            <Link to={`/recipe/${recipe._id}`}>
              <Button size="sm">
                View Recipe
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
