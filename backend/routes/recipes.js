const express = require('express');
const multer = require('multer');
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');
const { generateRecipe, analyzeIngredientImage } = require('../../services/openaiService');

const router = express.Router();

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Get all recipes with filtering
router.get('/', async (req, res) => {
  try {
    const { 
      cuisine, 
      difficulty, 
      maxPrepTime, 
      dietaryTags, 
      search,
      page = 1,
      limit = 10 
    } = req.query;

    const query = {};
    
    if (cuisine) query.cuisine = new RegExp(cuisine, 'i');
    if (difficulty) query.difficulty = difficulty;
    if (maxPrepTime) query.prepTime = { $lte: parseInt(maxPrepTime) };
    if (dietaryTags) {
      const tags = dietaryTags.split(',');
      query.dietaryTags = { $in: tags };
    }
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const recipes = await Recipe.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Recipe.countDocuments(query);

    res.json({
      recipes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'name');
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate recipe from ingredients
router.post('/generate', auth, async (req, res) => {
  try {
    const { ingredients, preferences } = req.body;
    
    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ message: 'Ingredients are required' });
    }

    // Merge user preferences with request preferences
    const userPreferences = {
      dietaryPreferences: req.user.dietaryPreferences || [],
      allergies: req.user.allergies || [],
      ...preferences
    };

    const result = await generateRecipe(ingredients, userPreferences);
    
    if (!result.success) {
      return res.status(500).json({ message: 'Failed to generate recipe', error: result.error });
    }

    // Save the generated recipe
    const recipe = new Recipe({
      ...result.recipe,
      createdBy: req.user._id,
      isAIGenerated: true
    });

    await recipe.save();
    await recipe.populate('createdBy', 'name');

    res.status(201).json({
      message: 'Recipe generated successfully',
      recipe
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Analyze ingredients from image
router.post('/analyze-image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const result = await analyzeIngredientImage(req.file.buffer);
    
    if (!result.success) {
      return res.status(500).json({ 
        message: 'Failed to analyze image', 
        error: result.error,
        ingredients: []
      });
    }

    res.json({
      message: 'Image analyzed successfully',
      ingredients: result.ingredients
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create manual recipe
router.post('/', auth, async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      createdBy: req.user._id,
      isAIGenerated: false
    });
    
    await recipe.save();
    await recipe.populate('createdBy', 'name');
    
    res.status(201).json({
      message: 'Recipe created successfully',
      recipe
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add recipe to favorites
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const User = require('../models/User');
    const user = await User.findById(req.user._id);

    if (user.favoriteRecipes.includes(recipe._id)) {
      return res.status(400).json({ message: 'Recipe already in favorites' });
    }

    user.favoriteRecipes.push(recipe._id);
    await user.save();

    res.json({ message: 'Recipe added to favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;