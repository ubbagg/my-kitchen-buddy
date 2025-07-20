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
  
  const fileInputRef = useRef(null);
  const { generateRecipe, analyzeImage, loading } = useRecipe();
  const { user } = useAuth();
  const navigate = useNavigate();

  const cuisineOptions = [
    'Italian', 'Mexican', 'Chinese', 'Indian', 'Mediterranean', 
    'Thai', 'Japanese', 'American', 'French', 'Korean'
  ];

  const mealTypeOptions = [
    'breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'appetizer'
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
      dietaryPreferences: user.dietaryPreferences,
      allergies: user.allergies
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🍳 Generate Your Recipe
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Ingredient Input */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Add Ingredients</h2>
              
              {/* Manual Input */}
              <div className="mb-6">
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Type an ingredient (e.g., chicken, rice)"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                    className="flex-1"
                  />
                  <Button onClick={addIngredient} variant="secondary">
                    Add
                  </Button>
                </div>
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Or upload a photo of your ingredients
                </h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {imagePreview ? (
                    <div className="text-center">
                      <img 
                        src={imagePreview} 
                        alt="Ingredients preview" 
                        className="mx-auto h-32 w-auto rounded-lg mb-3"
                      />
                      <div className="space-x-2">
                        <Button
                          onClick={analyzeImageIngredients}
                          loading={loading}
                          size="sm"
                        >
                          Analyze Image
                        </Button>
                        <Button
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                            fileInputRef.current.value = '';
                          }}
                          variant="secondary"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl mb-2">📸</div>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="secondary"
                      >
                        Upload Photo
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}
              </div>

              {/* Ingredients List */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Your Ingredients ({ingredients.length})
                </h3>
                {ingredients.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {ingredient}
                        <button
                          onClick={() => removeIngredient(ingredient)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No ingredients added yet</p>
                )}
                {errors.ingredients && (
                  <p className="text-red-500 text-sm mt-1">{errors.ingredients}</p>
                )}
              </div>
            </div>

            {/* Right Column - Preferences */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Recipe Preferences</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cuisine Type
                  </label>
                  <select
                    value={preferences.cuisine}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      cuisine: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any cuisine</option>
                    {cuisineOptions.map(cuisine => (
                      <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meal Type
                  </label>
                  <select
                    value={preferences.mealType}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      mealType: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {mealTypeOptions.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={preferences.difficulty}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      difficulty: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                {/* User Preferences Display */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Your Dietary Preferences
                  </h3>
                  {user.dietaryPreferences?.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {user.dietaryPreferences.map(pref => (
                        <span key={pref} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          {pref}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No dietary preferences set</p>
                  )}
                  
                  {user.allergies?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Allergies to avoid:</p>
                      <div className="flex flex-wrap gap-1">
                        {user.allergies.map(allergy => (
                          <span key={allergy} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-8 text-center">
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{errors.general}</p>
              </div>
            )}
            
            <Button
              onClick={handleGenerate}
              loading={loading}
              size="lg"
              className="px-12"
            >
              {loading ? 'Generating Recipe...' : 'Generate Recipe 🍳'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeGenerator;