const express = require('express');
const MealPlan = require('../models/MealPlan');
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all meal plans for user
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, active } = req.query;
    
    const query = { user: req.user._id };
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    const mealPlans = await MealPlan.find(query)
      .populate({
        path: 'meals.breakfast meals.lunch meals.dinner meals.snacks',
        select: 'title description prepTime cookTime servings difficulty cuisine'
      })
      .sort({ startDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MealPlan.countDocuments(query);

    res.json({
      mealPlans,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single meal plan
router.get('/:id', auth, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate({
      path: 'meals.breakfast meals.lunch meals.dinner meals.snacks',
      select: 'title description prepTime cookTime servings difficulty cuisine ingredients nutrition'
    });

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    res.json(mealPlan);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create meal plan
router.post('/', auth, async (req, res) => {
  try {
    const { name, startDate, endDate, meals = [] } = req.body;

    const mealPlan = new MealPlan({
      user: req.user._id,
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      meals
    });

    await mealPlan.save();
    await mealPlan.populate({
      path: 'meals.breakfast meals.lunch meals.dinner meals.snacks',
      select: 'title description prepTime cookTime servings difficulty cuisine'
    });

    res.status(201).json({
      message: 'Meal plan created successfully',
      mealPlan
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update meal plan
router.put('/:id', auth, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    Object.keys(req.body).forEach(key => {
      mealPlan[key] = req.body[key];
    });

    await mealPlan.save();
    await mealPlan.populate({
      path: 'meals.breakfast meals.lunch meals.dinner meals.snacks',
      select: 'title description prepTime cookTime servings difficulty cuisine'
    });

    res.json({
      message: 'Meal plan updated successfully',
      mealPlan
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete meal plan
router.delete('/:id', auth, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    res.json({ message: 'Meal plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add/Update meal to specific date
router.put('/:id/meals', auth, async (req, res) => {
  try {
    const { date, mealType, recipeId } = req.body;

    const mealPlan = await MealPlan.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    // Verify recipe exists
    if (recipeId) {
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
    }

    // Find or create meal entry for the date
    let mealEntry = mealPlan.meals.find(m => 
      m.date.toDateString() === new Date(date).toDateString()
    );

    if (!mealEntry) {
      mealEntry = {
        date: new Date(date),
        breakfast: null,
        lunch: null,
        dinner: null,
        snacks: []
      };
      mealPlan.meals.push(mealEntry);
    }

    // Update the specific meal type
    if (mealType === 'snacks') {
      if (recipeId && !mealEntry.snacks.includes(recipeId)) {
        mealEntry.snacks.push(recipeId);
      }
    } else {
      mealEntry[mealType] = recipeId;
    }

    await mealPlan.save();
    await mealPlan.populate({
      path: 'meals.breakfast meals.lunch meals.dinner meals.snacks',
      select: 'title description prepTime cookTime servings difficulty cuisine'
    });

    res.json({
      message: 'Meal updated successfully',
      mealPlan
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove meal from specific date
router.delete('/:id/meals', auth, async (req, res) => {
  try {
    const { date, mealType, recipeId } = req.body;

    const mealPlan = await MealPlan.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    const mealEntry = mealPlan.meals.find(m => 
      m.date.toDateString() === new Date(date).toDateString()
    );

    if (mealEntry) {
      if (mealType === 'snacks' && recipeId) {
        mealEntry.snacks = mealEntry.snacks.filter(id => id.toString() !== recipeId);
      } else {
        mealEntry[mealType] = null;
      }
    }

    await mealPlan.save();
    await mealPlan.populate({
      path: 'meals.breakfast meals.lunch meals.dinner meals.snacks',
      select: 'title description prepTime cookTime servings difficulty cuisine'
    });

    res.json({
      message: 'Meal removed successfully',
      mealPlan
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate shopping list from meal plan
router.post('/:id/shopping-list', auth, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate({
      path: 'meals.breakfast meals.lunch meals.dinner meals.snacks',
      select: 'ingredients'
    });

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    // Collect all ingredients from all recipes in the meal plan
    const ingredientMap = new Map();

    mealPlan.meals.forEach(meal => {
      const recipes = [
        meal.breakfast,
        meal.lunch,
        meal.dinner,
        ...(meal.snacks || [])
      ].filter(recipe => recipe && recipe.ingredients);

      recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
          const key = ingredient.name.toLowerCase();
          
          if (ingredientMap.has(key)) {
            const existing = ingredientMap.get(key);
            // Simple quantity addition (you might want more sophisticated merging)
            const existingQty = parseFloat(existing.quantity) || 0;
            const newQty = parseFloat(ingredient.quantity) || 0;
            existing.quantity = (existingQty + newQty).toString();
          } else {
            ingredientMap.set(key, {
              name: ingredient.name,
              quantity: ingredient.quantity,
              unit: ingredient.unit || '',
              category: categorizeIngredient(ingredient.name)
            });
          }
        });
      });
    });

    const ShoppingList = require('../models/ShoppingList');
    
    const shoppingList = new ShoppingList({
      user: req.user._id,
      name: `Shopping List for ${mealPlan.name}`,
      mealPlan: mealPlan._id,
      items: Array.from(ingredientMap.values())
    });

    await shoppingList.save();

    res.status(201).json({
      message: 'Shopping list generated successfully',
      shoppingList
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to categorize ingredients
function categorizeIngredient(ingredientName) {
  const name = ingredientName.toLowerCase();
  
  const categories = {
    produce: ['tomato', 'onion', 'garlic', 'carrot', 'potato', 'lettuce', 'spinach', 'apple', 'banana', 'lemon', 'lime', 'cucumber', 'pepper', 'mushroom', 'broccoli', 'cauliflower', 'celery', 'herbs', 'parsley', 'cilantro', 'basil', 'thyme'],
    meat: ['chicken', 'beef', 'pork', 'turkey', 'fish', 'salmon', 'tuna', 'shrimp', 'lamb', 'bacon', 'sausage'],
    dairy: ['milk', 'cheese', 'butter', 'yogurt', 'cream', 'eggs', 'cottage cheese'],
    pantry: ['rice', 'pasta', 'flour', 'sugar', 'salt', 'pepper', 'oil', 'vinegar', 'soy sauce', 'spices', 'beans', 'lentils', 'oats', 'quinoa', 'nuts', 'seeds'],
    frozen: ['frozen', 'ice cream'],
    bakery: ['bread', 'rolls', 'bagels', 'muffins'],
    beverages: ['water', 'juice', 'soda', 'coffee', 'tea', 'wine', 'beer']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => name.includes(keyword))) {
      return category;
    }
  }
  
  return 'other';
}

module.exports = router;
