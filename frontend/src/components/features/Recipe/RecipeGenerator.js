import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipe } from '../../../contexts/RecipeContext';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [preferences, setPreferences] = useState({
    cuisine: '',
    mealType: 'main dish',
    difficulty: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  
  const fileInputRef = useRef(null);
  const { generateRecipe, analyzeImage, loading } = useRecipe();
  const { user } = useAuth();
  const navigate = useNavigate();

  const cuisineOptions = [
    'Italian', 'Mexican', 'Chinese', 'Indian', 'Mediterranean', 
    'Thai', 'Japanese', 'American', 'French', 'Korean'
  ];

  const mealTypeOptions = [
    { 
      value: 'breakfast', 
      label: 'Breakfast',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    { 
      value: 'lunch', 
      label: 'Lunch',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      value: 'dinner', 
      label: 'Dinner',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )
    },
    { 
      value: 'snack', 
      label: 'Snack',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zM3 9h18v4H3V9z" />
        </svg>
      )
    },
    { 
      value: 'dessert', 
      label: 'Dessert',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zM3 9h18v4H3V9z" />
        </svg>
      )
    },
    { 
      value: 'appetizer', 
      label: 'Appetizer',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2h6a2 2 0 002-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11v8a2 2 0 002 2h6a2 2 0 002-2v-8" />
        </svg>
      )
    }
  ];

  const difficultyOptions = [
    { 
      value: 'easy', 
      label: 'Easy', 
      desc: 'Simple & quick',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      value: 'medium', 
      label: 'Medium', 
      desc: 'Some experience needed',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      value: 'hard', 
      label: 'Hard', 
      desc: 'Advanced cooking',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    }
  ];

  const addIngredient = () => {
    if (ingredientInput.trim() && !ingredients.includes(ingredientInput.trim())) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput('');
      setErrors({ ...errors, ingredients: '' });
    }
  };

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter(ing => ing !== ingredient));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        // Auto-analyze when image is uploaded
        analyzeImageIngredients();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImageIngredients = async () => {
    if (!imageFile) return;
    
    const result = await analyzeImage(imageFile);
    
    if (result.success && result.ingredients.length > 0) {
      const newIngredients = result.ingredients.filter(
        ing => !ingredients.includes(ing)
      );
      setIngredients([...ingredients, ...newIngredients]);
    } else {
      setErrors({ 
        ...errors, 
        image: result.message || 'Could not identify ingredients in image' 
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (ingredients.length === 0) {
      newErrors.ingredients = 'At least one ingredient is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;
    
    const result = await generateRecipe(ingredients, {
      ...preferences,
      dietaryPreferences: user?.dietaryPreferences,
      allergies: user?.allergies
    });
    
    if (result.success) {
      navigate(`/recipe/${result.recipe._id}`);
    } else {
      setErrors({ 
        ...errors, 
        general: result.message 
      });
    }
  };

  const nextStep = () => setCurrentStep(Math.min(currentStep + 1, 3));
  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Recipe Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform your ingredients into delicious recipes with the power of AI
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-4 sm:space-x-8">
              {[
                { 
                  step: 1, 
                  title: 'Ingredients', 
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2a2 2 0 002 2m0 0h14m-14 0a2 2 0 002 2v2a2 2 0 01-2 2m12 0a2 2 0 01-2-2v-2a2 2 0 012-2" />
                    </svg>
                  )
                },
                { 
                  step: 2, 
                  title: 'Preferences', 
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )
                },
                { 
                  step: 3, 
                  title: 'Generate', 
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                }
              ].map(({ step, title, icon }) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-200 ${
                    currentStep >= step 
                      ? 'bg-purple-500 border-purple-500 text-white' 
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {currentStep >= step ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : icon}
                  </div>
                  <span className={`ml-2 text-sm sm:text-base font-medium hidden sm:block ${
                    currentStep >= step ? 'text-purple-600' : 'text-gray-400'
                  }`}>
                    {title}
                  </span>
                  {step < 3 && (
                    <div className={`hidden sm:block w-8 lg:w-16 h-0.5 ml-4 ${
                      currentStep > step ? 'bg-purple-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          
          {/* Step 1: Ingredients */}
          {currentStep === 1 && (
            <div className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                  <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2a2 2 0 002 2m0 0h14m-14 0a2 2 0 002 2v2a2 2 0 01-2 2m12 0a2 2 0 01-2-2v-2a2 2 0 012-2" />
                  </svg>
                  What ingredients do you have?
                </h2>
                <p className="text-gray-600">Type ingredients manually or upload a photo for AI ingredient detection</p>
              </div>

              {/* Single Unified Input Section */}
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 mb-8">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Add Ingredients
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Text Input */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        placeholder="e.g., chicken breast, tomatoes, basil..."
                        value={ingredientInput}
                        onChange={(e) => setIngredientInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                        className="flex-1"
                      />
                      <Button
                        onClick={addIngredient} 
                        variant="primary"
                        size="base"
                        disabled={!ingredientInput.trim()}
                        className="sm:w-auto w-full"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add
                      </Button>
                    </div>

                    {/* Image Upload Option */}
                    <div className="text-center">
                      <div className="text-sm text-blue-600 mb-2">OR</div>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Take/Upload Photo for AI Analysis
                      </Button>
                      <p className="text-xs text-blue-600 mt-2">AI will automatically detect ingredients from your photo</p>
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                        <img 
                          src={imagePreview} 
                          alt="Ingredients preview" 
                          className="mx-auto h-32 w-auto rounded-lg mb-3 shadow-md"
                        />
                        <div className="flex justify-center space-x-2">
                          <Button
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview(null);
                              fileInputRef.current.value = '';
                            }}
                            variant="ghost"
                            size="sm"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {errors.ingredients && (
                      <p className="text-red-500 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.ingredients}
                      </p>
                    )}

                    {errors.image && (
                      <p className="text-red-500 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.image}
                      </p>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Ingredients Display */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Your Ingredients ({ingredients.length})
                    </span>
                    {ingredients.length > 0 && (
                      <button
                        onClick={() => setIngredients([])}
                        className="text-sm text-red-600 hover:text-red-700 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear All
                      </button>
                    )}
                  </h3>
                  
                  {ingredients.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {ingredients.map((ingredient, index) => (
                        <span
                          key={index}
                          className="bg-white border border-blue-300 text-blue-800 px-3 py-2 rounded-lg text-sm flex items-center shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          {ingredient}
                          <button
                            onClick={() => removeIngredient(ingredient)}
                            className="ml-2 text-blue-500 hover:text-red-600 hover:bg-red-50 rounded-full p-0.5 transition-all duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-16 h-16 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2a2 2 0 002 2m0 0h14m-14 0a2 2 0 002 2v2a2 2 0 01-2 2m12 0a2 2 0 01-2-2v-2a2 2 0 012-2" />
                      </svg>
                      <p className="text-gray-500">No ingredients added yet</p>
                      <p className="text-sm text-gray-400 mt-1">Add ingredients above to get started</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-center mt-8">
                <Button
                  onClick={nextStep}
                  disabled={ingredients.length === 0}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                >
                  Continue to Preferences
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Preferences */}
          {currentStep === 2 && (
            <div className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                  <svg className="w-8 h-8 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Customize Your Recipe
                </h2>
                <p className="text-gray-600">Tell us your preferences to generate the perfect recipe</p>
              </div>

              <div className="max-w-4xl mx-auto space-y-8">
                {/* Meal Type Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Meal Type
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {mealTypeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setPreferences({ ...preferences, mealType: option.value })}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                          preferences.mealType === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-center mb-2">
                          {option.icon}
                        </div>
                        <div className="text-sm font-medium">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cuisine Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Cuisine Type (Optional)
                  </h3>
                  <select
                    value={preferences.cuisine}
                    onChange={(e) => setPreferences({ ...preferences, cuisine: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Any cuisine</option>
                    {cuisineOptions.map(cuisine => (
                      <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Difficulty Level (Optional)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {difficultyOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setPreferences({ 
                          ...preferences, 
                          difficulty: preferences.difficulty === option.value ? '' : option.value 
                        })}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          preferences.difficulty === option.value
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-2">
                          {option.icon}
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-500 mt-1">{option.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* User Dietary Preferences Display */}
                {(user?.dietaryPreferences?.length > 0 || user?.allergies?.length > 0) && (
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Your Dietary Preferences
                    </h3>
                    
                    {user.dietaryPreferences?.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-green-700 mb-2 font-medium">Dietary Preferences:</p>
                        <div className="flex flex-wrap gap-2">
                          {user.dietaryPreferences.map(pref => (
                            <span key={pref} className="px-3 py-1 bg-green-200 text-green-800 text-sm rounded-full">
                              {pref}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {user.allergies?.length > 0 && (
                      <div>
                        <p className="text-sm text-green-700 mb-2 font-medium">Allergies to Avoid:</p>
                        <div className="flex flex-wrap gap-2">
                          {user.allergies.map(allergy => (
                            <span key={allergy} className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8 max-w-4xl mx-auto">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Ingredients
                </Button>
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                >
                  Ready to Generate
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Generate */}
          {currentStep === 3 && (
            <div className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                  <svg className="w-8 h-8 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Ready to Generate Your Recipe!
                </h2>
                <p className="text-gray-600">Review your selections and generate your personalized recipe</p>
              </div>

              <div className="max-w-4xl mx-auto">
                {/* Recipe Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Ingredients Summary */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2a2 2 0 002 2m0 0h14m-14 0a2 2 0 002 2v2a2 2 0 01-2 2m12 0a2 2 0 01-2-2v-2a2 2 0 012-2" />
                      </svg>
                      Your Ingredients ({ingredients.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {ingredients.map((ingredient, index) => (
                        <span
                          key={index}
                          className="bg-white text-blue-800 px-3 py-1 rounded-lg text-sm border border-blue-300"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Preferences Summary */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Your Preferences
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">Meal Type:</span>
                        <span className="font-medium text-green-900 capitalize">{preferences.mealType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Cuisine:</span>
                        <span className="font-medium text-green-900">{preferences.cuisine || 'Any'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Difficulty:</span>
                        <span className="font-medium text-green-900 capitalize">{preferences.difficulty || 'Any'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {errors.general && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-800">{errors.general}</p>
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <div className="text-center space-y-4">
                  {/* Mobile Layout */}
                  <div className="block sm:hidden">
                    <Button
                      onClick={handleGenerate}
                      loading={loading}
                      size="lg"
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Generating Recipe...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Generate My Recipe
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={prevStep}
                      variant="ghost"
                      className="w-full mt-3"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Preferences
                    </Button>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex justify-between items-center">
                    <Button
                      onClick={prevStep}
                      variant="outline"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Preferences
                    </Button>
                    
                    <Button
                      onClick={handleGenerate}
                      loading={loading}
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Generating Amazing Recipe...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Generate My Recipe
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeGenerator;
