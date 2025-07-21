import React, { useState, useEffect, useCallback } from 'react';
import { useMealPlan } from '../../../contexts/MealPlanContext';
import { useRecipe } from '../../../contexts/RecipeContext';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

const MealPlanner = () => {
  const { createMealPlan, fetchMealPlans, mealPlans, loading } = useMealPlan();
  const { recipes, fetchRecipes } = useRecipe();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });

  const loadMealPlans = useCallback(async () => {
    const result = await fetchMealPlans({ active: true });
    if (initialLoading) {
      setInitialLoading(false);
    }
    return result;
  }, [fetchMealPlans, initialLoading]);

  const loadRecipes = useCallback(() => {
    fetchRecipes({ limit: 50 });
  }, [fetchRecipes]);

  useEffect(() => {
    loadMealPlans();
    loadRecipes();
  }, [loadMealPlans, loadRecipes]);

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your meal plans...</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Meal Planner
              </h1>
              <p className="text-gray-600 mt-2">Plan your weekly meals and stay organized</p>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Plan
            </Button>
          </div>
        </div>

        {/* Create Meal Plan Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create New Meal Plan</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateMealPlan}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan Name
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Week of March 15"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Meal Plans Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Your Meal Plans
              </h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                </div>
              ) : mealPlans.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-600 mb-4">No meal plans yet</p>
                  <Button 
                    onClick={() => setShowCreateForm(true)} 
                    size="sm"
                    variant="outline"
                  >
                    Create Your First Plan
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {mealPlans.map((plan) => (
                    <div
                      key={plan._id}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                        selectedMealPlan?._id === plan._id
                          ? 'bg-blue-50 border-blue-300 shadow-md'
                          : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:shadow-sm'
                      }`}
                      onClick={() => setSelectedMealPlan(plan)}
                    >
                      <h3 className="font-medium text-gray-900">{plan.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          plan.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {plan.meals?.length || 0} days
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Meal Plan Calendar */}
          <div className="lg:col-span-3">
            {selectedMealPlan ? (
              <MealPlanCalendar
                mealPlan={selectedMealPlan}
                recipes={recipes}
                onMealPlanUpdate={setSelectedMealPlan}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <svg className="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a Meal Plan
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Choose a meal plan from the sidebar to view and edit your meals for the week
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Meal Plan Calendar Component
const MealPlanCalendar = ({ mealPlan, recipes, onMealPlanUpdate }) => {
  const { addMealToDate, removeMealFromDate, generateShoppingList, loading } = useMealPlan();
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleAddMeal = (date, mealType) => {
    setSelectedSlot({ date, mealType });
    setShowRecipeSelector(true);
  };

  const handleSelectRecipe = async (recipeId) => {
    if (selectedSlot) {
      const result = await addMealToDate(
        mealPlan._id,
        selectedSlot.date,
        selectedSlot.mealType,
        recipeId
      );
      setShowRecipeSelector(false);
      setSelectedSlot(null);
      if (result.success && onMealPlanUpdate) {
        onMealPlanUpdate(result.mealPlan);
      }
    }
  };

  const handleRemoveMeal = async (date, mealType, recipeId = null) => {
    const result = await removeMealFromDate(mealPlan._id, date, mealType, recipeId);
    if (result.success && onMealPlanUpdate) {
      onMealPlanUpdate(result.mealPlan);
    }
  };

  const handleGenerateShoppingList = async () => {
    const result = await generateShoppingList(mealPlan._id);
    if (result.success) {
      alert('Shopping list generated successfully!');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{mealPlan.name}</h2>
            <p className="text-gray-600 mt-1">
              {new Date(mealPlan.startDate).toLocaleDateString()} - {new Date(mealPlan.endDate).toLocaleDateString()}
            </p>
          </div>
          <Button
            onClick={handleGenerateShoppingList}
            loading={loading}
            variant="outline"
            className="border-green-300 text-green-700 hover:bg-green-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
            </svg>
            Generate Shopping List
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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

// Enhanced Day Meal Card Component
const DayMealCard = ({ date, meals, onAddMeal, onRemoveMeal }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMealIcon = (mealType) => {
    switch (mealType) {
      case 'breakfast':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'lunch':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'dinner':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-1.5-.454" />
          </svg>
        );
    }
  };

  const renderMeal = (meal, mealType) => {
    if (!meal) {
      return (
        <button
          onClick={() => onAddMeal(date, mealType)}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 text-sm"
        >
          <svg className="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add {mealType}
        </button>
      );
    }

    return (
      <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg relative group border border-blue-200">
        <h4 className="text-sm font-medium text-blue-900 truncate pr-6">
          {meal.title}
        </h4>
        <p className="text-xs text-blue-700 mt-1 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {(meal.prepTime || 0) + (meal.cookTime || 0)}min • {meal.servings} servings
        </p>
        <button
          onClick={() => onRemoveMeal(date, mealType)}
          className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
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
          className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-yellow-300 hover:text-yellow-600 hover:bg-yellow-50 transition-all duration-200 text-sm"
        >
          <svg className="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Snack
        </button>
      );
    }

    return (
      <div className="space-y-2">
        {meals.snacks.map((snack, index) => (
          <div key={index} className="p-2 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg text-xs relative group border border-yellow-200">
            <span className="text-yellow-900 truncate block pr-6">{snack.title}</span>
            <button
              onClick={() => onRemoveMeal(date, 'snacks', snack._id)}
              className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={() => onAddMeal(date, 'snacks')}
          className="w-full p-2 border border-dashed border-yellow-300 rounded-lg text-xs text-yellow-600 hover:bg-yellow-50 transition-colors duration-200"
        >
          + Add Another Snack
        </button>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
        <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {formatDate(date)}
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-2 flex items-center">
            {getMealIcon('breakfast')}
            <span className="ml-1">Breakfast</span>
          </label>
          {renderMeal(meals.breakfast, 'breakfast')}
        </div>
        
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-2 flex items-center">
            {getMealIcon('lunch')}
            <span className="ml-1">Lunch</span>
          </label>
          {renderMeal(meals.lunch, 'lunch')}
        </div>
        
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-2 flex items-center">
            {getMealIcon('dinner')}
            <span className="ml-1">Dinner</span>
          </label>
          {renderMeal(meals.dinner, 'dinner')}
        </div>
        
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-2 flex items-center">
            {getMealIcon('snacks')}
            <span className="ml-1">Snacks</span>
          </label>
          {renderSnacks()}
        </div>
      </div>
    </div>
  );
};

// Enhanced Recipe Selector Modal
const RecipeSelectorModal = ({ recipes, onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Select a Recipe</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <Input
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        
        <div className="overflow-y-auto max-h-96">
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-500">No recipes found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecipes.map(recipe => (
                <div
                  key={recipe._id}
                  onClick={() => onSelect(recipe._id)}
                  className="p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                >
                  <h4 className="font-medium text-gray-900">{recipe.title}</h4>
                  <p className="text-sm text-gray-600 truncate mt-1">{recipe.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {(recipe.prepTime || 0) + (recipe.cookTime || 0)}min
                    </span>
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 715.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {recipe.servings} servings
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
