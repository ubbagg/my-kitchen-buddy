import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, HeartIcon } from '../../ui';
import { searchFoodImage, getFoodEmoji } from '../../../assets/unsplashService';

const EnhancedRecipeCard = ({ recipe, onFavorite }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadRecipeImage = async () => {
      setImageLoading(true);
      try {
        const image = await searchFoodImage(recipe.title);
        setImageData(image);
        setImageError(!image);
      } catch (error) {
        console.error('Error loading recipe image:', error);
        setImageError(true);
      } finally {
        setImageLoading(false);
      }
    };

    loadRecipeImage();
  }, [recipe.title]);

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
      case 'easy': return 'from-green-100 to-green-200 text-green-800 border-green-200';
      case 'medium': return 'from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-200';
      case 'hard': return 'from-red-100 to-red-200 text-red-800 border-red-200';
      default: return 'from-gray-100 to-gray-200 text-gray-800 border-gray-200';
    }
  };

  // Gradient variations for cards
  const gradientVariations = [
    'from-blue-50 to-blue-100 border-blue-200',
    'from-purple-50 to-purple-100 border-purple-200',
    'from-pink-50 to-pink-100 border-pink-200',
    'from-indigo-50 to-indigo-100 border-indigo-200',
    'from-teal-50 to-teal-100 border-teal-200',
  ];
  
  const cardGradient = gradientVariations[parseInt(recipe._id.slice(-1), 16) % gradientVariations.length];

  return (
    <div className={`group bg-gradient-to-br ${cardGradient} rounded-xl shadow-sm border hover:shadow-lg hover:-translate-y-[2px] transition-all duration-300 overflow-hidden`}>
      {/* Recipe Image */}
      <div className="h-48 relative overflow-hidden">
        {imageLoading ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        ) : imageData && !imageError ? (
          <img
            src={imageData.url}
            alt={imageData.alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-6xl opacity-70">{getFoodEmoji(recipe.title)}</span>
          </div>
        )}
        
        {/* Image Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Favorite Button - Top Right */}
        <div className="absolute top-3 right-3">
          <HeartIcon
            isLiked={isFavorited}
            onClick={handleFavorite}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 shadow-lg backdrop-blur-sm"
          />
        </div>

        {/* AI Generated Badge */}
        {recipe.isAIGenerated && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-medium rounded-full shadow-lg">
              AI Generated
            </span>
          </div>
        )}

        {/* Photo Credit (if using Unsplash) */}
        {imageData && !imageError && (
          <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a
              href={imageData.photographerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded backdrop-blur-sm"
            >
              Photo by {imageData.photographer}
            </a>
          </div>
        )}
      </div>

      {/* Recipe Content */}
      <div className="p-4 bg-white bg-opacity-60 backdrop-blur-sm">
        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors duration-200">
            {recipe.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Recipe Meta Info */}
        <div className="space-y-3">
          {/* Time and Servings */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-white bg-opacity-70 px-2 py-1 rounded-lg">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatTime((recipe.prepTime || 0) + (recipe.cookTime || 0))}</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-70 px-2 py-1 rounded-lg">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 715.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{recipe.servings} servings</span>
              </div>
            </div>
          </div>

          {/* Tags and Difficulty */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {recipe.cuisine && (
                <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs font-medium rounded-full border border-blue-200">
                  {recipe.cuisine}
                </span>
              )}
              <span className={`px-2 py-1 text-xs font-medium rounded-full border bg-gradient-to-r ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Link to={`/recipe/${recipe._id}`} className="block">
              <Button 
                variant="primary" 
                size="sm" 
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-md"
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

export default EnhancedRecipeCard;
