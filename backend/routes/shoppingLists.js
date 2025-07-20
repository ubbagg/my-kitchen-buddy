const express = require('express');
const ShoppingList = require('../models/ShoppingList');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all shopping lists for user
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, completed } = req.query;
    
    const query = { user: req.user._id };
    if (completed !== undefined) {
      query.isCompleted = completed === 'true';
    }

    const shoppingLists = await ShoppingList.find(query)
      .populate('mealPlan', 'name startDate endDate')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ShoppingList.countDocuments(query);

    res.json({
      shoppingLists,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single shopping list
router.get('/:id', auth, async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('mealPlan', 'name startDate endDate');

    if (!shoppingList) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }

    res.json(shoppingList);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create shopping list
router.post('/', auth, async (req, res) => {
  try {
    const { name, items = [], mealPlan } = req.body;

    const shoppingList = new ShoppingList({
      user: req.user._id,
      name: name || 'My Shopping List',
      items,
      mealPlan
    });

    await shoppingList.save();
    await shoppingList.populate('mealPlan', 'name startDate endDate');

    res.status(201).json({
      message: 'Shopping list created successfully',
      shoppingList
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update shopping list
router.put('/:id', auth, async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!shoppingList) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }

    Object.keys(req.body).forEach(key => {
      shoppingList[key] = req.body[key];
    });

    await shoppingList.save();
    await shoppingList.populate('mealPlan', 'name startDate endDate');

    res.json({
      message: 'Shopping list updated successfully',
      shoppingList
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete shopping list
router.delete('/:id', auth, async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!shoppingList) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }

    res.json({ message: 'Shopping list deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add item to shopping list
router.post('/:id/items', auth, async (req, res) => {
  try {
    const { name, quantity, unit, category, estimatedPrice, notes } = req.body;

    const shoppingList = await ShoppingList.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!shoppingList) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }

    shoppingList.items.push({
      name,
      quantity,
      unit: unit || '',
      category: category || 'other',
      estimatedPrice: estimatedPrice || 0,
      notes: notes || ''
    });

    await shoppingList.save();

    res.json({
      message: 'Item added successfully',
      shoppingList
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update item in shopping list
router.put('/:id/items/:itemId', auth, async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!shoppingList) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }

    const item = shoppingList.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    Object.keys(req.body).forEach(key => {
      item[key] = req.body[key];
    });

    await shoppingList.save();

    res.json({
      message: 'Item updated successfully',
      shoppingList
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete item from shopping list
router.delete('/:id/items/:itemId', auth, async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!shoppingList) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }

    shoppingList.items.pull(req.params.itemId);
    await shoppingList.save();

    res.json({
      message: 'Item removed successfully',
      shoppingList
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle item completion
router.patch('/:id/items/:itemId/toggle', auth, async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!shoppingList) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }

    const item = shoppingList.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.isCompleted = !item.isCompleted;
    await shoppingList.save();

    res.json({
      message: 'Item toggled successfully',
      shoppingList
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
