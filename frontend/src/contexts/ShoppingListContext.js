import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';

const ShoppingListContext = createContext();

export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
};

export const ShoppingListProvider = ({ children }) => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [currentShoppingList, setCurrentShoppingList] = useState(null);
  
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

  const fetchShoppingLists = useCallback(async (filters = {}) => {
    setLoadingWithDebounce(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined) params.append(key, filters[key]);
      });
      
      const response = await api.get(`/shopping-lists?${params}`);
      setShoppingLists(response.data.shoppingLists);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Fetch shopping lists error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch shopping lists'
      };
    } finally {
      setLoadingWithDebounce(false);
    }
  }, [setLoadingWithDebounce]);

  const fetchShoppingListById = useCallback(async (id) => {
    // Only show loading for new shopping lists or if no current list
    if (!currentShoppingList || currentShoppingList._id !== id) {
      setLoadingWithDebounce(true);
    }
    
    try {
      const response = await api.get(`/shopping-lists/${id}`);
      setCurrentShoppingList(response.data);
      
      return { success: true, shoppingList: response.data };
    } catch (error) {
      console.error('Fetch shopping list error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch shopping list'
      };
    } finally {
      setLoadingWithDebounce(false);
    }
  }, [currentShoppingList, setLoadingWithDebounce]);

  const createShoppingList = useCallback(async (shoppingListData) => {
    setLoadingWithDebounce(true);
    try {
      const response = await api.post('/shopping-lists', shoppingListData);
      const newShoppingList = response.data.shoppingList;
      
      setShoppingLists(prev => [newShoppingList, ...prev]);
      setCurrentShoppingList(newShoppingList);
      
      return { success: true, shoppingList: newShoppingList };
    } catch (error) {
      console.error('Create shopping list error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create shopping list'
      };
    } finally {
      setLoadingWithDebounce(false);
    }
  }, [setLoadingWithDebounce]);

  const updateShoppingList = useCallback(async (id, updates) => {
    try {
      const response = await api.put(`/shopping-lists/${id}`, updates);
      const updatedShoppingList = response.data.shoppingList;
      
      setShoppingLists(prev => prev.map(sl => sl._id === id ? updatedShoppingList : sl));
      setCurrentShoppingList(updatedShoppingList);
      
      return { success: true, shoppingList: updatedShoppingList };
    } catch (error) {
      console.error('Update shopping list error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update shopping list'
      };
    }
  }, []);

  const deleteShoppingList = useCallback(async (id) => {
    try {
      await api.delete(`/shopping-lists/${id}`);
      
      setShoppingLists(prev => prev.filter(sl => sl._id !== id));
      if (currentShoppingList?._id === id) {
        setCurrentShoppingList(null);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Delete shopping list error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete shopping list'
      };
    }
  }, [currentShoppingList]);

  const addItem = useCallback(async (shoppingListId, item) => {
    try {
      const response = await api.post(`/shopping-lists/${shoppingListId}/items`, item);
      const updatedShoppingList = response.data.shoppingList;
      
      setCurrentShoppingList(updatedShoppingList);
      
      return { success: true, shoppingList: updatedShoppingList };
    } catch (error) {
      console.error('Add item error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add item'
      };
    }
  }, []);

  const updateItem = useCallback(async (shoppingListId, itemId, updates) => {
    try {
      const response = await api.put(`/shopping-lists/${shoppingListId}/items/${itemId}`, updates);
      const updatedShoppingList = response.data.shoppingList;
      
      setCurrentShoppingList(updatedShoppingList);
      
      return { success: true, shoppingList: updatedShoppingList };
    } catch (error) {
      console.error('Update item error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update item'
      };
    }
  }, []);

  const deleteItem = useCallback(async (shoppingListId, itemId) => {
    try {
      const response = await api.delete(`/shopping-lists/${shoppingListId}/items/${itemId}`);
      const updatedShoppingList = response.data.shoppingList;
      
      setCurrentShoppingList(updatedShoppingList);
      
      return { success: true, shoppingList: updatedShoppingList };
    } catch (error) {
      console.error('Delete item error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete item'
      };
    }
  }, []);

  const toggleItemCompleted = useCallback(async (shoppingListId, itemId) => {
    try {
      const response = await api.patch(`/shopping-lists/${shoppingListId}/items/${itemId}/toggle`);
      const updatedShoppingList = response.data.shoppingList;
      
      setCurrentShoppingList(updatedShoppingList);
      
      return { success: true, shoppingList: updatedShoppingList };
    } catch (error) {
      console.error('Toggle item error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to toggle item'
      };
    }
  }, []);

  const value = {
    shoppingLists,
    currentShoppingList,
    loading: debouncedLoading, // Use debounced loading
    fetchShoppingLists,
    fetchShoppingListById,
    createShoppingList,
    updateShoppingList,
    deleteShoppingList,
    addItem,
    updateItem,
    deleteItem,
    toggleItemCompleted,
    setCurrentShoppingList
  };

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
};
