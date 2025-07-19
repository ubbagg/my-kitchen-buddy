const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  meals: [{
    date: {
      type: Date,
      required: true
    },
    breakfast: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    },
    lunch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    },
    dinner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    },
    snacks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient queries
mealPlanSchema.index({ user: 1, startDate: 1 });
mealPlanSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model('MealPlan', mealPlanSchema);
