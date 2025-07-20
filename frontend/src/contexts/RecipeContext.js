import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';

const RecipeContext = createContext();

export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipe must be used within a RecipeProvider');
  }
  return context;
};

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [, setLoading] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);

  // Debounced loading state to prevent flickering
  const [debouncedLoading, setDebouncedLoading] = useState(false);

  const setLoadingWithDebounce = useCallback((isLoading) => {
    if (isLoading) {
      setDebouncedLoading(true);
      setLoading(true);
    } else {
      setLoading(false);
      // Small delay to prevent flickering
      setTimeout(() => {
        setDebouncedLoading(false);
      }, 150);
    }
  }, []);

  const generateRecipe = useCallback(async (ingredients, preferences = {}) => {
    setLoadingWithDebounce(true);
    try {
      const response = await api.post('/recipes/generate', {
        ingredients,
        preferences
      });
      
      const newRecipe = response.data.recipe;
      setRecipes(prev => [newRecipe, ...prev]);
      setCurrentRecipe(newRecipe);
      
      return { success: true, recipe: newRecipe };
    } catch (error) {
      console.error('Generate recipe error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate recipe'
      };
    } finally {
      setLoadingWithDebounce(false);
    }
  }, [setLoadingWithDebounce]);

  const analyzeImage = useCallback(async (imageFile) => {
    setLoadingWithDebounce(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await api.post('/recipes/analyze-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return { 
        success: true, 
        ingredients: response.data.ingredients 
      };
    } catch (error) {
      console.error('Image analysis error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to analyze image',
        ingredients: []
      };
    } finally {
      setLoadingWithDebounce(false);
    }
  }, [setLoadingWithDebounce]);

  const fetchRecipes = useCallback(async (filters = {}) => {
    setLoadingWithDebounce(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      
      const response = await api.get(`/recipes?${params}`);
      setRecipes(response.data.recipes);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Fetch recipes error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch recipes'
      };
    } finally {
      setLoadingWithDebounce(false);
    }
  }, [setLoadingWithDebounce]);

  const fetchRecipeById = useCallback(async (id) => {
    // Only show loading for longer operations
    if (!currentRecipe || currentRecipe._id !== id) {
      setLoadingWithDebounce(true);
    }
    
    try {
      const response = await api.get(`/recipes/${id}`);
      setCurrentRecipe(response.data);
      
      return { success: true, recipe: response.data };
    } catch (error) {
      console.error('Fetch recipe error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch recipe'
      };
    } finally {
      setLoadingWithDebounce(false);
    }
  }, [currentRecipe, setLoadingWithDebounce]);

  const addToFavorites = useCallback(async (recipeId) => {
    try {
      await api.post(`/recipes/${recipeId}/favorite`);
      return { success: true };
    } catch (error) {
      console.error('Add to favorites error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add to favorites'
      };
    }
  }, []);

  const removeFromFavorites = useCallback(async (recipeId) => {
    try {
      await api.delete(`/recipes/${recipeId}/favorite`);
      return { success: true };
    } catch (error) {
      console.error('Remove from favorites error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove from favorites'
      };
    }
  }, []);

  const value = {
    recipes,
    currentRecipe,
    loading: debouncedLoading, // Use debounced loading state
    generateRecipe,
    analyzeImage,
    fetchRecipes,
    fetchRecipeById,
    addToFavorites,
    removeFromFavorites,
    setCurrentRecipe
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
};
