import React, { createContext, useContext, useState } from 'react';
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
  const [loading, setLoading] = useState(false);

  const fetchMealPlans = async (filters = {}) => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const fetchMealPlanById = async (id) => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const createMealPlan = async (mealPlanData) => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const updateMealPlan = async (id, updates) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const deleteMealPlan = async (id) => {
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
  };

  const addMealToDate = async (mealPlanId, date, mealType, recipeId) => {
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
  };

  const removeMealFromDate = async (mealPlanId, date, mealType, recipeId = null) => {
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
  };

  const generateShoppingList = async (mealPlanId) => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const value = {
    mealPlans,
    currentMealPlan,
    loading,
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
