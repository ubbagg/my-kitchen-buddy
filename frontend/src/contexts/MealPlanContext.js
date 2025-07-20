import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';

const MealPlanContext = createContext();

export const useMealPlan = () => {
  const context = useContext(MealPlanContext);
  if (!context) {
    throw new Error('useMealPlan must be used within a MealPlanProvider');
  }
  return context;
};

export const MealPlanProvider = ({ children }) => {
  const [mealPlans, setMealPlans] = useState([]);
  const [currentMealPlan, setCurrentMealPlan] = useState(null);
  
  // Debounced loading state to prevent flickering
  const [debouncedLoading, setDebouncedLoading] = useState(false);

  const setLoadingWithDebounce = useCallback((isLoading) => {
    if (isLoading) {
      setDebouncedLoading(true);
    } else {
      // Small delay to prevent flickering
      setTimeout(() => {
        setDebouncedLoading(false);
      }, 200);
    }
  }, []);

  const fetchMealPlans = useCallback(async (filters = {}) => {
    setLoadingWithDebounce(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined) params.append(key, filters[key]);
      });
      
      const response = await api.get(`/meal-plans?${params}`);
      setMealPlans(response.data.mealPlans);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Fetch meal plans error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch meal plans'
      };
    } finally {
      setLoadingWithDebounce(false);
    }
  }, [setLoadingWithDebounce]);

  const fetchMealPlanById = useCallback(async (id) => {
    // Only show loading for new meal plans or if no current meal plan
    if (!currentMealPlan || currentMealPlan._id !== id) {
      setLoadingWithDebounce(true);
    }
    
    try {
      const response = await api.get(`/meal-plans/${id}`);
      setCurrentMealPlan(response.data);
      
      return { success: true, mealPlan: response.data };
    } catch (error) {
      console.error('Fetch meal plan error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch meal plan'
      };
    } finally {
      setLoadingWithDebounce(false);
    }
  }, [currentMealPlan, setLoadingWithDebounce]);

  const createMealPlan = useCallback(async (mealPlanData) => {
    setLoadingWithDebounce(true);
    try {
      const response = await api.post('/meal-plans', mealPlanData);
      const newMealPlan = response.data.mealPlan;
      
      setMealPlans(prev => [newMealPlan, ...prev]);
      setCurrentMealPlan(newMealPlan);
      
      return { success: true, mealPlan: newMealPlan };
    } catch (error) {
      console.error('Create meal plan error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create meal plan'
      };
    } finally {
      setLoadingWithDebounce(false);
    }
  }, [setLoadingWithDebounce]);

  const updateMealPlan = useCallback(async (id, updates) => {
    try {
      const response = await api.put(`/meal-plans/${id}`, updates);
      const updatedMealPlan = response.data.mealPlan;
      
      setMealPlans(prev => prev.map(mp => mp._id === id ? updatedMealPlan : mp));
      setCurrentMealPlan(updatedMealPlan);
      
      return { success: true, mealPlan: updatedMealPlan };
    } catch (error) {
      console.error('Update meal plan error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update meal plan'
      };
    }
  }, []);

  const deleteMealPlan = useCallback(async (id) => {
    try {
      await api.delete(`/meal-plans/${id}`);
      
      setMealPlans(prev => prev.filter(mp => mp._id !== id));
      if (currentMealPlan?._id === id) {
        setCurrentMealPlan(null);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Delete meal plan error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete meal plan'
      };
    }
  }, [currentMealPlan]);

  const addMealToDate = useCallback(async (mealPlanId, date, mealType, recipeId) => {
    try {
      const response = await api.put(`/meal-plans/${mealPlanId}/meals`, {
        date,
        mealType,
        recipeId
      });
      
      const updatedMealPlan = response.data.mealPlan;
      setCurrentMealPlan(updatedMealPlan);
      
      return { success: true, mealPlan: updatedMealPlan };
    } catch (error) {
      console.error('Add meal error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add meal'
      };
    }
  }, []);

  const removeMealFromDate = useCallback(async (mealPlanId, date, mealType, recipeId = null) => {
    try {
      const response = await api.delete(`/meal-plans/${mealPlanId}/meals`, {
        data: { date, mealType, recipeId }
      });
      
      const updatedMealPlan = response.data.mealPlan;
      setCurrentMealPlan(updatedMealPlan);
      
      return { success: true, mealPlan: updatedMealPlan };
    } catch (error) {
      console.error('Remove meal error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove meal'
      };
    }
  }, []);

  const generateShoppingList = useCallback(async (mealPlanId) => {
    setLoadingWithDebounce(true);
    try {
      const response = await api.post(`/meal-plans/${mealPlanId}/shopping-list`);
      
      return { success: true, shoppingList: response.data.shoppingList };
    } catch (error) {
      console.error('Generate shopping list error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate shopping list'
      };
    } finally {
      setLoadingWithDebounce(false);
    }
  }, [setLoadingWithDebounce]);

  const value = {
    mealPlans,
    currentMealPlan,
    loading: debouncedLoading, // Use debounced loading
    fetchMealPlans,
    fetchMealPlanById,
    createMealPlan,
    updateMealPlan,
    deleteMealPlan,
    addMealToDate,
    removeMealFromDate,
    generateShoppingList,
    setCurrentMealPlan
  };

  return (
    <MealPlanContext.Provider value={value}>
      {children}
    </MealPlanContext.Provider>
  );
};
