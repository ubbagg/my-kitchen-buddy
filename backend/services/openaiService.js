const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateRecipePrompt = (ingredients, dietaryPreferences, allergies, cuisine, mealType) => {
  let prompt = `Create a detailed recipe using these ingredients: ${ingredients.join(', ')}.

Requirements:
- Make it a ${mealType || 'main dish'}
- ${cuisine ? `Cuisine style: ${cuisine}` : 'Any cuisine style'}
- ${dietaryPreferences.length > 0 ? `Dietary preferences: ${dietaryPreferences.join(', ')}` : ''}
- ${allergies.length > 0 ? `Avoid these allergens: ${allergies.join(', ')}` : ''}
- Include exact measurements and cooking times
- Provide nutritional estimates (calories, protein, carbs, fat per serving)
- Rate the difficulty (easy/medium/hard)

Format the response as a JSON object with this exact structure:
{
  "title": "Recipe Name",
  "description": "Brief description",
  "ingredients": [
    {"name": "ingredient name", "quantity": "amount", "unit": "unit"}
  ],
  "instructions": ["step 1", "step 2", "step 3"],
  "prepTime": 15,
  "cookTime": 30,
  "servings": 4,
  "difficulty": "easy|medium|hard",
  "cuisine": "cuisine type",
  "dietaryTags": ["tag1", "tag2"],
  "nutrition": {
    "calories": 400,
    "protein": 25,
    "carbs": 45,
    "fat": 12,
    "fiber": 5
  }
}`;

  return prompt;
};

const generateRecipe = async (ingredients, userPreferences = {}) => {
  try {
    const prompt = generateRecipePrompt(
      ingredients,
      userPreferences.dietaryPreferences || [],
      userPreferences.allergies || [],
      userPreferences.cuisine,
      userPreferences.mealType
    );

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional chef and nutritionist. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const recipeText = response.choices[0].message.content;

    let recipeData;
    try {
      recipeData = JSON.parse(recipeText);
    } catch (parseError) {
      // Try to extract JSON from the response using regex
      const jsonMatch = recipeText.match(/```json([\s\S]*?)```|({[\s\S]*})/);
      if (jsonMatch) {
        const jsonString = jsonMatch[1] ? jsonMatch[1] : jsonMatch[0];
        recipeData = JSON.parse(jsonString);
      } else {
        throw new Error('Failed to parse recipe JSON');
      }
    }

    return {
      success: true,
      recipe: recipeData
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const analyzeIngredientImage = async (imageBuffer) => {
  try {
    const base64Image = imageBuffer.toString('base64');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Identify all the food ingredients in this image. Return only a JSON array of ingredient names. Example: [\"tomatoes\", \"onions\", \"garlic\"]"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 300
    });

    const result = response.choices[0].message.content;
    const ingredients = JSON.parse(result);
    
    return {
      success: true,
      ingredients: ingredients
    };
  } catch (error) {
    console.error('Image analysis error:', error);
    return {
      success: false,
      error: error.message,
      ingredients: []
    };
  }
};

module.exports = {
  generateRecipe,
  analyzeIngredientImage
};