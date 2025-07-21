import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRecipe } from '../contexts/RecipeContext';
import { useMealPlan } from '../contexts/MealPlanContext';
import { useShoppingList } from '../contexts/ShoppingListContext';
import { Button, Card, LoadingSpinner } from '../components/ui';

const Dashboard = () => {
  const { user } = useAuth();

  /* recipe / meal-plan / shopping-list data */
  const { recipes, fetchRecipes } = useRecipe();
  const { mealPlans, fetchMealPlans, loading: mealPlansLoading } = useMealPlan();
  const { shoppingLists, fetchShoppingLists, loading: shoppingListsLoading } = useShoppingList();

  /* local loading state */
  const [initialLoading, setInitialLoading] = useState(true);

  /* one-time dashboard load */
  useEffect(() => {
    (async () => {
      try {
        setInitialLoading(true);
        await Promise.all([
          fetchRecipes({ limit: 6 }),
          fetchMealPlans(),
          fetchShoppingLists()
        ]);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, [fetchRecipes, fetchMealPlans, fetchShoppingLists]);

  if (initialLoading) {
    return <LoadingSpinner fullScreen message="Loading your kitchen dashboard..." />;
  }

  /* recent / active subsets */
  const recentRecipes        = recipes.slice(0, 3);
  const activeMealPlans      = mealPlans
    .filter(mp => !mp.completed && !mp.isCompleted)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 2);
  const pendingShoppingLists = shoppingLists
    .filter(sl => !sl.completed && !sl.isCompleted)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 2);

  /* reusable quick-action icon */
  const ActionIcon = ({ path, className='' }) => (
    <svg className={`w-8 h-8 mx-auto ${className}`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      {path}
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* greeting */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 text-lg">Ready to create something delicious today?</p>
        </header>

        {/* quick actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <Link to="/generate-recipe">
            <Card hover className="text-center py-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <ActionIcon path={<path d="M12 3v2m0 4v2m-4 4h8m2 6H6a2 2 0 01-2-2V7a2 2 0 012-2h2m8 0h2a2 2 0 012 2v12a2 2 0 01-2 2z"/>} className="text-purple-600 mb-3" />
              <h3 className="font-semibold text-purple-900 mb-1">Generate Recipe</h3>
              <p className="text-sm text-purple-700">Create recipes with AI</p>
            </Card>
          </Link>

          <Link to="/recipes">
            <Card hover className="text-center py-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <ActionIcon path={<path d="M4 19.5A2.5 2.5 0 006.5 22h11a2.5 2.5 0 002.5-2.5V6H4v13.5zM3 4h18M8 10h8"/>} className="text-blue-600 mb-3" />
              <h3 className="font-semibold text-blue-900 mb-1">Browse Recipes</h3>
              <p className="text-sm text-blue-700">Discover new dishes</p>
            </Card>
          </Link>

          <Link to="/meal-planner">
            <Card hover className="text-center py-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <ActionIcon path={<path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>} className="text-green-600 mb-3" />
              <h3 className="font-semibold text-green-900 mb-1">Plan Meals</h3>
              <p className="text-sm text-green-700">Organize weekly menus</p>
            </Card>
          </Link>

          <Link to="/shopping-list">
            <Card hover className="text-center py-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <ActionIcon path={<path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"/>} className="text-orange-600 mb-3" />
              <h3 className="font-semibold text-orange-900 mb-1">Shopping Lists</h3>
              <p className="text-sm text-orange-700">Manage ingredients</p>
            </Card>
          </Link>

        </section>

        



        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Recipes */}
          <div className="lg:col-span-2">
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg">
                      <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Recent Recipes</h2>
                  </div>
                  <Link to="/recipes">
                    <Button variant="ghost" size="sm" className="hidden sm:block">View All</Button>
                  </Link>
                </div>
              </Card.Header>
              <Card.Body>
                {recentRecipes.length > 0 ? (
                  <div className="space-y-4">
                    {recentRecipes.map((recipe, index) => {
                      const isEven = index % 2 === 0;
                      const cardClass = isEven 
                        ? 'bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-blue-100 border border-blue-100' 
                        : 'bg-gradient-to-r from-blue-50 to-blue-75 hover:from-blue-75 hover:to-blue-100 border border-blue-150';
                      
                      return (
                        <Link key={recipe._id} to={`/recipe/${recipe._id}`}>
                          {/* Mobile Layout */}
                          <div className={`block sm:hidden p-4 rounded-lg mb-4 ${cardClass} hover:shadow-md hover:-translate-y-[1px] transition-all duration-200`}>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-blue-500 flex-shrink-0">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-gray-900 text-sm leading-tight">{recipe.title}</h3>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 flex-shrink-0">
                                {recipe.isAIGenerated && (
                                  <span className="px-2 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 text-xs rounded-full font-medium">
                                    AI
                                  </span>
                                )}
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>{(recipe.prepTime || 0) + (recipe.cookTime || 0)}min</span>
                                </div>
                                <div className="flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                  </svg>
                                  <span>{recipe.servings}</span>
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${
                                recipe.difficulty === 'easy' ? 'from-green-100 to-green-200 text-green-700' :
                                recipe.difficulty === 'medium' ? 'from-yellow-100 to-yellow-200 text-yellow-700' :
                                'from-red-100 to-red-200 text-red-700'
                              }`}>
                                {recipe.difficulty}
                              </span>
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className={`hidden sm:flex items-center space-x-4 p-4 rounded-lg mb-4 ${cardClass} hover:shadow-md hover:-translate-y-[1px] transition-all duration-200`}>
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-blue-500">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 truncate text-base mb-1">{recipe.title}</h3>
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <div className="flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>{(recipe.prepTime || 0) + (recipe.cookTime || 0)}min</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 715.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                  </svg>
                                  <span>{recipe.servings} servings</span>
                                </div>
                                <span>•</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${
                                  recipe.difficulty === 'easy' ? 'from-green-100 to-green-200 text-green-700' :
                                  recipe.difficulty === 'medium' ? 'from-yellow-100 to-yellow-200 text-yellow-700' :
                                  'from-red-100 to-red-200 text-red-700'
                                }`}>
                                  {recipe.difficulty}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {recipe.isAIGenerated && (
                                <span className="px-2 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 text-xs rounded-full font-medium">
                                  AI
                                </span>
                              )}
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                    
                    {/* Mobile View All Button */}
                    <div className="block sm:hidden pt-2">
                      <Link to="/recipes">
                        <Button variant="outline" size="sm" className="w-full">
                          View All Recipes
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-blue-100">
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full inline-block mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No recipes yet</h3>
                    <p className="text-gray-600 mb-6 text-sm sm:text-base">Start your culinary journey by generating your first AI recipe!</p>
                    <Link to="/generate-recipe">
                      <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-sm sm:text-base">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Generate Your First Recipe
                      </Button>
                    </Link>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>


          {/* Sidebar - Meal Plans & Shopping Lists */}
          <div className="space-y-6">
            {/* Active Meal Plans */}
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Meal Plans</h2>
                  </div>
                  <Link to="/meal-planner">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
              </Card.Header>
              <Card.Body>
                {mealPlansLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <LoadingSpinner size="small" />
                  </div>
                ) : activeMealPlans.length > 0 ? (
                  <div className="space-y-3">
                    {activeMealPlans.map((plan) => (
                      <Link key={plan._id} to={`/meal-planner/${plan._id}`}>
                        <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-200 border border-green-200">
                          <h4 className="font-medium text-gray-900 text-sm mb-1">{plan.name}</h4>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>{plan.meals?.length || 0} meals planned</span>
                            <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Active</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-2xl mb-2">📅</div>
                    <p className="text-sm text-gray-600 mb-3">No active meal plans</p>
                    <Link to="/meal-planner">
                      <Button variant="outline" size="sm">Create Plan</Button>
                    </Link>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Pending Shopping Lists */}
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Shopping Lists</h2>
                  </div>
                  <Link to="/shopping-list">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
              </Card.Header>
              <Card.Body>
                {shoppingListsLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <LoadingSpinner size="small" />
                  </div>
                ) : pendingShoppingLists.length > 0 ? (
                  <div className="space-y-3">
                    {pendingShoppingLists.map((list) => {
                      const completedItems = list.items?.filter(item => item.completed || item.isCompleted)?.length || 0;
                      const totalItems = list.items?.length || 0;
                      const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

                      return (
                        <Link key={list._id} to={`/shopping-list/${list._id}`}>
                          <div className="p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all duration-200 border border-orange-200">
                            <h4 className="font-medium text-gray-900 text-sm mb-2">{list.name}</h4>
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                              <span>{totalItems} items</span>
                              <span>{progress}% complete</span>
                            </div>
                            {totalItems > 0 && (
                              <div className="w-full bg-gray-200 rounded-full h-1">
                                <div 
                                  className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-2xl mb-2">🛒</div>
                    <p className="text-sm text-gray-600 mb-3">No shopping lists</p>
                    <Link to="/shopping-list">
                      <Button variant="outline" size="sm">Create List</Button>
                    </Link>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;