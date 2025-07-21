import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipe } from '../../../contexts/RecipeContext';
import { Button, LoadingSpinner, HeartIcon } from '../../ui';
import { searchFoodImage, getFoodEmoji } from '../../../assets/unsplashService';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentRecipe, fetchRecipeById, loading } = useRecipe();
  const [imageData, setImageData] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState('instructions');
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [servings, setServings] = useState(1);
  const [userAdjustedServings, setUserAdjustedServings] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRecipeById(id);
    }
  }, [id, fetchRecipeById]);

  useEffect(() => {
    if (currentRecipe && !userAdjustedServings) {
      setServings(currentRecipe.servings || 1);
    }
  }, [currentRecipe, userAdjustedServings]);

  // Reset user adjustment flag when recipe changes
  useEffect(() => {
    if (currentRecipe) {
      setUserAdjustedServings(false);
    }
  }, [currentRecipe]); // ✅ Fixed

  useEffect(() => {
    const loadRecipeImage = async () => {
      if (!currentRecipe || !currentRecipe.title) return;
      
      if (imageData && !imageError) return;
      
      setImageLoading(true);
      setImageError(false);

      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Image loading timeout')), 8000)
        );
        const imagePromise = searchFoodImage(currentRecipe.title);
        const image = await Promise.race([imagePromise, timeoutPromise]);
        
        setImageData(image);
        setImageError(!image);
      } catch (error) {
        console.error('Error loading recipe image:', error);
        setImageError(true);
        setImageData(null);
      } finally {
        setImageLoading(false);
      }
    };

    if (currentRecipe) {
      const timer = setTimeout(() => {
        loadRecipeImage();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [currentRecipe, imageData, imageError]); // ✅ Fixed

  const toggleStepComplete = (stepIndex) => {
    const newCompletedSteps = new Set(completedSteps);
    if (newCompletedSteps.has(stepIndex)) {
      newCompletedSteps.delete(stepIndex);
    } else {
      newCompletedSteps.add(stepIndex);
    }
    setCompletedSteps(newCompletedSteps);
  };

  const adjustServings = (newServings) => {
    console.log('Adjusting servings from', servings, 'to', newServings);
    if (newServings > 0 && newServings <= 20) {
      setServings(newServings);
      setUserAdjustedServings(true); // Mark that user has made adjustments
      console.log('Servings updated to:', newServings);
    } else {
      console.log('Invalid serving size:', newServings);
    }
  };

  const getAdjustedQuantity = (originalQuantity, originalServings) => {
    const safeOriginalServings = originalServings && originalServings > 0 ? originalServings : 1;
    const ratio = servings / safeOriginalServings;
    const numericQuantity = parseFloat(originalQuantity);

    if (isNaN(numericQuantity)) return originalQuantity;

    const adjusted = numericQuantity * ratio;

    if (adjusted % 1 === 0) return adjusted.toString();
    if (adjusted < 1) return adjusted.toFixed(2).replace(/\.?0+$/, '');
    return adjusted.toFixed(1).replace(/\.0$/, '');
  };

  const formatTime = (minutes) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const getDisplayUnit = (unit, ingredientName) => {
    if (unit && unit.trim()) return unit;
    
    const name = ingredientName.toLowerCase();
    if (name.includes('water') || name.includes('milk') || name.includes('juice')) return 'cup';
    if (name.includes('sugar') || name.includes('salt') || name.includes('pepper')) return 'tsp';
    if (name.includes('flour') || name.includes('powder')) return 'cup';
    if (name.includes('oil') || name.includes('vinegar')) return 'tbsp';
    
    return 'piece';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'from-green-100 to-green-200 text-green-800 border-green-200';
      case 'medium': return 'from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-200';
      case 'hard': return 'from-red-100 to-red-200 text-red-800 border-red-200';
      default: return 'from-gray-100 to-gray-200 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading recipe details..." />;
  }

  if (!currentRecipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-4xl mb-4">🤔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recipe not found</h2>
          <p className="text-gray-600 mb-4">The recipe you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/recipes')}>
            Browse All Recipes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section - Responsive Height */}
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
        {imageLoading ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
            <div className="text-gray-400 text-sm sm:text-base md:text-lg">Loading image...</div>
          </div>
        ) : imageData && !imageError ? (
          <img
            src={imageData.url}
            alt={imageData.alt}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
            <span className="text-4xl sm:text-5xl md:text-6xl">{getFoodEmoji(currentRecipe.title)}</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Navigation Controls - Responsive */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost"
            size="sm"
            className="bg-white bg-opacity-90 hover:bg-opacity-100 shadow-lg backdrop-blur-sm text-xs sm:text-sm"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </Button>
        </div>

        <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
          <HeartIcon
            isLiked={isFavorited}
            onClick={() => setIsFavorited(!isFavorited)}
            size="base"
            className="bg-white bg-opacity-90 hover:bg-opacity-100 shadow-lg backdrop-blur-sm p-2 sm:p-3"
          />
        </div>

        {/* Photo Credit - Responsive */}
        {imageData && !imageError && (
          <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2">
            <a
              href={imageData.photographerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-xs bg-black bg-opacity-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded backdrop-blur-sm hover:bg-opacity-70 transition-all duration-200"
            >
              📸 {imageData.photographer}
            </a>
          </div>
        )}
      </div>

      {/* Responsive Sticky Summary Bar */}
      <div className="sticky top-14 z-20 bg-white bg-opacity-95 backdrop-blur-md border-b border-gray-200 shadow-lg">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-2 sm:py-3">
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">{getFoodEmoji(currentRecipe.title)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-base font-bold text-gray-900 truncate">{currentRecipe.title}</h1>
                <div className="flex items-center space-x-3 text-xs text-gray-600">
                  <span>{formatTime((currentRecipe.prepTime || 0) + (currentRecipe.cookTime || 0))}</span>
                  <span>•</span>
                  <span>{servings} servings</span>
                  <span>•</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded border bg-gradient-to-r ${getDifficultyColor(currentRecipe.difficulty)}`}>
                    {currentRecipe.difficulty}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Mobile Progress Bar */}
            {activeTab === 'instructions' && currentRecipe.instructions && currentRecipe.instructions.length > 0 && (
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-xs text-gray-500 font-medium">Progress:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${(completedSteps.size / currentRecipe.instructions.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 font-medium">
                  {completedSteps.size}/{currentRecipe.instructions.length}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:block">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xl lg:text-2xl">{getFoodEmoji(currentRecipe.title)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg lg:text-xl font-bold text-gray-900 truncate">{currentRecipe.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatTime((currentRecipe.prepTime || 0) + (currentRecipe.cookTime || 0))}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      {servings} servings
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
                <span className={`px-2 lg:px-3 py-1 lg:py-1.5 text-xs lg:text-sm font-medium rounded-lg border bg-gradient-to-r ${getDifficultyColor(currentRecipe.difficulty)}`}>
                  {currentRecipe.difficulty}
                </span>
                {currentRecipe.cuisine && (
                  <span className="px-2 lg:px-3 py-1 lg:py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs lg:text-sm font-medium rounded-lg border border-blue-200">
                    {currentRecipe.cuisine}
                  </span>
                )}
                {currentRecipe.isAIGenerated && (
                  <span className="px-2 lg:px-3 py-1 lg:py-1.5 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 text-xs lg:text-sm font-medium rounded-lg border border-purple-200">
                    ✨ AI
                  </span>
                )}
              </div>
            </div>

            {/* Desktop Progress Bar */}
            {activeTab === 'instructions' && currentRecipe.instructions && currentRecipe.instructions.length > 0 && (
              <div className="mt-3 flex items-center space-x-3">
                <span className="text-xs text-gray-500 font-medium">Progress:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(completedSteps.size / currentRecipe.instructions.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 font-medium">
                  {completedSteps.size}/{currentRecipe.instructions.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Ingredients Sidebar - Responsive */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden lg:sticky lg:top-2">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 sm:p-6 border-b border-green-200">
                <h3 className="text-xl sm:text-2xl font-bold text-green-900 flex items-center mb-4">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2a2 2 0 002 2m0 0h14m-14 0a2 2 0 002 2v2a2 2 0 01-2 2m12 0a2 2 0 01-2-2v-2a2 2 0 012-2" />
                  </svg>
                  Ingredients
                </h3>
                
                {/* Enhanced Mobile-Friendly Servings Adjuster */}
                <div className="bg-white bg-opacity-70 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-green-700 font-medium text-sm sm:text-base">Adjust Servings:</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="flex items-center bg-white rounded-lg border-2 border-green-300 shadow-sm overflow-hidden">
                      <button
                        onClick={() => adjustServings(servings - 1)}
                        className="px-3 py-2 sm:px-4 sm:py-2 text-green-600 hover:bg-green-50 hover:text-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={servings <= 1}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <div className="px-4 py-2 sm:px-6 sm:py-2 bg-green-50 border-x border-green-300 min-w-[3rem] text-center">
                        <span className="text-lg sm:text-xl font-bold text-green-800">{servings}</span>
                      </div>
                      <button
                        onClick={() => adjustServings(servings + 1)}
                        className="px-3 py-2 sm:px-4 sm:py-2 text-green-600 hover:bg-green-50 hover:text-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={servings >= 20}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-green-600 text-center mt-2">
                    Original: {currentRecipe.servings} servings → Showing: {servings} servings
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <ul className="space-y-3">
                  {currentRecipe.ingredients?.map((ingredient, index) => (
                    <li key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors duration-200 border border-gray-200">
                      <div className="flex-1">
                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                          {getAdjustedQuantity(ingredient.quantity, currentRecipe.servings)} {getDisplayUnit(ingredient.unit, ingredient.name)}
                        </span>
                        <span className="text-gray-700 ml-2 text-sm sm:text-base">{ingredient.name}</span>
                      </div>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-medium text-xs sm:text-sm">
                        {index + 1}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Nutrition Info - Responsive */}
                {currentRecipe.nutrition && (
                  <div className="mt-6 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <h4 className="text-base sm:text-lg font-semibold text-blue-900 mb-3 flex items-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Nutrition per serving
                    </h4>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 text-sm">
                      <div className="text-center p-2 bg-white rounded-lg">
                        <div className="font-bold text-blue-700 text-base sm:text-lg">{Math.round((currentRecipe.nutrition.calories * servings) / currentRecipe.servings)}</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Calories</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded-lg">
                        <div className="font-bold text-blue-700 text-base sm:text-lg">{Math.round((currentRecipe.nutrition.protein * servings) / currentRecipe.servings)}g</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Protein</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded-lg">
                        <div className="font-bold text-blue-700 text-base sm:text-lg">{Math.round((currentRecipe.nutrition.carbs * servings) / currentRecipe.servings)}g</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Carbs</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded-lg">
                        <div className="font-bold text-blue-700 text-base sm:text-lg">{Math.round((currentRecipe.nutrition.fat * servings) / currentRecipe.servings)}g</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Fat</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Instructions - Responsive */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Tab Navigation - Mobile Optimized */}
              <div className="flex bg-gray-50 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('instructions')}
                  className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all duration-200 ${
                    activeTab === 'instructions'
                      ? 'bg-white text-purple-700 border-b-2 border-purple-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Instructions
                </button>
                <button
                  onClick={() => setActiveTab('timing')}
                  className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all duration-200 ${
                    activeTab === 'timing'
                      ? 'bg-white text-purple-700 border-b-2 border-purple-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="hidden sm:inline">Timing & </span>Tips
                </button>
              </div>

              {/* Tab Content - Responsive */}
              <div className="p-4 sm:p-6">
                {activeTab === 'instructions' ? (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Cooking Instructions
                      </h3>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {completedSteps.size} of {currentRecipe.instructions?.length || 0} completed
                      </div>
                    </div>
                    
                    {currentRecipe.instructions && currentRecipe.instructions.length > 0 ? (
                      <div className="space-y-4">
                        {currentRecipe.instructions.map((instruction, index) => (
                          <div
                            key={index}
                            className={`p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 ${
                              completedSteps.has(index)
                                ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-300'
                                : 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 hover:border-purple-300'
                            }`}
                          >
                            <div className="flex items-start space-x-3 sm:space-x-4">
                              <button
                                onClick={() => toggleStepComplete(index)}
                                className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center font-bold text-base sm:text-lg transition-all duration-200 ${
                                  completedSteps.has(index)
                                    ? 'bg-green-500 border-green-500 text-white shadow-md'
                                    : 'bg-white border-purple-300 text-purple-600 hover:border-purple-500 hover:bg-purple-50 shadow-sm'
                                }`}
                                title={completedSteps.has(index) ? 'Mark as incomplete' : 'Mark as complete'}
                              >
                                {completedSteps.has(index) ? '✓' : index + 1}
                              </button>
                              <div className="flex-1">
                                <p className={`text-base sm:text-lg leading-relaxed ${
                                  completedSteps.has(index) ? 'text-green-800' : 'text-gray-800'
                                }`}>
                                  {instruction}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Progress Bar */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Cooking Progress</span>
                            <span className="text-sm text-gray-600">
                              {Math.round((completedSteps.size / (currentRecipe.instructions?.length || 1)) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                              style={{ width: `${(completedSteps.size / (currentRecipe.instructions?.length || 1)) * 100}%` }}
                            >
                              {completedSteps.size === (currentRecipe.instructions?.length || 0) && completedSteps.size > 0 && (
                                <span className="text-white text-xs font-bold">🎉</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No instructions available for this recipe.</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Timing & Tips
                    </h3>
                    
                    <div className="space-y-6">
                      {/* Timing Breakdown - Responsive Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                          <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-blue-700 mb-2">
                              {formatTime(currentRecipe.prepTime || 0)}
                            </div>
                            <div className="text-blue-600 font-medium text-sm sm:text-base">Prep Time</div>
                          </div>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                          <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-orange-700 mb-2">
                              {formatTime(currentRecipe.cookTime || 0)}
                            </div>
                            <div className="text-orange-600 font-medium text-sm sm:text-base">Cook Time</div>
                          </div>
                        </div>
                      </div>

                      {/* Cooking Tips - Responsive */}
                      <div className="p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                        <h4 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-4 flex items-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          Pro Tips
                        </h4>
                        <ul className="space-y-2 text-yellow-800 text-sm sm:text-base">
                          <li className="flex items-start">
                            <span className="text-yellow-600 mr-2">•</span>
                            Read through all instructions before starting
                          </li>
                          <li className="flex items-start">
                            <span className="text-yellow-600 mr-2">•</span>
                            Prepare all ingredients before cooking (mise en place)
                          </li>
                          <li className="flex items-start">
                            <span className="text-yellow-600 mr-2">•</span>
                            Click the step numbers to track your progress
                          </li>
                          <li className="flex items-start">
                            <span className="text-yellow-600 mr-2">•</span>
                            Adjust ingredient quantities using the serving slider
                          </li>
                          {currentRecipe.difficulty === 'hard' && (
                            <li className="flex items-start">
                              <span className="text-yellow-600 mr-2">•</span>
                              This is an advanced recipe - take your time with each step
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Dietary Tags - Responsive */}
                      {currentRecipe.dietaryTags && currentRecipe.dietaryTags.length > 0 && (
                        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                          <h4 className="text-base sm:text-lg font-semibold text-green-800 mb-3">Dietary Information</h4>
                          <div className="flex flex-wrap gap-2">
                            {currentRecipe.dietaryTags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-green-200 text-green-800 text-xs sm:text-sm font-medium rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Responsive Action Buttons */}
            <div className="mt-6 sm:mt-8">
              {/* Mobile Layout - Full Width Stacked */}
              <div className="block sm:hidden space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg"
                  size="lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Add to Meal Plan
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full border-2 border-green-300 text-green-700 hover:bg-green-50"
                  size="lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                  </svg>
                  Add to Shopping List
                </Button>

                <Button 
                  variant="outline"
                  className="w-full border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                  size="lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share Recipe
                </Button>
              </div>

              {/* Desktop/Tablet Layout - Horizontal */}
              <div className="hidden sm:flex flex-wrap gap-4">
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg"
                  size="lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Add to Meal Plan
                </Button>
                
                <Button 
                  variant="outline"
                  className="border-2 border-green-300 text-green-700 hover:bg-green-50"
                  size="lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                  </svg>
                  Add to Shopping List
                </Button>

                <Button 
                  variant="outline"
                  className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                  size="lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share Recipe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
