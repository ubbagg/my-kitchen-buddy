import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../ui/Button';
import HeartIcon from '../../ui/HeartIcon';

const RecipeCard = ({ recipe, onFavorite }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    if (onFavorite) {
      onFavorite(recipe._id);
    }
  };

  const formatTime = (minutes) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 hover:-translate-y-[1px] transition-all duration-300 overflow-hidden">      {/* Recipe Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-primary-light to-primary bg-opacity-10 flex items-center justify-center relative">
        <div className="text-6xl opacity-50">🍽️</div>
        
        {/* Favorite Button - Top Right */}
        <div className="absolute top-3 right-3">
          <HeartIcon
            isLiked={isFavorited}
            onClick={handleFavorite}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 shadow-sm"
          />
        </div>

        {/* AI Generated Badge */}
        {recipe.isAIGenerated && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full border border-purple-200">
              ✨ AI Generated
            </span>
          </div>
        )}
      </div>

      {/* Recipe Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title and Description */}
        <div className="flex-1 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {recipe.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Recipe Meta Info */}
        <div className="space-y-3">
          {/* Time and Servings */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatTime((recipe.prepTime || 0) + (recipe.cookTime || 0))}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{recipe.servings} servings</span>
              </div>
            </div>
          </div>

          {/* Tags and Difficulty */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {recipe.cuisine && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded border border-blue-200">
                  {recipe.cuisine}
                </span>
              )}
              <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Link to={`/recipe/${recipe._id}`} className="block">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
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
