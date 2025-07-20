import React, { useState, useEffect, useCallback } from 'react';
import { useShoppingList } from '../../contexts/ShoppingListContext';
import Button from '../Common/Button';
import Input from '../Common/Input';

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

  // Memoize functions
  const loadShoppingLists = useCallback(async () => {
    const result = await fetchShoppingLists();
    if (initialLoading) {
      setInitialLoading(false); // Set initial loading to false
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Lists 🛒</h1>
            <Button onClick={() => setShowCreateForm(true)}>
              Create New List
            </Button>
          </div>
        </div>

        {/* Create List Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Create New Shopping List</h2>
              <form onSubmit={handleCreateList}>
                <Input
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Enter list name..."
                  required
                />
                <div className="flex justify-end space-x-3 mt-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Shopping Lists Sidebar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Your Lists</h2>
            
            {loading && shoppingLists.length === 0 ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : shoppingLists.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-gray-600 mb-4">No shopping lists yet</p>
                <Button onClick={() => setShowCreateForm(true)} size="sm">
                  Create Your First List
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {shoppingLists.map((list) => (
                  <div
                    key={list._id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedListId === list._id
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedListId(list._id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 truncate">{list.name}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-gray-600">
                            {list.items?.length || 0} items
                          </span>
                          {list.mealPlan && (
                            <span className="px-1 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                              Meal Plan
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            list.isCompleted 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {list.isCompleted ? 'Completed' : 'In Progress'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatCurrency(list.totalEstimatedCost || 0)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteList(list._id);
                        }}
                        className="ml-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shopping List Details */}
          <div className="lg:col-span-3">
            {currentShoppingList ? (
              <ShoppingListDetail shoppingList={currentShoppingList} />
            ) : selectedListId && loading ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a Shopping List
                </h3>
                <p className="text-gray-600">
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

// Shopping List Detail Component
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
    { value: 'produce', label: '🥬 Produce' },
    { value: 'meat', label: '🥩 Meat & Seafood' },
    { value: 'dairy', label: '🥛 Dairy & Eggs' },
    { value: 'pantry', label: '🥫 Pantry' },
    { value: 'frozen', label: '🧊 Frozen' },
    { value: 'bakery', label: '🍞 Bakery' },
    { value: 'beverages', label: '🥤 Beverages' },
    { value: 'other', label: '🛒 Other' }
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
  // const pendingItems = shoppingList.items?.filter(item => !item.isCompleted) || [];

  const getCategoryIcon = (category) => {
    const icons = {
      produce: '🥬',
      meat: '🥩',
      dairy: '🥛',
      pantry: '🥫',
      frozen: '🧊',
      bakery: '🍞',
      beverages: '🥤',
      other: '🛒'
    };
    return icons[category] || icons.other;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <input
              type="text"
              value={shoppingList.name}
              onBlur={(e) => handleUpdateListName(e.target.value)}
              onChange={(e) => {}} // Handled by onBlur
              className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none focus:bg-gray-50 rounded px-2 py-1"
            />
            <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
              <span>{shoppingList.items?.length || 0} total items</span>
              <span>{completedItems.length} completed</span>
              <span className="font-medium">
                Total: {formatCurrency(shoppingList.totalEstimatedCost || 0)}
              </span>
              {shoppingList.mealPlan && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                  From Meal Plan
                </span>
              )}
            </div>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            Add Item
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>
              {Math.round((completedItems.length / Math.max(shoppingList.items?.length || 1, 1)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(completedItems.length / Math.max(shoppingList.items?.length || 1, 1)) * 100}%`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Add/Edit Item Form */}
      {showAddForm && (
        <div className="p-6 border-b bg-gray-50">
          <h3 className="text-lg font-medium mb-4">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h3>
          <form onSubmit={editingItem ? handleUpdateItem : handleAddItem}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={itemForm.category}
                  onChange={(e) => setItemForm({...itemForm, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <Input
                  value={itemForm.notes}
                  onChange={(e) => setItemForm({...itemForm, notes: e.target.value})}
                  placeholder="Optional notes..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
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
              >
                Cancel
              </Button>
              <Button type="submit">
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
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your shopping list is empty
            </h3>
            <p className="text-gray-600 mb-6">
              Add items to get started with your shopping
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              Add Your First Item
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pending Items by Category */}
            {Object.entries(groupedItems).map(([category, items]) => {
              const pendingCategoryItems = items.filter(item => !item.isCompleted);
              if (pendingCategoryItems.length === 0) return null;

              return (
                <div key={category}>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <span className="mr-2">{getCategoryIcon(category)}</span>
                    {categories.find(cat => cat.value === category)?.label.split(' ').slice(1).join(' ') || category}
                    <span className="ml-2 text-sm text-gray-500">
                      ({pendingCategoryItems.length})
                    </span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">✅</span>
                  Completed Items
                  <span className="ml-2 text-sm text-gray-500">
                    ({completedItems.length})
                  </span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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

// Shopping List Item Component
const ShoppingListItem = ({ item, onToggle, onEdit, onDelete, completed = false }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className={`border rounded-lg p-3 transition-all ${
      completed 
        ? 'bg-gray-50 border-gray-200 opacity-75' 
        : 'bg-white border-gray-300 hover:border-blue-300'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1">
          <button
            onClick={onToggle}
            className={`flex-shrink-0 w-5 h-5 rounded border-2 mr-3 mt-0.5 transition-colors ${
              completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {completed && '✓'}
          </button>
          
          <div className="flex-1">
            <h4 className={`font-medium ${completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {item.name}
            </h4>
            <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
              <span>{item.quantity} {item.unit}</span>
              {item.estimatedPrice > 0 && (
                <span>• {formatCurrency(item.estimatedPrice)}</span>
              )}
            </div>
            {item.notes && (
              <p className="text-xs text-gray-500 mt-1">{item.notes}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-blue-600 text-xs"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-600 text-xs"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
