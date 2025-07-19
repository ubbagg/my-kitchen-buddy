import React, { useState, useEffect } from 'react';
import { useMealPlan } from '../../contexts/MealPlanContext';
import { useRecipe } from '../../contexts/RecipeContext';
import Button from '../Common/Button';
import Input from '../Common/Input';

const MealPlanner = () => {
  const { createMealPlan, fetchMealPlans, mealPlans, loading } = useMealPlan();
  const { recipes, fetchRecipes } = useRecipe();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchMealPlans({ active: true });
    fetchRecipes({ limit: 50 });
  }, []);

  const generateWeekDates = (startDate, endDate) => {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    
    return dates;
  };

  const handleCreateMealPlan = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.startDate || !formData.endDate) {
      alert('Please fill in all fields');
      return;
    }

    const dates = generateWeekDates(formData.startDate, formData.endDate);
    const meals = dates.map(date => ({
      date: date.toISOString(),
      breakfast: null,
      lunch: null,
      dinner: null,
      snacks: []
    }));

    const result = await createMealPlan({
      ...formData,
      meals
    });

    if (result.success) {
      setShowCreateForm(false);
      setSelectedMealPlan(result.mealPlan);
      setFormData({ name: '', startDate: '', endDate: '' });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Meal Planner 📅</h1>
            <Button onClick={() => setShowCreateForm(true)}>
              Create New Meal Plan
            </Button>
          </div>
        </div>

        {/* Create Meal Plan Form */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Create New Meal Plan</h2>
              <form onSubmit={handleCreateMealPlan}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plan Name
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Week of March 15"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={loading}>
                    Create Plan
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Meal Plans List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Meal Plans Sidebar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Your Meal Plans</h2>
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : mealPlans.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📋</div>
                <p className="text-gray-600 mb-4">No meal plans yet</p>
                <Button onClick={() => setShowCreateForm(true)} size="sm">
                  Create Your First Plan
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {mealPlans.map((plan) => (
                  <div
                    key={plan._id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedMealPlan?._id === plan._id
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedMealPlan(plan)}
                  >
                    <h3 className="font-medium text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        plan.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {plan.meals?.length || 0} days
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Meal Plan Calendar */}
          <div className="lg:col-span-2">
            {selectedMealPlan ? (
              <MealPlanCalendar mealPlan={selectedMealPlan} recipes={recipes} />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🗓️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a Meal Plan
                </h3>
                <p className="text-gray-600">
                  Choose a meal plan from the sidebar to view and edit your meals
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Meal Plan Calendar Component
const MealPlanCalendar = ({ mealPlan, recipes }) => {
  const { addMealToDate, removeMealFromDate, generateShoppingList, loading } = useMealPlan();
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleAddMeal = (date, mealType) => {
    setSelectedSlot({ date, mealType });
    setShowRecipeSelector(true);
  };

  const handleSelectRecipe = async (recipeId) => {
    if (selectedSlot) {
      await addMealToDate(
        mealPlan._id,
        selectedSlot.date,
        selectedSlot.mealType,
        recipeId
      );
      setShowRecipeSelector(false);
      setSelectedSlot(null);
    }
  };

  const handleRemoveMeal = async (date, mealType, recipeId = null) => {
    await removeMealFromDate(mealPlan._id, date, mealType, recipeId);
  };

  const handleGenerateShoppingList = async () => {
    const result = await generateShoppingList(mealPlan._id);
    if (result.success) {
      alert('Shopping list generated successfully!');
    }
  };

  const getMealForDate = (date, mealType) => {
    const meal = mealPlan.meals?.find(m => 
      new Date(m.date).toDateString() === new Date(date).toDateString()
    );
    return meal ? meal[mealType] : null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{mealPlan.name}</h2>
          <Button
            onClick={handleGenerateShoppingList}
            loading={loading}
            size="sm"
          >
            🛒 Generate Shopping List
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mealPlan.meals?.map((dayMeal, index) => (
            <DayMealCard
              key={index}
              date={dayMeal.date}
              meals={dayMeal}
              onAddMeal={handleAddMeal}
              onRemoveMeal={handleRemoveMeal}
            />
          ))}
        </div>
      </div>

      {/* Recipe Selector Modal */}
      {showRecipeSelector && (
        <RecipeSelectorModal
          recipes={recipes}
          onSelect={handleSelectRecipe}
          onClose={() => {
            setShowRecipeSelector(false);
            setSelectedSlot(null);
          }}
        />
      )}
    </div>
  );
};

// Day Meal Card Component
const DayMealCard = ({ date, meals, onAddMeal, onRemoveMeal }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderMeal = (meal, mealType) => {
    if (!meal) {
      return (
        <button
          onClick={() => onAddMeal(date, mealType)}
          className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors"
        >
          + Add {mealType}
        </button>
      );
    }

    return (
      <div className="p-2 bg-blue-50 rounded-lg relative group">
        <h4 className="text-sm font-medium text-blue-900 truncate">
          {meal.title}
        </h4>
        <p className="text-xs text-blue-700">
          {meal.prepTime + meal.cookTime}min • {meal.servings} servings
        </p>
        <button
          onClick={() => onRemoveMeal(date, mealType)}
          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      </div>
    );
  };

  const renderSnacks = () => {
    if (!meals.snacks || meals.snacks.length === 0) {
      return (
        <button
          onClick={() => onAddMeal(date, 'snacks')}
          className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors"
        >
          + Add Snack
        </button>
      );
    }

    return (
      <div className="space-y-1">
        {meals.snacks.map((snack, index) => (
          <div key={index} className="p-1 bg-yellow-50 rounded text-xs relative group">
            <span className="text-yellow-900 truncate block">{snack.title}</span>
            <button
              onClick={() => onRemoveMeal(date, 'snacks', snack._id)}
              className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={() => onAddMeal(date, 'snacks')}
          className="w-full p-1 border border-dashed border-yellow-300 rounded text-xs text-yellow-600 hover:bg-yellow-50"
        >
          + Add Snack
        </button>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-medium text-gray-900 mb-3">{formatDate(date)}</h3>
      
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">
            🌅 Breakfast
          </label>
          {renderMeal(meals.breakfast, 'breakfast')}
        </div>
        
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">
            ☀️ Lunch
          </label>
          {renderMeal(meals.lunch, 'lunch')}
        </div>
        
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">
            🌙 Dinner
          </label>
          {renderMeal(meals.dinner, 'dinner')}
        </div>
        
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">
            🍿 Snacks
          </label>
          {renderSnacks()}
        </div>
      </div>
    </div>
  );
};

// Recipe Selector Modal
const RecipeSelectorModal = ({ recipes, onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Select a Recipe</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <Input
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        
        <div className="overflow-y-auto max-h-64">
          {filteredRecipes.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No recipes found</p>
          ) : (
            <div className="space-y-2">
              {filteredRecipes.map(recipe => (
                <div
                  key={recipe._id}
                  onClick={() => onSelect(recipe._id)}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                >
                  <h4 className="font-medium">{recipe.title}</h4>
                  <p className="text-sm text-gray-600 truncate">{recipe.description}</p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span>⏱️ {(recipe.prepTime || 0) + (recipe.cookTime || 0)}min</span>
                    <span>👥 {recipe.servings} servings</span>
                    <span className={`px-1 rounded ${
                      recipe.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      recipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
