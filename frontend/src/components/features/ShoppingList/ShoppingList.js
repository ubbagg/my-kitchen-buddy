import React, { useState, useEffect, useCallback } from 'react';
import { useShoppingList } from '../../../contexts/ShoppingListContext';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

const ShoppingList = () => {
  const {
    shoppingLists,
    currentShoppingList,
    fetchShoppingLists,
    fetchShoppingListById,
    createShoppingList,
    deleteShoppingList,
    loading
  } = useShoppingList();

  const [selectedListId, setSelectedListId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

  const loadShoppingLists = useCallback(async () => {
    const result = await fetchShoppingLists();
    if (initialLoading) {
      setInitialLoading(false);
    }
    return result;
  }, [fetchShoppingLists, initialLoading]);

  const loadShoppingListById = useCallback((id) => {
    fetchShoppingListById(id);
  }, [fetchShoppingListById]);

  useEffect(() => {
    loadShoppingLists();
  }, [loadShoppingLists]);

  useEffect(() => {
    if (shoppingLists.length > 0 && !selectedListId) {
      setSelectedListId(shoppingLists[0]._id);
    }
  }, [shoppingLists, selectedListId]);

  useEffect(() => {
    if (selectedListId) {
      loadShoppingListById(selectedListId);
    }
  }, [selectedListId, loadShoppingListById]);

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your shopping lists...</p>
        </div>
      </div>
    );
  }

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    const result = await createShoppingList({
      name: newListName,
      items: []
    });

    if (result.success) {
      setShowCreateForm(false);
      setNewListName('');
      setSelectedListId(result.shoppingList._id);
    }
  };

  const handleDeleteList = async (listId) => {
    if (window.confirm('Are you sure you want to delete this shopping list?')) {
      const result = await deleteShoppingList(listId);
      if (result.success) {
        if (selectedListId === listId) {
          setSelectedListId(shoppingLists.find(list => list._id !== listId)?._id || null);
        }
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <svg className="w-8 h-8 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                </svg>
                Shopping Lists
              </h1>
              <p className="text-gray-600 mt-2">Organize your shopping and track your purchases</p>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New List
            </Button>
          </div>
        </div>

        {/* Create List Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create New Shopping List</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateList}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    List Name
                  </label>
                  <Input
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="e.g., Weekly Groceries, Party Supplies..."
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewListName('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={loading}>
                    Create List
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Shopping Lists Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Your Lists
              </h2>
              
              {loading && shoppingLists.length === 0 ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                </div>
              ) : shoppingLists.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                  </svg>
                  <p className="text-gray-600 mb-4">No shopping lists yet</p>
                  <Button 
                    onClick={() => setShowCreateForm(true)} 
                    size="sm"
                    variant="outline"
                  >
                    Create Your First List
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {shoppingLists.map((list) => (
                    <div
                      key={list._id}
                      className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                        selectedListId === list._id
                          ? 'bg-blue-50 border-blue-300 shadow-md'
                          : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:shadow-sm'
                      }`}
                      onClick={() => setSelectedListId(list._id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{list.name}</h3>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              {list.items?.length || 0} items
                            </span>
                            {list.mealPlan && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                Meal Plan
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              list.isCompleted 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {list.isCompleted ? 'Completed' : 'In Progress'}
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                              {formatCurrency(list.totalEstimatedCost || 0)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteList(list._id);
                          }}
                          className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Shopping List Details */}
          <div className="lg:col-span-3">
            {currentShoppingList ? (
              <ShoppingListDetail shoppingList={currentShoppingList} />
            ) : selectedListId && loading ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <svg className="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a Shopping List
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Choose a shopping list from the sidebar to view and manage your items
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Shopping List Detail Component
const ShoppingListDetail = ({ shoppingList }) => {
  const {
    addItem,
    updateItem,
    deleteItem,
    toggleItemCompleted,
    updateShoppingList
  } = useShoppingList();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    quantity: '',
    unit: '',
    category: 'other',
    estimatedPrice: 0,
    notes: ''
  });

  const categories = [
    { value: 'produce', label: 'Produce', icon: '🥬' },
    { value: 'meat', label: 'Meat & Seafood', icon: '🥩' },
    { value: 'dairy', label: 'Dairy & Eggs', icon: '🥛' },
    { value: 'pantry', label: 'Pantry', icon: '🥫' },
    { value: 'frozen', label: 'Frozen', icon: '🧊' },
    { value: 'bakery', label: 'Bakery', icon: '🍞' },
    { value: 'beverages', label: 'Beverages', icon: '🥤' },
    { value: 'other', label: 'Other', icon: '🛒' }
  ];

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!itemForm.name.trim() || !itemForm.quantity.trim()) return;

    const result = await addItem(shoppingList._id, {
      ...itemForm,
      estimatedPrice: parseFloat(itemForm.estimatedPrice) || 0
    });

    if (result.success) {
      setShowAddForm(false);
      setItemForm({
        name: '',
        quantity: '',
        unit: '',
        category: 'other',
        estimatedPrice: 0,
        notes: ''
      });
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    if (!editingItem || !itemForm.name.trim() || !itemForm.quantity.trim()) return;

    const result = await updateItem(shoppingList._id, editingItem._id, {
      ...itemForm,
      estimatedPrice: parseFloat(itemForm.estimatedPrice) || 0
    });

    if (result.success) {
      setEditingItem(null);
      setItemForm({
        name: '',
        quantity: '',
        unit: '',
        category: 'other',
        estimatedPrice: 0,
        notes: ''
      });
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit || '',
      category: item.category || 'other',
      estimatedPrice: item.estimatedPrice || 0,
      notes: item.notes || ''
    });
    setShowAddForm(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteItem(shoppingList._id, itemId);
    }
  };

  const handleToggleItem = async (itemId) => {
    await toggleItemCompleted(shoppingList._id, itemId);
  };

  const handleUpdateListName = async (newName) => {
    if (newName.trim() && newName !== shoppingList.name) {
      await updateShoppingList(shoppingList._id, { name: newName });
    }
  };

  const groupedItems = shoppingList.items?.reduce((acc, item) => {
    const category = item.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {}) || {};

  const completedItems = shoppingList.items?.filter(item => item.isCompleted) || [];

  const getCategoryData = (category) => {
    return categories.find(cat => cat.value === category) || categories.find(cat => cat.value === 'other');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1">
            <input
              type="text"
              defaultValue={shoppingList.name}
              onBlur={(e) => handleUpdateListName(e.target.value)}
              className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none focus:bg-gray-50 rounded px-2 py-1 w-full"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {shoppingList.items?.length || 0} total
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {completedItems.length} done
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                {formatCurrency(shoppingList.totalEstimatedCost || 0)}
              </div>
              {shoppingList.mealPlan && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  From Meal Plan
                </span>
              )}
            </div>
          </div>
          
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Item
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Shopping Progress</span>
            <span className="font-medium">
              {Math.round((completedItems.length / Math.max(shoppingList.items?.length || 1, 1)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${(completedItems.length / Math.max(shoppingList.items?.length || 1, 1)) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Add/Edit Item Form */}
      {showAddForm && (
        <div className="p-6 border-b bg-gradient-to-br from-blue-50 to-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h3>
          <form onSubmit={editingItem ? handleUpdateItem : handleAddItem}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <Input
                  value={itemForm.name}
                  onChange={(e) => setItemForm({...itemForm, name: e.target.value})}
                  placeholder="e.g., Bananas"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <Input
                    value={itemForm.quantity}
                    onChange={(e) => setItemForm({...itemForm, quantity: e.target.value})}
                    placeholder="2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <Input
                    value={itemForm.unit}
                    onChange={(e) => setItemForm({...itemForm, unit: e.target.value})}
                    placeholder="lbs"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={itemForm.category}
                  onChange={(e) => setItemForm({...itemForm, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Price
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={itemForm.estimatedPrice}
                  onChange={(e) => setItemForm({...itemForm, estimatedPrice: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <Input
                  value={itemForm.notes}
                  onChange={(e) => setItemForm({...itemForm, notes: e.target.value})}
                  placeholder="Optional notes..."
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingItem(null);
                  setItemForm({
                    name: '',
                    quantity: '',
                    unit: '',
                    category: 'other',
                    estimatedPrice: 0,
                    notes: ''
                  });
                }}
                className="order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="order-1 sm:order-2">
                {editingItem ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Shopping List Items */}
      <div className="p-6">
        {!shoppingList.items || shoppingList.items.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your shopping list is empty
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Add items to get started with your shopping and stay organized
            </p>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              Add Your First Item
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Pending Items by Category */}
            {Object.entries(groupedItems).map(([category, items]) => {
              const pendingCategoryItems = items.filter(item => !item.isCompleted);
              if (pendingCategoryItems.length === 0) return null;

              const categoryData = getCategoryData(category);

              return (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-3">{categoryData.icon}</span>
                    {categoryData.label}
                    <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                      {pendingCategoryItems.length}
                    </span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {pendingCategoryItems.map((item) => (
                      <ShoppingListItem
                        key={item._id}
                        item={item}
                        onToggle={() => handleToggleItem(item._id)}
                        onEdit={() => handleEditItem(item)}
                        onDelete={() => handleDeleteItem(item._id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Completed Items */}
            {completedItems.length > 0 && (
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Completed Items
                  <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {completedItems.length}
                  </span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {completedItems.map((item) => (
                    <ShoppingListItem
                      key={item._id}
                      item={item}
                      onToggle={() => handleToggleItem(item._id)}
                      onEdit={() => handleEditItem(item)}
                      onDelete={() => handleDeleteItem(item._id)}
                      completed
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Shopping List Item Component
const ShoppingListItem = ({ item, onToggle, onEdit, onDelete, completed = false }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className={`group border-2 rounded-xl p-4 transition-all duration-200 ${
      completed 
        ? 'bg-gray-50 border-gray-200 opacity-75' 
        : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md hover:-translate-y-[1px]'
    }`}>
      <div className="flex items-start space-x-3">
        <button
          onClick={onToggle}
          className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
            completed
              ? 'bg-green-500 border-green-500 text-white shadow-md'
              : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
          }`}
        >
          {completed && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium text-base ${completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {item.name}
          </h4>
          <div className="flex items-center flex-wrap gap-2 mt-2 text-sm text-gray-600">
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              {item.quantity} {item.unit}
            </span>
            {item.estimatedPrice > 0 && (
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                {formatCurrency(item.estimatedPrice)}
              </span>
            )}
          </div>
          {item.notes && (
            <p className="text-sm text-gray-500 mt-2 italic">{item.notes}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            title="Edit item"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
            title="Delete item"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
