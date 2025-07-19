const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    default: 'My Shopping List'
  },
  items: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      enum: ['produce', 'meat', 'dairy', 'pantry', 'frozen', 'bakery', 'beverages', 'other'],
      default: 'other'
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    estimatedPrice: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      default: ''
    }
  }],
  mealPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MealPlan'
  },
  totalEstimatedCost: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Calculate total cost before saving
shoppingListSchema.pre('save', function(next) {
  this.totalEstimatedCost = this.items.reduce((total, item) => {
    return total + (item.estimatedPrice || 0);
  }, 0);
  
  this.isCompleted = this.items.length > 0 && this.items.every(item => item.isCompleted);
  
  next();
});

shoppingListSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
